import React, { useState } from "react";
import { useCreateRequestCollectMutation } from '@/redux/features/auth/authApi'; // Adjust the import based on your file structure

type RequestCollect = {
  _id: string;
  userId: string;
  driverId?: string; // Optional field
  binId: string;
  status: 'pending' | 'collected' | 'cancelled';
  message?: string; // Optional field
  createdAt: string;
  updatedAt: string;
};

const RequestsComponent: React.FC<{ userId: string }> = ({ userId }) => {
  const [binId, setBinId] = useState<string>('');
  const [status, setStatus] = useState<'pending' | 'collected' | 'cancelled'>('pending');
  const [message, setMessage] = useState<string>('');
  
  // Use the mutation hook
  const [createRequestCollect, { isLoading, error }] = useCreateRequestCollectMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userId = '670ca24993c78fd0aadd099e'

    // Create the new request data
    const newRequestData: Partial<RequestCollect> = {
      binId,
      userId,
      status,
      message,
      createdAt: new Date().toISOString(), // Adjust according to your requirements
      updatedAt: new Date().toISOString(),
    };

    // Call the mutation
    try {
      await createRequestCollect({ userId, newRequestData }).unwrap();
      // Handle successful submission (e.g., show success message)
      console.log('Request created successfully');
      // Clear form fields after submission
      setBinId('');
      setMessage('');
    } catch (err) {
      // Handle error (e.g., show error message)
      console.error('Error creating request:', err);
    }
  };

  return (
    <div className="p-5 bg-green-100 dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4">Create Garbage Collection Request</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="binId" className="block mb-2">Bin ID:</label>
          <input
            type="text"
            id="binId"
            value={binId}
            onChange={(e) => setBinId(e.target.value)}
            required
            className="border rounded-lg p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="status" className="block mb-2">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'pending' | 'collected' | 'cancelled')}
            className="border rounded-lg p-2 w-full"
          >
            <option value="pending">Pending</option>
            <option value="collected">Collected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block mb-2">Message (optional):</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border rounded-lg p-2 w-full"
          />
        </div>
        <button type="submit" disabled={isLoading} className="bg-blue-500 text-white rounded-lg py-2 px-4">
          {isLoading ? 'Submitting...' : 'Submit Request'}
        </button>
        {error && <p className="text-red-500 mt-2">Error: {error.message}</p>} {/* Display error message */}
      </form>
    </div>
  );
};

export default RequestsComponent;

