import React, { useState } from 'react';
import { useGetAllComplaintsQuery, useGetUsersQuery, useUpdateComplaintMutation } from '@/redux/features/auth/authApi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Complaints = () => {
  const { data: complaintsData, error: complaintsError, isLoading: complaintsLoading, refetch } = useGetAllComplaintsQuery();
  const { data: usersData, error: usersError, isLoading: usersLoading } = useGetUsersQuery();
  const [updateComplaint] = useUpdateComplaintMutation();

  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [newStatusMap, setNewStatusMap] = useState({});

  if (complaintsLoading || usersLoading) return <div className="text-center text-blue-500">Loading complaints...</div>;
  if (complaintsError) return <div className="text-center text-red-500">Error fetching complaints</div>;
  if (usersError) return <div className="text-center text-red-500">Error fetching users</div>;

  const usersArray = Array.isArray(usersData) ? usersData : [];

  const uniqueRoles = Array.from(new Set(usersArray.map(user => user.role)));

  const filteredComplaints = complaintsData?.complaints.filter(complaint => {
    const matchesRole = selectedRole ? complaint.userId?.role === selectedRole : true;
    const matchesStatus = selectedStatus ? complaint.status === selectedStatus : true;
    return matchesRole && matchesStatus;
  });

  const statusCounts = filteredComplaints?.reduce((acc, complaint) => {
    acc[complaint.status] = (acc[complaint.status] || 0) + 1;
    return acc;
  }, { rejected: 0, completed: 0, pending: 0 }) || { rejected: 0, completed: 0, pending: 0 };

  const barChartData = {
    labels: ['Rejected', 'Completed', 'Pending'],
    datasets: [
      {
        label: 'Complaint Counts',
        data: [statusCounts.rejected, statusCounts.completed, statusCounts.pending],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(255, 206, 86, 0.6)'],
      },
    ],
  };

  const handleUpdateStatus = async (complaintId) => {
    const newStatus = newStatusMap[complaintId];
    if (newStatus) {
      try {
        await updateComplaint({
          complaintId: complaintId,
          updates: { status: newStatus }
        }).unwrap();
        refetch();
        setNewStatusMap((prev) => ({ ...prev, [complaintId]: '' }));
      } catch (error) {
        console.error('Failed to update complaint:', error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[100%]">
      <div className="flex flex-row justify-start gap-6 mb-4">
      <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Complaints</h2>

        <input
          value="Refetch Complaints"
          type="button"
          onClick={() => refetch()}
          className="bg-green-400 dark:bg-white hover:bg-green-700 text-white dark:text-black font-bold text-xs self-baseline mt-1 py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out"
        />
      </div>

      <div className="flex justify-start mb-8">
        <div className="mr-8">
          <label htmlFor="role" className="text-sm font-bold text-gray-900 dark:text-white">Filter by Role</label>
          <select
            id="role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="mt-1 block w-[300px] border-gray-300 rounded-sm shadow-sm bg-black dark:bg-white text-white dark:text-black px-4 py-2 focus:ring-green-400 focus:border-grenn-400 "
          >
            <option value="">All Roles</option>
            <option value="driver">Driver</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <div className="">
          <label htmlFor="status" className="text-sm font-bold text-gray-900 dark:text-white">Filter by Status</label>
          <select
            id="status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="mt-1 block w-[300px] border-gray-300 rounded-sm shadow-sm bg-black dark:bg-white text-white dark:text-black px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>


      <ul className="space-y-4">
        {filteredComplaints && filteredComplaints.map((complaint) => (
          <li
            key={complaint._id}
            className="px-3 py-2 rounded-lg hover:bg-gray-100 bg-white transition duration-200 cursor-pointer flex flex-row justify-between shadow-lg mb-5 dark:bg-gray-800"
          >
            <div>
            <div className="text-[17px] font-semibold text-gray-700 dark:text-white">
              <strong>User:</strong> {complaint.userId?.name || 'Unknown User'}
              ({complaint.userId?.role || 'Unknown Role'})
            </div>
            <div className="mt-1">
              <strong className="block text-[15px] font-semibold text-gray-700 dark:text-white">Message: {complaint.message}</strong>
              <span className="text-gray-600"></span>
            </div>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-300">
              <strong>Status:</strong> {complaint.status} <br />
              <strong>Date:</strong> {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            </div>
            <div className="mb-4 p-4 rounded-lg bg-gray-100 mt-4 dark:bg-gray-900">
              <h3 className="text-xm font-bold mb-3 text-black dark:text-white">Update Complaint Status</h3>
              <div className="flex items-center gap-4">
                <select
                  value={newStatusMap[complaint._id] || complaint.status}
                  onChange={(e) => setNewStatusMap((prev) => ({ ...prev, [complaint._id]: e.target.value }))}
                  className="dark:bg-black bg-green-400  hover:bg-green-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[150px]"
                >
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
                <button
                  onClick={() => handleUpdateStatus(complaint._id)}
                  className= "dark:bg-black bg-green-400  hover:bg-green-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[150px]"
                >
                  Update Complaint
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Complaints;
