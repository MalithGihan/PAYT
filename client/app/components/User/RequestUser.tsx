import React, { useState } from "react";
import { useGetBinsByIdQuery, useCreateRequestMutation } from '@/redux/features/auth/authApi';
import { useSelector } from 'react-redux';

// Define the correct type for a single bin
interface Bin {
  _id: string;
  location: string; // Changed from Location to location
  size: string;
  level: string;
}

const RequestsComponent: React.FC = () => {
  const [selectedBinId, setSelectedBinId] = useState('');
  const [message, setMessage] = useState('');

  const user = useSelector((state: any) => state.auth.user);
  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  const { data: binsData, error: binsError, isLoading: binsLoading } = useGetBinsByIdQuery(user._id);
  const [createRequestCollect, { isLoading, error }] = useCreateRequestMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBinId) {
      console.error('No bin selected');
      return;
    }

    try {
      await createRequestCollect({
        userId: user._id,
        data: { binId: selectedBinId, message }
      }).unwrap();
      console.log('Request created successfully');
      setSelectedBinId('');
      setMessage('');
    } catch (err) {
      console.error('Error creating request:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-black">Create Garbage Collection Request</h2>
      
      {binsLoading && <p>Loading bins...</p>}
      {binsError && <p className="text-red-500">Error fetching bins: {JSON.stringify(binsError)}</p>}
      
      {binsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {binsData.bins.map((bin: Bin) => (
            <div 
              key={bin._id} 
              className={` rounded-lg p-4 cursor-pointer shadow-lg bg-white ${selectedBinId === bin._id ? 'border-green-500 border-2' : 'border-gray-200'}`}
              onClick={() => setSelectedBinId(bin._id)}
            >
              <h3 className="font-bold mb-2 text-black">{bin.location}</h3>
              <p className="font-thin text-black">Size: {bin.size}</p>
              <p className="font-thin text-black text-3xl my-4">Level: {bin.level}</p>
              <input
                  value={selectedBinId === bin._id ? "Selected" : "Select"}
                  type="button"
                className={`bg-black hover:bg-green-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[100px] ${selectedBinId === bin._id ? 'bg-green-500 text-white' : 'bg-black text-gray-800'}`}
              />
                
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="message" className="block mb-2">Message (optional):</label>
          <textarea
            id="message"
            value={message}
            placeholder="Any messages ?"
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded-lg p-2 text-black"
          />
        </div>
        <input
          type="submit" 
          value={isLoading ? 'Submitting...' : 'Submit Request'}
          disabled={!selectedBinId || isLoading}
          className={`bg-black hover:bg-green-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[150px] ${!selectedBinId || isLoading ? 'bg-black text-white' : 'bg-green-500 text-white'}`}
        />
      </form>

      {error && (
        <p className="text-red-500 mt-4">Error: {JSON.stringify(error)}</p>
      )}
    </div>
  );
};

export default RequestsComponent;