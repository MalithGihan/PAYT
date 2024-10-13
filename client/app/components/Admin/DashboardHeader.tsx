import React, { useState } from 'react';
import { useGetUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation } from "@/redux/features/auth/authApi";

const DashboardHeader: React.FC = () => {
  const { data: userData, isLoading, isError, refetch } = useGetUsersQuery();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation(); 
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newRole, setNewRole] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRole(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleEditUser = (user: any) => {
    console.log('Editing user:', user);
    console.log('Current role:', user.role);
    setEditingUser(user);
    setNewRole(user.role);
  };

  const handleUpdateRole = async () => {
    if (editingUser && newRole && newRole !== editingUser.role) {
      try {
        await updateUserRole({ id: editingUser._id, role: newRole }).unwrap();
        setMessage({ type: 'success', text: `Role updated to ${newRole} for ${editingUser.name}` });
        setEditingUser(null);
        refetch();
      } catch (error) {
        console.error('Failed to update user role:', error);
        setMessage({ type: 'error', text: 'Failed to update user role' });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setNewRole('');
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id).unwrap(); 
      setMessage({ type: 'success', text: 'User deleted successfully' });
      refetch();
    } catch (error) {
      console.error('Failed to delete user:', error);
      setMessage({ type: 'error', text: 'Failed to delete user' });
    }
  };

  const filteredUsers = userData?.user?.filter((user: any) => {
    const matchesRole = selectedRole === 'all' ? true : user.role === selectedRole;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  if (isLoading) return <div className="text-center text-gray-600">Loading users...</div>;
  if (isError) return <div className="text-center text-red-500">Error loading users</div>;

  return (
    <div className="dashboard-header bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Users</h1>

      {message && (
        <div className={`mb-4 p-2 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search by name or email"
        className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black mb-4"
      />

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Filter by Role:</h2>
        <div className="flex items-center space-x-4">
          {['all', 'admin', 'user', 'driver'].map((role) => (
            <label key={role} className="flex items-center text-black">
              <input
                type="radio"
                value={role}
                checked={selectedRole === role}
                onChange={handleRoleChange}
                className="mr-2"
              />
              <span className="capitalize">{role}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="user-list bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Users:</h2>
        {filteredUsers && filteredUsers.length > 0 ? (
          <ul className="space-y-4">
            {filteredUsers.map((user: any) => (
              <li key={user._id} className="p-4 bg-white shadow rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="sm:flex-grow">
                  <p className="text-lg font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-600">Address: {user.address}</p>
                  <p className="text-sm text-gray-600">Role: {user.role}</p>
                  <p className="text-sm text-gray-600">Bins: {user.bins}</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-6">
                  {editingUser && editingUser._id === user._id ? (
                    <div>
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="mr-2 p-2 border border-gray-300 rounded"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="driver">Driver</option>
                      </select>
                      <button
                        onClick={handleUpdateRole}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No users found</p>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
