import React from "react";
import { useFetchCollectRequestsQuery, useGetBinsQuery, useUpdateBinStatusMutation } from '@/redux/features/auth/authApi';
import { useSelector } from 'react-redux';

interface Request {
    _id: string;
    userId: string;
    driverId?: string;
    binId: string;
    status: 'pending' | 'collected' | 'cancelled';
    message?: string;
    createdAt: string;
    updatedAt: string;
}

interface Bin {
    _id: string;
    location: string; 
    size: string;
    status: string; 
    isCollected?: boolean; 
}

const ListtoCollect = () => {
    const user = useSelector((state: any) => state.auth.user);
    const userId = user?._id; 
    const { data: requestsData, error: requestsError, isLoading: isRequestsLoading, refetch: refetchRequests } = useFetchCollectRequestsQuery({});
    const { data: binsData, error: binsError, isLoading: isBinsLoading, refetch: refetchBins } = useGetBinsQuery({}); 
    const [updateBinStatus] = useUpdateBinStatusMutation(); 

    const filteredRequests = requestsData?.requests.filter((request: Request) => request.driverId === userId) || [];

    const binsMap = new Map<string, Bin>();
    binsData?.bins.forEach((bin: Bin) => {
        binsMap.set(bin._id, bin);
    });

    const handleUpdateStatus = async (binId: string) => {
        try {
            await updateBinStatus({ binId, isCollected: true }).unwrap();
            refetchRequests();
            refetchBins();
        } catch (error) {
            console.error("Failed to update bin status:", error);
        }
    };

    return (
        <div className="p-6">
            
            <div className="overflow-x-auto mb-8">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-green-200">
                        <tr className="text-black">
                            <th className="py-3 px-6 border-b text-left">Location</th>
                            <th className="py-3 px-6 border-b text-left">Size</th>
                            <th className="py-3 px-6 border-b text-left">Level</th>
                            <th className="py-3 px-6 border-b text-left">Is Collected</th>
                            <th className="py-3 px-6 border-b text-left">Assigned Date</th>
                            <th className="py-3 px-6 border-b text-left">Actions</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {isRequestsLoading ? (
                            <tr>
                                <td className="py-2 px-4 border-b text-center" colSpan={6}>Loading requests...</td>
                            </tr>
                        ) : requestsError ? (
                            <tr>
                                <td className="py-2 px-4 border-b text-center" colSpan={6}>Error loading requests.</td>
                            </tr>
                        ) : filteredRequests.length ? (
                            filteredRequests
                                .filter((request: Request) => !binsMap.get(request.binId)?.isCollected) 
                                .map((request: Request) => {
                                    const bin = binsMap.get(request.binId); 
                                    return (
                                        <tr key={request._id} className="hover:bg-green-100 text-black transition duration-200 ease-in-out">
                                            <td className="py-2 px-6 border-b">{bin?.location}</td>
                                            <td className="py-2 px-6 border-b">{bin?.size}</td>
                                            <td className="py-2 px-6 border-b">{bin?.level}</td>
                                            <td className="py-2 px-6 border-b">{bin?.isCollected ? 'Yes' : 'No'}</td>
                                            <td className="py-2 px-6 border-b">
                                                {new Date(request.updatedAt).toLocaleString('en-US', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="py-2 px-6 border-b">
                                                {!bin?.isCollected && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(bin._id)}
                                                        className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition duration-200"
                                                    >
                                                        Mark as Collected
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                        ) : (
                            <tr>
                                <td className="py-2 px-4 border-b text-center" colSpan={6}>
                                    No collection requests available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListtoCollect;
