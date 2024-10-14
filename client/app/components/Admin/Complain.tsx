import React, { useState } from 'react';
import { useGetAllComplaintsQuery, useGetUsersQuery, useUpdateComplaintMutation } from '@/redux/features/auth/authApi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Complain = () => {
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
    <div className="max-w-4xl mx-auto mt-10 p-5 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-5">Complaints</h2>

      <div className="text-center mb-4">
        <button
          onClick={() => refetch()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Refetch Complaints
        </button>
      </div>

      <div className="flex justify-between mb-4">
        <div className="w-1/2 pr-2">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Filter by Role</label>
          <select
            id="role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-white text-black px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Roles</option>
            <option value="driver">Driver</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <div className="w-1/2 pl-2">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Filter by Status</label>
          <select
            id="status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="mt-1 block w-full border-black rounded-md bg-white text-black px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <Bar data={barChartData} />
      </div>

      <ul className="space-y-4">
        {filteredComplaints && filteredComplaints.map((complaint) => (
          <li
            key={complaint._id}
            className="p-4 border rounded-lg hover:bg-gray-100 transition duration-200 cursor-pointer"
          >
            <div className="text-lg font-semibold text-gray-700">
              <strong>User:</strong> {complaint.userId?.name || 'Unknown User'}
              ({complaint.userId?.role || 'Unknown Role'})
            </div>
            <div className="mt-1">
              <strong className="block text-lg font-semibold text-gray-700">Message: {complaint.message}</strong>
              <span className="text-gray-600"></span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <strong>Status:</strong> {complaint.status} <br />
              <strong>Date:</strong> {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="mb-4 p-4 border rounded-lg bg-gray-100 mt-4">
              <h3 className="text-lg font-semibold mb-2 text-black">Update Complaint Status</h3>
              <div className="flex items-center">
                <select
                  value={newStatusMap[complaint._id] || complaint.status}
                  onChange={(e) => setNewStatusMap((prev) => ({ ...prev, [complaint._id]: e.target.value }))}
                  className="mr-2 rounded-md shadow-sm bg-white text-black px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
                <button
                  onClick={() => handleUpdateStatus(complaint._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
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

export default Complain;
