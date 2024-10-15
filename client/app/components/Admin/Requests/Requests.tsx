import React, { useState, useEffect } from "react";
import {
  useGetRequestsQuery,
  useUpdateRequestMutation,
} from "@/redux/features/auth/authApi";
import { Button } from "@mui/material";

const Requests = () => {
  const { data: response, isLoading, error, refetch } = useGetRequestsQuery();
  const [updateRequest] = useUpdateRequestMutation();
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
  if (error)
    return (
      <div className="text-center mt-10 text-red-500">
        Error fetching requests.
      </div>
    );

  const handleStatusChange = async (reqId: string, newStatus: string) => {
    try {
      const result = await updateRequest({
        requestId: reqId,
        updates: { status: newStatus },
      }).unwrap();
      console.log("Update result:", result);
      await refetch();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const applyFilters = () => {
    const requests = Array.isArray(response?.requests) ? response.requests : [];
    const filteredByStatus =
      statusFilter === "all"
        ? requests
        : requests.filter((req) => req.status === statusFilter);

    const filteredByDate = filteredByStatus.filter((req) => {
      const createdAt = new Date(req.createdAt);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      return createdAt >= start && createdAt <= end;
    });

    setFilteredRequests(filteredByDate);
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setStartDate("");
    setEndDate("");
    setFilteredRequests(
      Array.isArray(response?.requests) ? response.requests : []
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "completed":
        return "text-green-500";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[100%]">
      <div className="flex flex-row justify-start gap-6 mb-4">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
          Requests
        </h2>

        <input
          value="Fetch Requests"
          type="button"
          onClick={refetch}
          className="bg-green-400 dark:bg-white hover:bg-green-700 text-white dark:text-black font-bold text-xs self-baseline mt-1 py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[100px]"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="status-filter"
          className="text-ms font-bold text-gray-700 dark:text-white mb-3"
        >
          Filter by Status:
        </label>
        <select
          id="status-filter"
          className="mt-1 block w-[300px] border-gray-300 rounded-md dark:bg-white text-black  px-4 py-2 focus:ring-green-400 focus:border-grenn-400 shadow-lg "
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="mb-8 flex justify-between ">
        <div className="flex flex-row gap-6">
          <div className="flex-1">
            <label
              htmlFor="start-date"
              className="text-ms font-bold text-gray-700 dark:text-white mb-3"
            >
              Start Date:
            </label>
            <input
              type="date"
              id="start-date"
              className="mt-1 block w-[300px] border-gray-300 rounded-md dark:bg-white text-black  px-4 py-2 focus:ring-green-400 focus:border-grenn-400 shadow-lg "
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="end-date"
              className="text-ms font-bold text-gray-700 dark:text-white mb-3"
            >
              End Date:
            </label>
            <input
              type="date"
              id="end-date"
              className="mt-1 block w-[300px] border-gray-300 rounded-md dark:bg-white text-black  px-4 py-2 focus:ring-green-400 focus:border-grenn-400 shadow-lg "
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <input
            value="Apply Filter"
            type="button"
            onClick={applyFilters}
            className="bg-black hover:bg-green-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[100px]"
          />
          <input
            value="Clear Filters"
            type="button"
            onClick={clearFilters}
            className="bg-red-600 hover:bg-red-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[100px]"
          />
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <p className="text-gray-600">No requests found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredRequests.map((req) => (
            <li key={req._id} className="p-4 rounded-lg hover:bg-gray-100 bg-white transition duration-200 cursor-pointer flex flex-row justify-between shadow-lg mb-5 dark:bg-gray-800">
              <div>
              <p className="block text-[17px] font-bold text-gray-700 dark:text-white">
                Message: {req.message}
              </p>
              <p className="block text-[15px] font-semibold text-gray-700 dark:text-white">
                Status:{" "}
                <span className={`font-bold ${getStatusColor(req.status)}`}>
                  {req.status}
                </span>
              </p>
              <p className=" text-[12px] text-gray-500 dark:text-gray-300">
                Created At: {new Date(req.createdAt).toLocaleString()}
              </p>
              <p className=" text-[12px] text-gray-500 dark:text-gray-300">
                Updated At: {new Date(req.updatedAt).toLocaleString()}
              </p>
              </div>

              <div className="mr-8">
                <label
                  htmlFor={`status-${req._id}`}
                  className="text-ms font-bold text-gray-700 dark:text-white mb-3"
                >
                  Change Status:
                </label>
                <select
                  id={`status-${req._id}`}
                 className="mt-1 block w-[300px] rounded-md bg-gray-100 text-black  px-4 py-1 dark:bg-green-400 focus:border-grenn-400 shadow-lg "
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
