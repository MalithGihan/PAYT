import React, { useState } from 'react';
import { useCreateComplaintMutation } from "@/redux/features/auth/authApi";

const ComplaintsCreate = () => {
  const [message, setMessage] = useState('');
  const [createComplaint, { isLoading, isError, isSuccess }] = useCreateComplaintMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createComplaint({ message }).unwrap();
      if (response.success) {
        alert('Complaint created successfully');
        setMessage('');
      }
    } catch (error) {
      console.error('Error creating complaint:', error);
      alert('Failed to create complaint');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create a Complaint</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            className="w-full px-3 py-2 text-black bg-white border rounded-lg focus:outline-none focus:border-blue-500 resize-none"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your complaint"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition duration-300 ${isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50'
            }`}
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
      {isError && <p className="mt-4 text-red-600">Error creating complaint</p>}
      {isSuccess && <p className="mt-4 text-green-600">Complaint created successfully</p>}
    </div>
  );
};

export default ComplaintsCreate;