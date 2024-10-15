import React, { useState, useEffect } from "react";
import {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from "@/redux/features/auth/authApi";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Users: React.FC = () => {
  const { data: userData, isLoading, isError, refetch } = useGetUsersQuery();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRole(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleEditUser = (user: any) => {
    console.log("Editing user:", user);
    console.log("Current role:", user.role);
    setEditingUser(user);
    setNewRole(user.role);
  };

  const handleUpdateRole = async () => {
    if (editingUser && newRole && newRole !== editingUser.role) {
      try {
        await updateUserRole({ id: editingUser._id, role: newRole }).unwrap();
        setMessage({
          type: "success",
          text: `Role updated to ${newRole} for ${editingUser.name}`,
        });
        setEditingUser(null);
        refetch();
      } catch (error) {
        console.error("Failed to update user role:", error);
        setMessage({ type: "error", text: "Failed to update user role" });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setNewRole("");
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      setMessage({ type: "success", text: "User deleted successfully" });
      refetch();
    } catch (error) {
      console.error("Failed to delete user:", error);
      setMessage({ type: "error", text: "Failed to delete user" });
    }
  };

  const filteredUsers = userData?.user?.filter((user: any) => {
    const matchesRole =
      selectedRole === "all" ? true : user.role === selectedRole;
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  if (isLoading)
    return <div className="text-center text-gray-600">Loading users...</div>;
  if (isError)
    return <div className="text-center text-red-500">Error loading users</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[100vh]">
      <h1 className="text-2xl font-bold text-black dark:text-white mb-6">
        Dashboard Users
      </h1>

      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search by name or email"
        className="flex float-end w-[30%] self-end p-2 border border-gray-300 rounded-lg bg-white text-black mb-4 shadow-md dark:bg-gray-700"
      />
      {message && (
        <div
          className={`mb-4 p-2 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}
      <div className="mb-6">
        <h2 className="text-ms font-bold text-gray-700 dark:text-white mb-3">
          Filter by Role:
        </h2>
        <div className="flex items-center space-x-4">
          {["all", "admin", "user", "driver"].map((role) => (
            <label
              key={role}
              className="flex items-center text-black font-semibold dark:text-white"
            >
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

      <div className="user-list">
        <h2 className="text-xl font-semibold text-black dark:text-green-300 mb-7">
          Users
        </h2>
        {filteredUsers && filteredUsers.length > 0 ? (
          <ul className="space-y-4">
            {filteredUsers.map((user: any) => (
              <li
                key={user._id}
                className="p-4 bg-white shadow-lg rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between dark:bg-gray-800 mb-5"
              >
                <div className="sm:flex-grow">
                  <p className="text-lg font-bold text-gray-800 dark:text-white">
                    {" "}
                    Name : {user.name}
                  </p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-white">
                    Email : {user.email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-white">
                    Address: {user.address}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-white">
                    Role :{" "}
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </p>
                </div>
                <div className="flex justify-end">
                  {editingUser && editingUser._id === user._id ? (
                    <div >
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="mr-2 p-2 border border-gray-300 rounded"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="driver">Driver</option>
                      </select>
                      
                      <div className="flex gap-5 self-baseline">
                      <input
                        value="Save"
                        type="button"
                        onClick={handleUpdateRole}
                        className="bg-black hover:bg-green-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[100px]"
                      />
                      <input
                        value="Cancel"
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-red-600 hover:bg-red-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[100px]"
                      /> 
                      </div>
                    </div>
                  ) : (
                    <div className="flex space-x-4">
                      <input
                        value="Edit"
                        type="button"
                        onClick={() => handleEditUser(user)}
                        className="bg-black hover:bg-green-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[100px]"
                      />
                      <input
                        value="Delete"
                        type="button"
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-600 hover:bg-red-700 text-white dark:text-white font-bold text-xs self-baseline py-2 px-2 rounded-md shadow-sm transition duration-150 ease-in-out w-[100px]"
                      />
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

export default Users;
