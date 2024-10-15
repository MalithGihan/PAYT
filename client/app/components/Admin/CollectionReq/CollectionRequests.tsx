import React, { useState } from "react";
import {
  useFetchCollectRequestsQuery,
  useGetUsersQuery,
  useModifyRequestMutation,
} from "@/redux/features/auth/authApi";

interface Request {
  _id: string;
  userId: string;
  driverId?: string;
  binId: string;
  status: "pending" | "collected" | "cancelled";
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
  const {
    data: requestsData,
    error: requestsError,
    isLoading: isRequestsLoading,
    refetch,
  } = useFetchCollectRequestsQuery({});
  const {
    data: userData,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useGetUsersQuery();
  const [modifyRequest] = useModifyRequestMutation();

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [formData, setFormData] = useState<
    Omit<Request, "_id" | "createdAt" | "updatedAt">
  >({ userId: "", driverId: "", binId: "", status: "pending", message: "" });

  const handleSelectRequest = (request: Request) => {
    setSelectedRequest(request);
    setFormData({
      userId: request.userId,
      driverId: request.driverId || "",
      binId: request.binId,
      status: request.status,
      message: request.message || "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRequest) {
      try {
        await modifyRequest({
          requestId: selectedRequest._id,
          updates: formData,
        }).unwrap();
        refetch();
        setSelectedRequest(null);
        setFormData({
          userId: "",
          driverId: "",
          binId: "",
          status: "pending",
          message: "",
        });
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
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
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

  const filteredDrivers = userData?.user?.filter(
    (user: User) => user.role === "driver"
  );

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-10">
        Collection Requests
      </h1>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden dark:bg-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] divide-y divide-gray-200 dark:bg-gray-900">
            <thead className="bg-gray-50 dark:bg-slate-800">
              <tr>
                {[
                  "User",
                  "Driver",
                  "Bin",
                  "Status",
                  "Message",
                  "Created",
                  "Updated",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900">
              {requestsData?.requests?.length ? (
                requestsData.requests.map((request: Request) => (
                  <tr
                    key={request._id}
                    className="hover:bg-gray-50 dark:hover:bg-black"
                  >
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
                      {userIdToNameMap[request.userId] || "N/A"}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
                      {request.driverId
                        ? userIdToNameMap[request.driverId] || "N/A"
                        : "N/A"}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
                      {request.binId}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          request.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : request.status === "collected"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
                      {request.message
                        ? request.message.slice(0, 20) +
                          (request.message.length > 20 ? "..." : "")
                        : "N/A"}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-white">
                      {new Date(request.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <input
                        value="Edit"
                        type="button"
                        onClick={() => handleSelectRequest(request)}
                        className="bg-green-400 dark:bg-white hover:bg-green-700 text-white dark:text-black font-bold text-xs self-baseline mt-1 py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[100px]"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                  >
                    No collection requests available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRequest && (
        <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden dark:bg-gray-900">
          <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Edit Request
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="userId"
                >
                  User ID
                </label>
                <input
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100 text-black p-2 dark:text-white dark:bg-black"
                  disabled
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="driverId"
                >
                  Driver
                </label>
                <select
                  name="driverId"
                  value={formData.driverId}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-100  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black dark:text-white dark:bg-black"
                >
                  <option value="">Select Driver</option>
                  {filteredDrivers?.map((driver: User) => (
                    <option key={driver._id} value={driver._id}>
                      {driver.name} - {driver.email}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="binId"
                >
                  Bin ID
                </label>
                <input
                  type="text"
                  name="binId"
                  value={formData.binId}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100 text-black p-2 dark:text-white dark:bg-black"
                  disabled
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="status"
                >
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black dark:text-white dark:bg-black"
                >
                  <option value="pending">Pending</option>
                  <option value="collected">Collected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="message"
                >
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100 text-black p-2 dark:text-white dark:bg-black"
                  rows={3}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <input
                value="Cancel"
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="bg-red-600 hover:bg-red-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[100px]"
              />

              <input
                value="Update Request"
                type="submit"
                className="bg-black hover:bg-green-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[150px]"
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default CollectionRequests;
