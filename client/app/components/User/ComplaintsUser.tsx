import React, { useState } from "react";
import ComplaintsCreate from "./ComplaintsCreate";
import ViewComplaints from "./ViewComplaints";

const ComplaintsComponent = () => {
  const [isCreating, setIsCreating] = useState(true);

  return (
    <div className="p-5 bg-green-100 dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-green-600 dark:text-white">Complaints</h2>
      <p className="text-gray-700 dark:text-gray-300">
        Here you can view and submit complaints related to the system.
      </p>

      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-md focus:outline-none ${isCreating ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          onClick={() => setIsCreating(true)}
        >
          Create Complaint
        </button>
        <button
          className={`px-4 py-2 rounded-md focus:outline-none ${!isCreating ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          onClick={() => setIsCreating(false)}
        >
          View Complaints
        </button>
      </div>
      {isCreating ? <ComplaintsCreate /> : <ViewComplaints />}
    </div>
  );
};

export default ComplaintsComponent;
