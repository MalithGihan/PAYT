import React, { useState, useRef } from "react";
import { useGetBinsByIdQuery, useGetBinStatusReportQuery } from "@/redux/features/auth/authApi";
import { useSelector } from "react-redux";
import { Dialog, DialogActions, DialogContent, TextField, Button } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Viewreport: React.FC<{ userId: string }> = ({ userId }) => {
  const user = useSelector((state: any) => state.auth.user);
  const [reportDateRange, setReportDateRange] = useState({ startDate: "", endDate: "" });
  const [selectedBinId, setSelectedBinId] = useState<string | null>(null);
  const [openReportModal, setOpenReportModal] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  const { data: binsData, error: binsError, isLoading: binsLoading } = useGetBinsByIdQuery(user._id);
  const { data: binStatusReport, isLoading: isReportLoading } = useGetBinStatusReportQuery(
    { binId: selectedBinId, startDate: reportDateRange.startDate, endDate: reportDateRange.endDate },
    { skip: !selectedBinId || !reportDateRange.startDate || !reportDateRange.endDate }
  );

  // Prepare data for the bar chart
  const chartData = {
    labels: ['Counted Times'],
    datasets: [
      {
        label: 'Counts',
        data: [
          binStatusReport?.falseCount || 0,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
        ],
      },
    ],
  };

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

  return (
    <div className="w-full min-h-screen pb-10">
      <h2 className="mb-5">Show bins for this user</h2>

      {binsLoading && <p>Loading bins...</p>}
      {binsError && <p className="text-red-500">Error fetching bins: {JSON.stringify(binsError)}</p>}
      
      {binsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {binsData.bins.map((bin) => (
            <div 
              key={bin._id} 
              className={`rounded-lg p-4 w-60 cursor-pointer shadow-lg  bg-white ${selectedBinId === bin._id ? 'border-green-500 border-2' : 'border-gray-200'}`}
              onClick={() => {
                setSelectedBinId(bin._id);
                setOpenReportModal(true);
              }}
            >
              <h3 className="font-bold mb-2 text-black ml-6 ">Location : {bin.location}</h3>
              <input
                value={selectedBinId === bin._id ? "Selected" : "Select"}
                type="button"
                className={`bg-black ml-12 hover:bg-green-700 text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[100px] ${selectedBinId === bin._id ? 'bg-green-500' : 'bg-black'}`}
              />
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={openReportModal}
        onClose={() => setOpenReportModal(false)}
        maxWidth="md"
        fullWidth
      >
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
                  <Bar data={chartData} />
                </div>
              </div>
            ) : (
              <p className="text-center py-4 text-gray-600">No report data available</p>
            )}
          </div>
          <div className="p-4 flex justify-between">
            <Button
              variant="contained"
              color="primary"
              onClick={generateReport}
              disabled={!binStatusReport}
            >
              Generate PDF Report
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setOpenReportModal(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Viewreport;