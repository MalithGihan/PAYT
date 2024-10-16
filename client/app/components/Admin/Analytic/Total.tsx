import React, { useState, useEffect } from "react";
import { useGetAllBinsStatusReportQuery } from "@/redux/features/auth/authApi";
import toast from 'react-hot-toast';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Total: React.FC<{ userId: string }> = ({ userId }) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    setStartDate(firstDayOfMonth.toISOString().split('T')[0]);
    setEndDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const { data, error, isLoading } = useGetAllBinsStatusReportQuery(
    { startDate, endDate },
    {
      skip: !startDate || !endDate,
    }
  );

  useEffect(() => {
    if (error) {
      toast.error("Error fetching data.");
    }
  }, [error]);

  const chartData = {
    labels: ['Total Bins', 'True Count', 'False Count'],
    datasets: [
      {
        label: 'Bin Counts',
        data: data ? [data.totalBins, data.totalTrueCount, data.totalFalseCount] : [],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Bins Status Report',
      },
    },
  };

  return (
    <div className=" min-h-screen pb-10 bg-gray-100 p-6 w-1/2">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Bins Status Report</h2>
      <div className="flex flex-col md:flex-row justify-center items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <label className="flex flex-col">
          <span className="mb-1 text-gray-700">Start Date:</span>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex flex-col">
          <span className="mb-1 text-gray-700">End Date:</span>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>
      
      {isLoading && <div className="text-center text-gray-600">Loading...</div>}
      {error && <div className="text-center text-red-500">Error fetching data.</div>}
      {data && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 ">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-100 p-4 rounded-md">
              <p className="text-sm text-gray-600">Total Bins</p>
              <p className="text-2xl font-bold text-blue-600">{data.totalBins}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-md">
              <p className="text-sm text-gray-600">True Count</p>
              <p className="text-2xl font-bold text-green-600">{data.totalTrueCount}</p>
            </div>
            <div className="bg-red-100 p-4 rounded-md">
              <p className="text-sm text-gray-600">False Count</p>
              <p className="text-2xl font-bold text-red-600">{data.totalFalseCount}</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-md">
              <p className="text-sm text-gray-600">Total Changes</p>
              <p className="text-2xl font-bold text-purple-600">{data.totalChanges}</p>
            </div>
          </div>
        </div>
      )}
      {data && (
        <div className="bg-white shadow-md rounded-lg p-6 ">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Bins Status Chart</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default Total;