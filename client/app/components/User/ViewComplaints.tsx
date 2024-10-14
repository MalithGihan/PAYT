import React from 'react';
import { useGetComplaintsQuery } from "@/redux/features/auth/authApi";
import { useSelector } from 'react-redux';

const ViewComplaints = () => {
  // Get userData from Redux store and check if it exists
  const userData = useSelector((state) => state.auth.userData);

  // If userData is not loaded, display a message or handle it as needed
  if (!userData) {
    return <p>Loading user data...</p>;
  }

  const userId = userData.id;

  // Fetch complaints using the userId
  const { data, error, isLoading } = useGetComplaintsQuery(userId);

  // Display loading state
  if (isLoading) return <p>Loading complaints...</p>;

  // Display error state
  if (error) return <p>Error loading complaints. Please try again later.</p>;

  return (
    <div className="complaints-list">
      <h2>Your Complaints</h2>

      {data?.complaints.length === 0 ? (
        <p>No complaints found</p> // Handle empty complaints case
      ) : (
        <ul>
          {data.complaints.map((complaint: any) => (
            <li key={complaint._id}>
              <p><strong>Complaint ID:</strong> {complaint._id}</p>
              <p><strong>Message:</strong> {complaint.message}</p>
              <p><strong>Created At:</strong> {new Date(complaint.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewComplaints;
