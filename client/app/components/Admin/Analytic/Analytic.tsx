import React, { useEffect, useState, useRef } from "react";
import {
  useGetUsersQuery,
  useCreateBinMutation,
  useUpdateBinMutation,
  useDeleteBinMutation,
  useGetBinsByIdQuery,
  useUpdateBinStatusMutation,
  useGetBinStatusReportQuery,
} from "@/redux/features/auth/authApi";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";
import { styles } from "../../../../app/styles/style";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Chart as Tooltip, Legend } from "chart.js";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Analytic = () => {
  const {
    data: usersData,
    error: usersError,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useGetUsersQuery();
  const [createBin, { isSuccess: isCreateSuccess }] = useCreateBinMutation();
  const [updateBin, { isSuccess: isUpdateSuccess }] = useUpdateBinMutation();
  const [deleteBin, { isSuccess: isDeleteSuccess }] = useDeleteBinMutation();
  const [updateBinStatus] = useUpdateBinStatusMutation();

  const [uniqueUsers, setUniqueUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedBinId, setSelectedBinId] = useState(null);
  const [newBinData, setNewBinData] = useState({ location: "", size: "" });
  const [editingBin, setEditingBin] = useState(null);
  const [deleteTargetBin, setDeleteTargetBin] = useState(null);
  const [show, setShow] = useState(false);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [reportDateRange, setReportDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const chartRef = useRef<HTMLDivElement>(null);

  const {
    data: binsData,
    error: binsError,
    isLoading: binsLoading,
    refetch: refetchBins,
  } = useGetBinsByIdQuery(selectedUserId || "", {
    skip: !selectedUserId,
  });

  const { data: binStatusReport, isLoading: isReportLoading } =
    useGetBinStatusReportQuery(
      {
        binId: selectedBinId,
        startDate: reportDateRange.startDate,
        endDate: reportDateRange.endDate,
      },
      {
        skip:
          !selectedBinId ||
          !reportDateRange.startDate ||
          !reportDateRange.endDate,
      }
    );
  const formatMonthWiseData = (data) => {
    if (!data || !data.changesByDate) return [];

    const monthWiseData = data.changesByDate.reduce((acc, item) => {
      const date = new Date(item.date);
      const monthYear = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!acc[monthYear]) {
        acc[monthYear] = { monthYear, collectedCount: 0 };
      }
      acc[monthYear].collectedCount += item.trueCount;
      return acc;
    }, {});

    return Object.values(monthWiseData).sort(
      (a, b) => new Date(a.monthYear) - new Date(b.monthYear)
    );
  };

  const monthWiseReportData = formatMonthWiseData(binStatusReport);

  useEffect(() => {
    if (usersData?.user && Array.isArray(usersData.user)) {
      setUniqueUsers(usersData.user);
    }
  }, [usersData]);

  useEffect(() => {
    if (binsData) {
      setSelectedUserName(
        uniqueUsers.find((user) => user._id === selectedUserId)?.name || ""
      );
    }
  }, [binsData, uniqueUsers, selectedUserId]);

  useEffect(() => {
    if (isCreateSuccess || isUpdateSuccess || isDeleteSuccess) {
      refetchBins();
    }
  }, [isCreateSuccess, isUpdateSuccess, isDeleteSuccess, refetchBins]);

  const handleCreateBin = async () => {
    try {
      await createBin({ ...newBinData, userId: selectedUserId }).unwrap();
      alert("Bin created successfully");
      setOpenAddModal(false);
      setNewBinData({ location: "", size: "" });
      refetchUsers();
    } catch (error) {
      console.error(error);
      alert("Error creating bin");
    }
  };

  const handleUpdateBin = async () => {
    try {
      await updateBin({
        binId: editingBin,
        updatedBinData: newBinData,
      }).unwrap();
      alert("Bin updated successfully");
      setOpenEditModal(false);
      setEditingBin(null);
      setNewBinData({ location: "", size: "" });
    } catch (error) {
      console.error(error);
      alert("Error updating bin");
    }
  };

  const handleDeleteBin = async () => {
    try {
      await deleteBin(deleteTargetBin).unwrap();
      alert("Bin deleted successfully");
      setOpenDeleteModal(false);
    } catch (error) {
      console.error(error);
      alert("Error deleting bin");
    }
  };

  const handleUpdateBinStatus = async (binId, isCollected) => {
    try {
      await updateBinStatus({ binId, isCollected }).unwrap();
      alert("Bin status updated successfully");
      refetchBins();
    } catch (error) {
      console.error(error);
      alert("Error updating bin status");
    }
  };

  const openEditBinModal = (bin) => {
    setNewBinData({ location: bin.location, size: bin.size });
    setEditingBin(bin._id);
    setOpenEditModal(true);
  };

  const handleOpenReportModal = (binId) => {
    setSelectedBinId(binId);
    setOpenReportModal(true);
  };
  if (usersLoading) {
    return <div>Loading users...</div>;
  }

  if (usersError) {
    return <div>Error fetching users</div>;
  }
  const generateReport = async () => {
    if (!selectedBinId || !reportDateRange.startDate || !reportDateRange.endDate || !chartRef.current) {
      alert("Please select a bin and date range to generate a report.");
      return;
    }
    const reportTitle = "PAYT";
    const reportSubtitle = "Monthly Report";
    const binLocation = binsData?.bins.find(bin => bin._id === selectedBinId)?.location || "N/A";
    const totalCollectedRounds = binStatusReport?.falseCount || 0;
    const startdate = reportDateRange.startDate;
    const enddate = reportDateRange.endDate;
    const reportContent = document.createElement('div');
    reportContent.innerHTML = `
    <div id="report-container" style="
      font-family: 'Arial', sans-serif; 
      padding: 20px; 
      background-color: #f9f9f9; 
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
      border-radius: 8px;
      max-width: 800px; 
      margin: 0 auto; 
      text-align: center;
    ">
      <h1 style="
        color: #333; 
        font-size: 32px; 
        font-weight: bold; 
        margin-bottom: 10px;
      ">
        ${reportTitle}
      </h1>
      <h2 style="
        color: #666; 
        font-size: 24px; 
        font-weight: normal; 
        margin-bottom: 5px;
      ">
        ${reportSubtitle}
      </h2>
      
      <div style="
        color: #777; 
        font-size: 16px; 
        margin-bottom: 15px;
      ">
        <p><strong>From:</strong> ${startdate} - ${enddate}</p>
        <p><strong>Bin Location:</strong> ${binLocation}</p>
        <p><strong>Collected Time:</strong> ${totalCollectedRounds}</p>
      </div>
  
      <hr style="
        margin: 20px 0; 
        border: 0; 
        border-top: 1px solid #eaeaea;
      ">
  
      <div id="chart-container" style="
        display: flex; 
        justify-content: center; 
        align-items: center; 
        padding: 20px; 
        background-color: #fff; 
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); 
        border-radius: 8px;
      ">
        <!-- Chart will be inserted here -->
      </div>
    </div>
  `;
    document.body.appendChild(reportContent);

    try {
      const chartCanvas = await html2canvas(chartRef.current);
      const chartContainer = document.getElementById('chart-container');
      if (chartContainer) {
        chartContainer.appendChild(chartCanvas);
      }
      const canvas = await html2canvas(document.getElementById('report-container') as HTMLElement);
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
      pdf.save(`${reportTitle}_Report.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('An error occurred while generating the PDF. Please try again.');
    } finally {
      document.body.removeChild(reportContent);
    }
  };
  const chartData = [
    {
      name: 'Collected Times',
      count: binStatusReport?.falseCount || 0,
    }
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[100vh]">
      <div className="flex flex-row justify-start gap-6 mb-4">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
          Users with Bins
        </h2>

        <input
          value="Fetch Users"
          type="button"
          onClick={() => setSelectedUserId(null)}
          className="bg-green-400 dark:bg-white hover:bg-green-700 text-white dark:text-black font-bold text-xs self-baseline mt-1 py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[100px]"
        />
      </div>

      <input
        value="⇽ Back to all users"
        type="button"
        onClick={() => setSelectedUserId(null)}
        className="bg-black dark:bg-blue-400 hover:bg-green-700 text-white dark:text-white font-bold text-xs self-baseline mt-1 py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out"
      />

      {!selectedUserId ? (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-5">
          {uniqueUsers.map((user) => (
            <li
              key={user._id}
              className="col-span-1 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out cursor-pointer"
              onClick={() => setSelectedUserId(user._id)}
            >
              <div className="w-full flex items-center justify-between p-6 space-x-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-gray-900 text-sm font-medium truncate">
                      {user.name}
                    </h3>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="space-y-8 mt-8">
          <div className="flex flex-row">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mr-7">
              Bins for user: {selectedUserName}
            </h2>

            <input
              value="Create Bin"
              type="button"
              onClick={() => setOpenAddModal(true)}
              className="bg-black dark:bg-blue-400 hover:bg-green-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out"
            />
          </div>

          {binsLoading ? (
            <div className="text-center py-4 text-gray-600">
              Loading bins...
            </div>
          ) : binsError ? (
            <div className="text-center py-4 text-red-600">
              Error fetching bins
            </div>
          ) : (
            <ul className="space-y-6">
              {binsData.bins.map((bin) => (
                <li key={bin._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <p className="font-bold text-l text-gray-900">
                        Location: {bin.location}
                      </p>
                      <p className="text-gray-600">
                        Size: <span className="font-semibold">{bin.size}</span>
                      </p>
                      <p className="text-gray-500 text-sm">
                        Handed over:{" "}
                        {new Date(bin.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Is Collected:{" "}
                        <span
                          className={
                            bin.isCollected
                              ? "text-green-600 font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {bin.isCollected ? "Yes" : "No"}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-5 self-baseline">
                      <input
                        value="Toggle Collection"
                        type="button"
                        onClick={() =>
                          handleUpdateBinStatus(bin._id, !bin.isCollected)
                        }
                        className="bg-black  hover:bg-green-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[150px]"
                      />

                      <input
                        value="Edit"
                        type="button"
                        onClick={() => openEditBinModal(bin)}
                        className="bg-black  hover:bg-green-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[150px]"
                      />

                      <input
                        value="Delete"
                        type="button"
                        onClick={() => {
                          setDeleteTargetBin(bin._id);
                          setOpenDeleteModal(true);
                        }}
                        className="bg-black  hover:bg-green-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[150px]"
                      />

                      <input
                        value="View Report"
                        type="button"
                        onClick={() => handleOpenReportModal(bin._id)}
                        className="bg-black hover:bg-green-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[150px]"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Dialog
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <h2 className="text-xl font-bold text-black mt-4 ml-4">Add New Bin</h2>
        <DialogContent className="mt-4">
          <label className={`${styles.label}`} htmlFor="email">
            Enter your location
          </label>
          <input
            type={"text"}
            name="location"
            value={newBinData.location}
            onChange={(e) =>
              setNewBinData({ ...newBinData, location: e.target.value })
            }
            placeholder="location"
            className={`${styles.input}`}
          />

          <label className={`${styles.label}`} htmlFor="email">
            Enter bin size
          </label>
          <input
            type={"text"}
            name="size"
            value={newBinData.size}
            onChange={(e) =>
              setNewBinData({ ...newBinData, size: e.target.value })
            }
            placeholder="size"
            className={`${styles.input}`}
          />
        </DialogContent>
        <DialogActions className="p-4">
          <input
            value="Create Bin"
            type="button"
            onClick={handleCreateBin}
            className="bg-black hover:bg-green-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[100px]"
          />
          <input
            value="Cancel"
            type="button"
            onClick={() => setOpenAddModal(false)}
            className="bg-red-600 hover:bg-red-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[100px]"
          />
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        maxWidth="sm"
        fullWidth
      >

        <h2 className="text-xl font-bold text-black mt-4 ml-4">Edit Bin</h2>
        <DialogContent className="mt-4">

          <label className={`${styles.label}`} htmlFor="email">
            New Location
          </label>
          <input
            type={"text"}
            name="location"
            value={newBinData.location}
            onChange={(e) =>
              setNewBinData({ ...newBinData, location: e.target.value })
            }
            placeholder="location"
            className={`${styles.input}`}
          />

          <label className={`${styles.label}`} htmlFor="email">
            New Size
          </label>
          <input
            type={"text"}
            name="size"
            value={newBinData.size}
            onChange={(e) =>
              setNewBinData({ ...newBinData, size: e.target.value })
            }
            placeholder="size"
            className={`${styles.input}`}
          />
        </DialogContent>
        <DialogActions className="p-4">

          <input
            value="Update Bin"
            type="button"
            onClick={handleUpdateBin}
            className="bg-black hover:bg-green-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[100px]"
          />
          <input
            value="Cancel"
            type="button"
            onClick={() => setOpenEditModal(false)}
            className="bg-red-600 hover:bg-red-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[100px]"
          />
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <h2 className="text-xl font-bold text-black mt-4 ml-4"> Confirm Delete</h2>

        <DialogContent className="mt-4">
          <p className="text-gray-700">
            Are you sure you want to delete this bin?
          </p>
        </DialogContent>
        <DialogActions className="p-4">

          <input
            value="Delete"
            type="button"
            onClick={handleDeleteBin}
            className="bg-black hover:bg-green-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[100px]"
          />
          <input
            value="Cancel"
            type="button"
            onClick={() => setOpenDeleteModal(false)}
            className="bg-red-600 hover:bg-red-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[100px]"
          />
        </DialogActions>
      </Dialog>

      <Dialog
        open={openReportModal}
        onClose={() => setOpenReportModal(false)}
        maxWidth="md"
        fullWidth
      >
        <h2 className="text-xl font-bold text-black mt-4 ml-4">Monthly Bin Collection Report</h2>
        <DialogContent>
          <h2 className="text-xl font-bold text-black mt-4 ml-4">Monthly Bin Collection Report</h2>
          <div className="bg-white p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <TextField
                label="Start Date"
                type="date"
                value={reportDateRange.startDate}
                onChange={(e) => setReportDateRange({ ...reportDateRange, startDate: e.target.value })}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                className="bg-gray-100"
              />
              <TextField
                label="End Date"
                type="date"
                value={reportDateRange.endDate}
                onChange={(e) => setReportDateRange({ ...reportDateRange, endDate: e.target.value })}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                className="bg-gray-100"
              />
            </div>
            {isReportLoading ? (
              <p className="text-center py-4 text-gray-600">Loading report...</p>
            ) : binStatusReport ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-red-100 p-4 rounded-lg text-center">
                    <p className="text-lg font-semibold text-red-800">Total Collected Rounds</p>
                    <p className="text-3xl font-bold text-red-900">{binStatusReport.falseCount}</p>
                  </div>
                </div>
                <div className="mt-6" ref={chartRef}>
                  <BarChart width={500} height={300} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </div>
              </div>
            ) : (
              <p className="text-center py-4 text-gray-600">No report data available</p>
            )}
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <input
            value=" Generate PDF Report"
            type="button"
            onClick={generateReport}
            disabled={!binStatusReport}
            className="bg-blue-500 hover:bg-blue-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out"
          />
          <input
            value="Cancel"
            type="button"
            onClick={() => setOpenReportModal(false)}
            className="bg-red-600 hover:bg-red-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[100px]"
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Analytic;