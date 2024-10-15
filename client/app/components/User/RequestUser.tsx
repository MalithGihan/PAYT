import React, { useState } from "react";
import { useGetBinsByIdQuery, useCreateRequestMutation } from '@/redux/features/auth/authApi';
import { useSelector } from 'react-redux';

const RequestsComponent: React.FC = () => {
  const [binId, setBinId] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const user = useSelector((state: any) => state.auth.user);
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { data: binsData, error: binsError, isLoading: binsLoading } = useGetBinsByIdQuery(user._id);
  const [createRequestCollect, { isLoading, error }] = useCreateRequestMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!binId) {
      console.error('No bin selected');
      return;
    }

    try {
      await createRequestCollect({
        userId: user._id,
        data: { binId, message }
      }).unwrap();
      console.log('Request created successfully');
      setBinId('');
      setMessage('');
    } catch (err) {
      console.error('Error creating request:', err);
    }
  };

  return (
    <div className="p-5 bg-green-100 dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4">Create Garbage Collection Request</h2>

      {binsLoading && <p>Loading bins...</p>}
      {binsError && <p className="text-red-500">Error fetching bins: {JSON.stringify(binsError)}</p>}

      {binsData && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="binId" className="block mb-2">Select Bin:</label>
            <select
              id="binId"
              value={binId}
              onChange={(e) => setBinId(e.target.value)}
              className="border rounded-lg p-2 w-full"
              required
            >
              <option value="" disabled>Select a bin</option>
              {binsData.bins.map((bin: { _id: string; Location: string; size: string; level: string }) => (
                <option key={bin._id} value={bin._id}>
                  Location: {bin.Location} | Size: {bin.size} | Level: {bin.level}
                </option>
              ))}
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
          {error && <p className="text-red-500 mt-2">Error: {JSON.stringify(error)}</p>}
        </form>
      )}
    </div>
  );
};

export default RequestsComponent;