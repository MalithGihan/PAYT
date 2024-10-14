import React, { useState, useEffect } from 'react';
import { useGetRequestsQuery, useUpdateRequestMutation } from "@/redux/features/auth/authApi";
import { Button } from '@mui/material';

const Requests = () => {
  const { data: response, isLoading, error, refetch } = useGetRequestsQuery();
  const [updateRequest] = useUpdateRequestMutation();
  const [statusFilter, setStatusFilter] = useState('all'); 
  const [startDate, setStartDate] = useState(''); 
  const [endDate, setEndDate] = useState(''); 
  const [filteredRequests, setFilteredRequests] = useState([]); 

 
  useEffect(() => {
    console.log("Response Data:", response);
  }, [response]);


  useEffect(() => {
    if (Array.isArray(response?.requests)) {
      setFilteredRequests(response.requests);
    }
  }, [response]);

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error fetching requests.</div>;

 
  const handleStatusChange = async (reqId: string, newStatus: string) => {
    try {
      const result = await updateRequest({ requestId: reqId, updates: { status: newStatus } }).unwrap();
      console.log("Update result:", result); 
      await refetch(); 
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  
  const applyFilters = () => {
    const requests = Array.isArray(response?.requests) ? response.requests : [];
    const filteredByStatus = statusFilter === 'all'
      ? requests
      : requests.filter(req => req.status === statusFilter);

    const filteredByDate = filteredByStatus.filter(req => {
      const createdAt = new Date(req.createdAt);
      const start = startDate ? new Date(startDate) : new Date(0); 
      const end = endDate ? new Date(endDate) : new Date(); 
      return createdAt >= start && createdAt <= end;
    });

    setFilteredRequests(filteredByDate);
  };

  const clearFilters = () => {
    setStatusFilter('all'); 
    setStartDate(''); 
    setEndDate(''); 
    setFilteredRequests(Array.isArray(response?.requests) ? response.requests : []); 
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500'; 
      case 'completed':
        return 'text-green-500'; 
      case 'cancelled':
        return 'text-red-500'; 
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Requests</h2>
      <Button onClick={refetch} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6">
        Fetch Requests
      </Button>
     
      <div className="mb-4">
        <label htmlFor="status-filter" className="block text-gray-700 font-medium">Filter by Status:</label>
        <select
          id="status-filter"
          className="mt-2 block w-full p-2 border border-gray-300 rounded bg-white text-black"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)} 
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="mb-4 flex space-x-4">
        <div className="flex-1">
          <label htmlFor="start-date" className="block text-gray-700 font-medium">Start Date:</label>
          <input
            type="date"
            id="start-date"
            className="mt-1 block w-full p-2 border border-gray-300 rounded bg-white text-black"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)} 
          />
        </div>
        <div className="flex-1">
          <label htmlFor="end-date" className="block text-gray-700 font-medium">End Date:</label>
          <input
            type="date"
            id="end-date"
            className="mt-1 block w-full p-2 border border-gray-300 rounded bg-white text-black"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)} 
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={applyFilters}
            className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Apply Filter
          </button>
        </div>
        <div className="flex items-end">
          <button
            onClick={clearFilters}
            className="ml-2 p-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <p className="text-gray-600">No requests found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredRequests.map((req) => (
            <li key={req._id} className="bg-gray-100 p-4 rounded-lg shadow">
              <p className="text-lg font-medium text-gray-700">Message: {req.message}</p>
              <p className="text-gray-600">
                Status: <span className={`font-bold ${getStatusColor(req.status)}`}>{req.status}</span>
              </p>
              <p className="text-gray-500 text-sm">Created At: {new Date(req.createdAt).toLocaleString()}</p>
              <p className="text-gray-500 text-sm">Updated At: {new Date(req.updatedAt).toLocaleString()}</p>

              <div className="mt-2">
                <label htmlFor={`status-${req._id}`} className="block text-gray-700">Change Status:</label>
                <select
                  id={`status-${req._id}`}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded bg-white text-black"
                  value={req.status} 
                  onChange={(e) => handleStatusChange(req._id, e.target.value)} 
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Requests;
