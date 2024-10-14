import React, { useEffect, useState } from 'react';
import { useGetUsersQuery, useCreateBinMutation, useUpdateBinMutation, useDeleteBinMutation, useGetBinsByIdQuery, useUpdateBinStatusMutation, useGetBinStatusReportQuery } from "@/redux/features/auth/authApi";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UserBin = () => {
  const { data: usersData, error: usersError, isLoading: usersLoading, refetch: refetchUsers } = useGetUsersQuery();
  const [createBin, { isSuccess: isCreateSuccess }] = useCreateBinMutation();
  const [updateBin, { isSuccess: isUpdateSuccess }] = useUpdateBinMutation();
  const [deleteBin, { isSuccess: isDeleteSuccess }] = useDeleteBinMutation();
  const [updateBinStatus] = useUpdateBinStatusMutation();

  const [uniqueUsers, setUniqueUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [selectedBinId, setSelectedBinId] = useState(null);
  const [newBinData, setNewBinData] = useState({ location: '', size: '' });
  const [editingBin, setEditingBin] = useState(null);
  const [deleteTargetBin, setDeleteTargetBin] = useState(null);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false); const [openReportModal, setOpenReportModal] = useState(false);
  const [reportDateRange, setReportDateRange] = useState({ startDate: '', endDate: '' });

  const { data: binsData, error: binsError, isLoading: binsLoading, refetch: refetchBins } = useGetBinsByIdQuery(selectedUserId || '', {
    skip: !selectedUserId,
  });

  // const { data: binStatusReport, isLoading: isReportLoading } = useGetBinStatusReportQuery({
  //   binId: selectedBinId,
  //   startDate: reportDateRange.startDate,
  //   endDate: reportDateRange.endDate
  // }, {
  //   skip: !selectedBinId || !reportDateRange.startDate || !reportDateRange.endDate,
  // });


  // const formattedReportData = binStatusReport?.changesByDate?.map(item => ({
  //   date: item.date,
  //   collectedCount: item.trueCount
  // })) || [];


  const { data: binStatusReport, isLoading: isReportLoading } = useGetBinStatusReportQuery({
    binId: selectedBinId,
    startDate: reportDateRange.startDate,
    endDate: reportDateRange.endDate
  }, {
    skip: !selectedBinId || !reportDateRange.startDate || !reportDateRange.endDate,
  });
  const formatMonthWiseData = (data) => {
    if (!data || !data.changesByDate) return [];

    const monthWiseData = data.changesByDate.reduce((acc, item) => {
      const date = new Date(item.date);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });

      if (!acc[monthYear]) {
        acc[monthYear] = { monthYear, collectedCount: 0 };
      }
      acc[monthYear].collectedCount += item.trueCount;
      return acc;
    }, {});

    return Object.values(monthWiseData).sort((a, b) =>
      new Date(a.monthYear) - new Date(b.monthYear)
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
      setSelectedUserName(uniqueUsers.find(user => user._id === selectedUserId)?.name || '');
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
      alert('Bin created successfully');
      setOpenAddModal(false);
      setNewBinData({ location: '', size: '' });
      refetchUsers();
    } catch (error) {
      console.error(error);
      alert('Error creating bin');
    }
  };

  const handleUpdateBin = async () => {
    try {
      await updateBin({ binId: editingBin, updatedBinData: newBinData }).unwrap();
      alert('Bin updated successfully');
      setOpenEditModal(false);
      setEditingBin(null);
      setNewBinData({ location: '', size: '' });
    } catch (error) {
      console.error(error);
      alert('Error updating bin');
    }
  };

  const handleDeleteBin = async () => {
    try {
      await deleteBin(deleteTargetBin).unwrap();
      alert('Bin deleted successfully');
      setOpenDeleteModal(false);
    } catch (error) {
      console.error(error);
      alert('Error deleting bin');
    }
  };

  const handleUpdateBinStatus = async (binId, isCollected) => {
    try {
      await updateBinStatus({ binId, isCollected }).unwrap();
      alert('Bin status updated successfully');
      refetchBins();
    } catch (error) {
      console.error(error);
      alert('Error updating bin status');
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

  return (
    <div>
      <h2>Users with Bins</h2>
      <Button onClick={() => setSelectedUserId(null)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6">
        Fetch Users
      </Button>

      {!selectedUserId ? (
        <ul className="space-y-4">
          {uniqueUsers.map((user) => (
            <li key={user._id} className="bg-gray-100 p-4 rounded-lg shadow cursor-pointer"
              onClick={() => setSelectedUserId(user._id)}
            >
              <p className="text-lg font-medium text-gray-700">User Name: {user.name}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <Button onClick={() => setSelectedUserId(null)} className="bg-red-500 hover:bg-red-700 hover:text-white font-bold py-2 px-4 rounded mb-6">
            Back to All Users
          </Button>
          <h2>Bins for User: {selectedUserName}</h2>

          <Button onClick={() => setOpenAddModal(true)} className="bg-green-500 hover:bg-green-400 hover:text-white font-bold py-2 px-4 rounded">
            Create Bin
          </Button>

          {binsLoading ? (
            <div>Loading bins...</div>
          ) : binsError ? (
            <div>Error fetching bins</div>
          ) : (
            <ul className="space-y-4">
              {binsData.bins.map((bin) => (
                <li key={bin._id} className="bg-gray-100 p-4 rounded-lg shadow w-2/3">
                  <p className="text-lg font-medium text-gray-700">Location: {bin.location}</p>
                  <p className="text-gray-600">
                    Size: <span className="font-bold">{bin.size}</span>
                  </p>
                  <p className="text-gray-500 text-sm">Created At: {new Date(bin.createdAt).toLocaleString()}</p>
                  <p className="text-gray-500 text-sm">Is Collected: {bin.isCollected ? "Yes" : "No"}</p>

                  <Button onClick={() => handleUpdateBinStatus(bin._id, !bin.isCollected)} className="bg-blue-500 hover:bg-blue-700 hover:text-white font-bold py-2 px-4 rounded">
                    Toggle Collection Status
                  </Button>
                  <Button onClick={() => openEditBinModal(bin)} className="bg-yellow-500 hover:bg-yellow-700 hover:text-white font-bold py-2 px-4 rounded">
                    Edit Bin
                  </Button>
                  <Button onClick={() => { setDeleteTargetBin(bin._id); setOpenDeleteModal(true); }} className="bg-red-500 hover:bg-red-700 hover:text-white font-bold py-2 px-4 rounded">
                    Delete Bin
                  </Button>
                  <Button onClick={() => handleOpenReportModal(bin._id)} className="bg-purple-500 hover:bg-purple-700 hover:text-white font-bold py-2 px-4 rounded">
                    View Report
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <DialogTitle>Add New Bin</DialogTitle>
        <DialogContent>
          <TextField
            label="Location"
            value={newBinData.location}
            onChange={(e) => setNewBinData({ ...newBinData, location: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Size"
            value={newBinData.size}
            onChange={(e) => setNewBinData({ ...newBinData, size: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateBin} className="bg-green-500 hover:bg-green-700 hover:text-white font-bold py-2 px-4 rounded">
            Create Bin
          </Button>
          <Button onClick={() => setOpenAddModal(false)} className="bg-red-500 hover:bg-red-700 hover:text-white font-bold py-2 px-4 rounded">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit Bin</DialogTitle>
        <DialogContent>
          <TextField
            label="New Location"
            value={newBinData.location}
            onChange={(e) => setNewBinData({ ...newBinData, location: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="New Size"
            value={newBinData.size}
            onChange={(e) => setNewBinData({ ...newBinData, size: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateBin} className="bg-green-500 hover:bg-green-700 hover:text-white font-bold py-2 px-4 rounded">
            Update Bin
          </Button>
          <Button onClick={() => setOpenEditModal(false)} className="bg-red-500 hover:bg-red-700 hover:text-white font-bold py-2 px-4 rounded">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this bin?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteBin} className="bg-red-500 hover:bg-red-700 hover:text-white font-bold py-2 px-4 rounded">
            Delete
          </Button>
          <Button onClick={() => setOpenDeleteModal(false)} className="bg-gray-500 hover:bg-gray-700 hover:text-white font-bold py-2 px-4 rounded">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openReportModal} onClose={() => setOpenReportModal(false)} maxWidth="md" fullWidth>
        <DialogTitle className="bg-gray-100 text-2xl font-bold">Monthly Bin Collection Report</DialogTitle>
        <DialogContent className="bg-white p-6">
          <div className="space-y-4 mb-6">
            <TextField
              label="Start Date"
              type="date"
              value={reportDateRange.startDate}
              onChange={(e) => setReportDateRange({ ...reportDateRange, startDate: e.target.value })}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              className="bg-gray-50"
            />
            <TextField
              label="End Date"
              type="date"
              value={reportDateRange.endDate}
              onChange={(e) => setReportDateRange({ ...reportDateRange, endDate: e.target.value })}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              className="bg-gray-50"
            />
          </div>
          {isReportLoading ? (
            <p className="text-center py-4 text-gray-600">Loading report...</p>
          ) : binStatusReport ? (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-100 p-4 rounded-lg text-center">
                  <p className="text-lg font-semibold text-blue-800">Total Changes</p>
                  <p className="text-3xl font-bold text-blue-900">{binStatusReport.totalChanges}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg text-center">
                  <p className="text-lg font-semibold text-green-800">Total Collected</p>
                  <p className="text-3xl font-bold text-green-900">{binStatusReport.trueCount}</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg text-center">
                  <p className="text-lg font-semibold text-red-800">Total Not Collected</p>
                  <p className="text-3xl font-bold text-red-900">{binStatusReport.falseCount}</p>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Monthly Collection Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthWiseReportData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="monthYear"
                      label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis
                      label={{ value: 'Collected Count', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Bar dataKey="collectedCount" fill="#4299E1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <p className="text-center py-4 text-gray-600">No report data available</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReportModal(false)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserBin;