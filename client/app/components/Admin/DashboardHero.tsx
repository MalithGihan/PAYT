import React, { useState, useEffect } from 'react';
import { useGetUsersQuery, useGetAllComplaintsQuery } from "@/redux/features/auth/authApi";
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import DashboardHeader from './DashboardHeader';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface User {
  _id: string;
  role: string;
  // Add other user properties as needed
}

interface Complaint {
  _id: string;
  userId: User;
  status: 'rejected' | 'completed' | 'pending';
  // Add other complaint properties as needed
}

const DashboardHero: React.FC = () => {
  const { data: usersData, isLoading: usersLoading, isError: usersError, refetch: refetchUsers } = useGetUsersQuery({});
  const { data: complaintsData, isLoading: complaintsLoading, isError: complaintsError } = useGetAllComplaintsQuery({});

  const [roleData, setRoleData] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [barChartData, setBarChartData] = useState<any>(null);

  useEffect(() => {
    if (usersData && Array.isArray(usersData.user)) {
      const roleCount = usersData.user.reduce((acc: Record<string, number>, user: User) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      setRoleData({
        labels: Object.keys(roleCount),
        datasets: [
          {
            label: 'Users by Role',
            data: Object.values(roleCount),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
        ],
      });
    }
  }, [usersData]);

  useEffect(() => {
    if (complaintsData && Array.isArray(complaintsData.complaints)) {
      const filteredComplaints = complaintsData.complaints.filter((complaint: Complaint) => {
        const matchesRole = selectedRole ? complaint.userId?.role === selectedRole : true;
        const matchesStatus = selectedStatus ? complaint.status === selectedStatus : true;
        return matchesRole && matchesStatus;
      });

      const statusCounts = filteredComplaints.reduce((acc: Record<string, number>, complaint: Complaint) => {
        acc[complaint.status] = (acc[complaint.status] || 0) + 1;
        return acc;
      }, { rejected: 0, completed: 0, pending: 0 });

      setBarChartData({
        labels: ['Rejected', 'Completed', 'Pending'],
        datasets: [
          {
            label: 'Complaint Counts',
            data: [statusCounts.rejected, statusCounts.completed, statusCounts.pending],
            backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(255, 206, 86, 0.6)'],
          },
        ],
      });
    }
  }, [complaintsData, selectedRole, selectedStatus]);

  if (usersLoading || complaintsLoading) {
    return <div className="text-center text-blue-500">Loading data...</div>;
  }

  if (usersError || complaintsError) {
    return <div className="text-center text-red-500">Error fetching data</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[100%]">
      <DashboardHeader />
      <h1 className="text-2xl font-bold text-black dark:text-white mb-6">
        Dashboard
      </h1>
      <div className="flex flex-row justify-around">
        <div>
          {roleData && (
            <div className="mb-8">
              <h2 className="text-ms font-bold text-gray-700 dark:text-white mb-3">
                Role Distribution
              </h2>
              <div
                className="mx-auto flex justify-start"
                style={{ width: "250px", height: "250px" }}
              >
                <Pie data={roleData} />
              </div>
            </div>
          )}

          <div className="mb-8">
            <div className="text-center mb-4">
              <input
                value="Refetch Data"
                type="button"
                onClick={() => refetchUsers()}
                className="bg-black dark:bg-white hover:bg-green-700 text-white dark:text-black font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[100px]"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-start mb-4 gap-5">
          <div className="flex flex-row gap-5">
          <div >
            <label
              htmlFor="role"
              className="text-ms font-bold text-gray-700 dark:text-white mb-3"
            >
              Filter by Role
            </label>
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="mt-1 block w-[200px] border-gray-300 rounded-md dark:bg-white text-black p-1 focus:ring-green-400 focus:border-green-400 shadow-lg font-sm font-semibold"
            >
              <option value="">All Roles</option>
              <option value="driver">Driver</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="">
            <label
              htmlFor="status"
              className="text-ms font-bold text-gray-700 dark:text-white mb-3"
            >
              Filter by Status
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="mt-1 block w-[200px] border-gray-300 rounded-md dark:bg-white text-black p-1 focus:ring-green-400 focus:border-green-400 shadow-lg font-sm font-semibold"
            >
              <option value="">All Statuses</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-ms font-bold text-gray-700 dark:text-white mb-3">
            Complaint Status Distribution
          </h2>
          <div
            className="mx-auto flex justify-start"
            style={{ width: "400px", height: "400px" }}
          >
            {barChartData && <Bar data={barChartData} />}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;