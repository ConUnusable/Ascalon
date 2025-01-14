import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  UserId: number;
  email: string;
  name: string;
  surname: string;
  accessLevel: number;
  rootFolderAccess: string;
  folderNames: string[];
}

const ViewUserForm = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const toggleDeleteModal = () => setDeleteModalVisible(!deleteModalVisible);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.post('/api/get-all-user', { email: '' });
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(users =>
    users.UserId.toString().includes(searchTerm)
  );

  const accessLevelMap: { [key: number]: string } = {
    0: 'Admin',
    1: 'Designer',
    2: 'Client',
  };

  const handleDeleteUser = async () => {
    try {
      await axios.post('/api/delete-user', { 
        UserId: Number(searchTerm)  
      });
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
    setDeleteModalVisible(false);
  };

  return (
    <>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4 text-[#e63d4e]">VIEW USERS</h1>
      <input
        type="text"
        placeholder="Search by user ID"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">UserId</th>
            <th className="py-2 px-4 border-b border-l-2">Name</th>
            <th className="py-2 px-4 border-b border-l-2">Email</th>
            <th className="py-2 px-4 border-b border-l-2">Access Level</th>
            <th className="py-2 px-4 border-b border-l-2">Root Folder Access</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.UserId}>
              <td className="py-2 px-4 border-b">{user.UserId}</td>
              <td className="py-2 px-4 border-b border-l-2">{`Connor Mackinnon`}</td>
              <td className="py-2 px-4 border-b border-l-2 truncate">{user.email}</td>
              <td className="py-2 px-4 border-b border-l-2">{accessLevelMap[user.accessLevel]}</td>
              <td
              className="py-2 px-4 border-b border-l-2 truncate max-w-64"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxHeight: "100px",
              }}
            >
              {user.folderNames.map((folderName, index) => (
                <div
                  key={index}
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {folderName}
                </div>
              ))}
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  
    <button
        onClick={toggleDeleteModal}
        className="my-16 max-x-[200px] pl-3 pr-3 h-12 mb-6 text-sm font-light text-white hover:text-white bg-[#e63d4e] hover:bg-[#e63d4e] hover:bg-opacity-80 rounded-md"
    >
        Delete user at ID
    </button>
    
    {deleteModalVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white p-6 rounded-md shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
              {(searchTerm != '') && 
              <>
                <p>Are you sure you want to delete this user with ID of {searchTerm} ?</p>
                
                <div className="mt-6 flex justify-end">
                  <button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                    onClick={toggleDeleteModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded"
                    onClick={handleDeleteUser}
                  >
                    Delete User
                  </button> 
                </div> 
                </>}
              {(searchTerm == '') && 
              <div className="mt-6 flex justify-end">
                <p className='pr-2'>Please enter a user ID to delete</p>
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                  onClick={toggleDeleteModal}
                >
                  Close
                </button>
              </div>}
            </div>
          </div>
        )}
    </>
  );
};

export default ViewUserForm;