import React from 'react';
import { useSelector } from 'react-redux';
import { useGetComplaintsQuery } from "@/redux/features/auth/authApi";

const ViewComplaints = () => {
  const user = useSelector((state) => state.auth.user);
  if (!user) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  const { data: complaintsData, error, isLoading } = useGetComplaintsQuery(user._id);

  const getComplaints = () => {
    if (Array.isArray(complaintsData)) {
      return complaintsData;
    } else if (complaintsData && Array.isArray(complaintsData.complaints)) {
      return complaintsData.complaints;
    }
    return [];
  };

  const complaints = getComplaints();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-green-600 text-white p-4">
          <h2 className="text-2xl font-bold">Your Complaints</h2>
        </div>
        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <p className="text-red-500">Error loading complaints: {error.message}</p>
          ) : complaints.length === 0 ? (
            <p className="text-gray-500 italic">No complaints found.</p>
          ) : (
            <ul className="space-y-4">
              {complaints.map((complaint) => (
                <li key={complaint._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <p className="text-lg font-medium mt-1 text-black">{complaint.message}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">
                      {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit',
                      })}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${complaint.status === 'completed' ? 'bg-green-100 text-green-800' :
                        complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                      {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1).toLowerCase()}
                    </span>

                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewComplaints;