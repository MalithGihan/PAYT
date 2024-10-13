import React, { useEffect, useState } from 'react';
import { useGetUsersQuery, useCreateBinMutation, useUpdateBinMutation, useDeleteBinMutation, useGetBinsByIdQuery } from "@/redux/features/auth/authApi";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const UserBin = () => {
  const { data: usersData, error: usersError, isLoading: usersLoading, refetch: refetchUsers } = useGetUsersQuery();
  const [createBin, { isSuccess: isCreateSuccess }] = useCreateBinMutation();
  const [updateBin, { isSuccess: isUpdateSuccess }] = useUpdateBinMutation();
  const [deleteBin, { isSuccess: isDeleteSuccess }] = useDeleteBinMutation();

  const [uniqueUsers, setUniqueUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [newBinData, setNewBinData] = useState({ location: '', size: '' });
  const [editingBin, setEditingBin] = useState(null);
  const [deleteTargetBin, setDeleteTargetBin] = useState(null);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const { data: binsData, error: binsError, isLoading: binsLoading, refetch: refetchBins } = useGetBinsByIdQuery(selectedUserId || '', {
    skip: !selectedUserId,
  });

  useEffect(() => {
    if (usersData?.user && Array.isArray(usersData.user)) {
      setUniqueUsers(usersData.user);
    }
  }, [usersData]);

  useEffect(() => {
    if (binsData) {
      setSelectedUserName(uniqueUsers.find(user => user._id === selectedUserId)?.name || '');
    }
  }, [binsData, uniqueUsers, selectedUserId]);

  useEffect(() => {
    if (isCreateSuccess || isUpdateSuccess || isDeleteSuccess) {
      refetchBins();
    }
  }, [isCreateSuccess, isUpdateSuccess, isDeleteSuccess, refetchBins]);

  const handleCreateBin = async () => {
    try {
      await createBin({ ...newBinData, userId: selectedUserId }).unwrap();
      alert('Bin created successfully');
      setOpenAddModal(false);
      setNewBinData({ location: '', size: '' });
      refetchUsers();
    } catch (error) {
      console.error(error);
      alert('Error creating bin');
    }
  };

  const handleUpdateBin = async () => {
    try {
      await updateBin({ binId: editingBin, updatedBinData: newBinData }).unwrap();
      alert('Bin updated successfully');
      setOpenEditModal(false);
      setEditingBin(null);
      setNewBinData({ location: '', size: '' });
    } catch (error) {
      console.error(error);
      alert('Error updating bin');
    }
  };

  const handleDeleteBin = async () => {
    try {
      await deleteBin(deleteTargetBin).unwrap();
      alert('Bin deleted successfully');
      setOpenDeleteModal(false);
    } catch (error) {
      console.error(error);
      alert('Error deleting bin');
    }
  };

  const openEditBinModal = (bin) => {
    setNewBinData({ location: bin.location, size: bin.size });
    setEditingBin(bin._id);
    setOpenEditModal(true);
  };

  if (usersLoading) {
    return <div>Loading users...</div>;
  }

  if (usersError) {
    return <div>Error fetching users</div>;
  }

  return (
    <div>
      <h2>Users with Bins</h2>
      <Button onClick={() => setSelectedUserId(null)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6">
        Fetch Users
      </Button>

      {!selectedUserId ? (
        <ul className="space-y-4">
          {uniqueUsers.map((user) => (
            <li key={user._id} className="bg-gray-100 p-4 rounded-lg shadow cursor-pointer"
              onClick={() => setSelectedUserId(user._id)}
            >
              <p className="text-lg font-medium text-gray-700">User Name: {user.name}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <Button onClick={() => setSelectedUserId(null)} className="bg-red-500 hover:bg-red-700 hover:text-white font-bold py-2 px-4 rounded mb-6">
            Back to All Users
          </Button>
          <h2>Bins for User: {selectedUserName}</h2>

          <Button onClick={() => setOpenAddModal(true)} className="bg-green-500 hover:bg-green-400 hover:text-white font-bold py-2 px-4 rounded">
            Create Bin
          </Button>

          {binsLoading ? (
            <div>Loading bins...</div>
          ) : binsError ? (
            <div>Error fetching bins</div>
          ) : (
            <ul className="space-y-4">
              {binsData.bins.map((bin) => (
                <li key={bin._id} className="bg-gray-100 p-4 rounded-lg shadow w-2/3">
                  <p className="text-lg font-medium text-gray-700">Location: {bin.location}</p>
                  <p className="text-gray-600">
                    Size: <span className="font-bold">{bin.size}</span>
                  </p>
                  <p className="text-gray-500 text-sm">Created At: {new Date(bin.createdAt).toLocaleString()}</p>
                  <p className="text-gray-500 text-sm">Is Collected: {bin.isCollected ? "Yes" : "No"}</p>

                  <Button onClick={() => openEditBinModal(bin)} className="bg-yellow-500 hover:bg-yellow-700 hover:text-white font-bold py-2 px-4 rounded">
                    Edit Bin
                  </Button>
                  <Button onClick={() => { setDeleteTargetBin(bin._id); setOpenDeleteModal(true); }} className="bg-red-500 hover:bg-red-700 hover:text-white font-bold py-2 px-4 rounded">
                    Delete Bin
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <DialogTitle>Add New Bin</DialogTitle>
        <DialogContent>
          <input
            type="text"
            placeholder="Location"
            value={newBinData.location}
            onChange={(e) => setNewBinData({ ...newBinData, location: e.target.value })}
            className="p-2 border rounded mr-2 bg-white"
          />
          <input
            type="text"
            placeholder="Size"
            value={newBinData.size}
            onChange={(e) => setNewBinData({ ...newBinData, size: e.target.value })}
            className="p-2 border rounded mr-2 bg-white"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateBin} className="bg-green-500 hover:bg-green-700 hover:text-white font-bold py-2 px-4 rounded">
            Create Bin
          </Button>
          <Button onClick={() => setOpenAddModal(false)} className="bg-red-500 hover:bg-red-700 hover:text-white font-bold py-2 px-4 rounded">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit Bin</DialogTitle>
        <DialogContent>
          <input
            type="text"
            placeholder="New Location"
            value={newBinData.location}
            onChange={(e) => setNewBinData({ ...newBinData, location: e.target.value })}
            className="p-2 border rounded mr-2 bg-white"
          />
          <input
            type="text"
            placeholder="New Size"
            value={newBinData.size}
            onChange={(e) => setNewBinData({ ...newBinData, size: e.target.value })}
            className="p-2 border rounded mr-2 bg-white"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateBin} className="bg-green-500 hover:bg-green-700 hover:text-white font-bold py-2 px-4 rounded">
            Update Bin
          </Button>
          <Button onClick={() => setOpenEditModal(false)} className="bg-red-500 hover:bg-red-700 hover:text-white font-bold py-2 px-4 rounded">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this bin?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteBin} className="bg-red-500 hover:bg-red-700 hover:text-white font-bold py-2 px-4 rounded">
            Delete
          </Button>
          <Button onClick={() => setOpenDeleteModal(false)} className="bg-gray-500 hover:bg-gray-700 hover:text-white font-bold py-2 px-4 rounded">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserBin;
