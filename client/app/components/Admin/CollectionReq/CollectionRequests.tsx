import React, { useState } from 'react';
import { useFetchCollectRequestsQuery, useGetUsersQuery, useModifyRequestMutation } from '@/redux/features/auth/authApi';

interface Request {
  _id: string;
  userId: string;
  driverId?: string;
  binId: string;
  status: 'pending' | 'collected' | 'cancelled';
  message?: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

function CollectionRequests() {
  const { data: requestsData, error: requestsError, isLoading: isRequestsLoading, refetch } = useFetchCollectRequestsQuery({});
  const { data: userData, isLoading: isUsersLoading, isError: isUsersError } = useGetUsersQuery();
  const [modifyRequest] = useModifyRequestMutation();

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [formData, setFormData] = useState<Omit<Request, '_id' | 'createdAt' | 'updatedAt'>>(
    { userId: '', driverId: '', binId: '', status: 'pending', message: '' }
  );

  const handleSelectRequest = (request: Request) => {
    setSelectedRequest(request);
    setFormData({
      userId: request.userId,
      driverId: request.driverId || '',
      binId: request.binId,
      status: request.status,
      message: request.message || '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRequest) {
      try {
        await modifyRequest({ requestId: selectedRequest._id, updates: formData }).unwrap();
        refetch();
        setSelectedRequest(null);
        setFormData({ userId: '', driverId: '', binId: '', status: 'pending', message: '' });
      } catch (error) {
        console.error("Failed to update request: ", error);
      }
    }
  };

  const userIdToNameMap: Record<string, string> = {};
  userData?.user?.forEach((user: User) => {
    userIdToNameMap[user._id] = user.name;
  });

  if (isRequestsLoading || isUsersLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (requestsError) {
    return (
      <div className="text-red-500 text-center min-h-screen">
        Error: {JSON.stringify(requestsError)}
      </div>
    );
  }

  if (isUsersError) {
    return (
      <div className="text-red-500 text-center min-h-screen">
        Error loading users.
      </div>
    );
  }

  const filteredDrivers = userData?.user?.filter((user: User) => user.role === 'driver');

  return (
    <div className="w-full min-h-screen p-6 bg-gray-300">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">Collection Requests</h1>

      <div className="overflow-x-auto mb-6 text-black font-bold">
        <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-4 px-6 border-b text-left">ID</th>
              <th className="py-4 px-6 border-b text-left">User Name</th>
              <th className="py-4 px-6 border-b text-left">Driver Name</th>
              <th className="py-4 px-6 border-b text-left">Bin ID</th>
              <th className="py-4 px-6 border-b text-left">Status</th>
              <th className="py-4 px-6 border-b text-left">Message</th>
              <th className="py-4 px-6 border-b text-left">Created At</th>
              <th className="py-4 px-6 border-b text-left">Updated At</th>
              <th className="py-4 px-6 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requestsData?.requests?.length ? (
              requestsData.requests.map((request: Request) => (
                <tr key={request._id} className="hover:bg-gray-50 text-center">
                  <td className="py-4 px-6 border-b">{request._id}</td>
                  <td className="py-4 px-6 border-b">{userIdToNameMap[request.userId] || 'N/A'}</td>
                  <td className="py-4 px-6 border-b">{request.driverId ? userIdToNameMap[request.driverId] || 'N/A' : 'N/A'}</td>
                  <td className="py-4 px-6 border-b">{request.binId}</td>
                  <td className="py-4 px-6 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-white font-semibold ${request.status === 'pending' ? 'bg-yellow-500' : request.status === 'collected' ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-b">{request.message || 'N/A'}</td>
                  <td className="py-4 px-6 border-b">
                    {new Date(request.createdAt).toLocaleString('en-US', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {new Date(request.updatedAt).toLocaleString('en-US', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-4 px-6 border-b">
                    <button
                      onClick={() => handleSelectRequest(request)}
                      className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-4 px-6 border-b text-center" colSpan={9}>
                  No collection requests available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedRequest && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 border border-gray-300 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Edit Request</h2>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="userId">User ID</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="border rounded w-full p-2 bg-gray-100"
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="driverId">Driver</label>
            <select
              name="driverId"
              value={formData.driverId}
              onChange={handleChange}
              className="border rounded w-full p-2 bg-gray-100"
            >
              <option value="">Select Driver</option>
              {filteredDrivers?.map((driver: User) => (
                <option key={driver._id} value={driver._id}>
                  {driver.name} - {driver.email}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="binId">Bin ID</label>
            <input
              type="text"
              name="binId"
              value={formData.binId}
              onChange={handleChange}
              className="border rounded w-full p-2 bg-gray-100"
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="status">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border rounded w-full p-2 bg-gray-100"
            >
              <option value="pending">Pending</option>
              <option value="collected">Collected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="message">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="border rounded w-full p-2 bg-gray-100"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Update Request
          </button>
          <button
            type="button"
            onClick={() => setSelectedRequest(null)}
            className="bg-gray-300 text-black font-semibold py-2 px-4 ml-4 rounded-lg hover:bg-gray-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default CollectionRequests;
