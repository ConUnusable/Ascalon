import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Folder {
  folderId: string;
  folder: string;
  parentId: string;
}

const AddUserForm = () => {
  const [email, setEmail] = useState('');
  const [accessLevel, setAccessLevel] = useState(2);
  const [rootFolderAccessId, setRootFolderAccessId] = useState('');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const query = { folderId: "0" };
        const response = await axios.post(`/api/get-children`, query);
        if (Array.isArray(response.data)) {
          setFolders(response.data);
          console.log(response.data);
        } else {
          console.error('Unexpected API response structure:', response.data);
        }
      } catch (err) {
        console.error('Failed to fetch folders:', err);
      }
    };

    fetchFolders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const rootFolderAccess = accessLevel === 0 || accessLevel === 1 ? "0" : selectedFolders.join(',');

    const user_json = {
      email: email,
      name: "",
      surname: "",
      accessLevel: accessLevel,
      rootFolderAccess: rootFolderAccess,
    };

    try {
      const response = await axios.post('/api/add-user', user_json);

      if (response.status === 200) {
        setSuccess('User added successfully!');
        setEmail('');
        setAccessLevel(2);
        setRootFolderAccessId('');
        setSelectedFolders([]);
      }
    } catch (err) {
      setError('Failed to add user. Please try again.');
    }
  };

  const handleFolderSelection = (folderId: string) => {
    setSelectedFolders((prevSelectedFolders) =>
      prevSelectedFolders.includes(folderId)
        ? prevSelectedFolders.filter((id) => id !== folderId)
        : [...prevSelectedFolders, folderId]
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-center mt-12 justify-items-center md:mt-20"
    >
      <div className="h-auto PT-28 w-80 md:w-96">
        <div className="p-6 md:p-8">
          <div>
            <h1 className="mb-6 text-3xl font-semibold text-[#e63d4e]">
              ADD NEW USER
            </h1>
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pb-0.5 pl-4 mb-3 text-lg rounded-xl border-0 border-b-2 text-black bg-blue-50"
              required
            />
          </div>
          <div>
            <select
              value={accessLevel}
              onChange={(e) => setAccessLevel(parseInt(e.target.value))}
              className="block w-full pb-0.5 pl-4 mb-3 text-lg rounded-xl border-0 border-b-2 text-black bg-blue-50"
              required
            >
              <option value={2}>Client</option>
              <option value={1}>Designer</option>
              <option value={0}>Admin</option>
            </select>
          </div>

          {( accessLevel === 2 && <div>
            <label className="block mb-2 text-lg">Select Folders:</label>
            <div className="max-h-64 overflow-y-auto">
              {folders.length > 0 ? (
                folders.map((folder) => (
                  <div key={folder.folderId}>
                    <input
                      type="checkbox"
                      value={folder.folderId}
                      checked={selectedFolders.includes(folder.folderId)}
                      onChange={() => handleFolderSelection(folder.folderId)}
                    />
                    <label className="ml-2">{folder.folder}</label>
                  </div>
                ))
              ) : (
                <p>No folders available</p>
              )}
            </div>
          </div> )}

          <button
            type="submit"
            className="w-full h-12 mb-6 text-sm font-light text-white hover:text-white bg-[#e63d4e] hover:bg-[#e63d4e] hover:bg-opacity-80 rounded-md"
          >
            Add User
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
      </div>
    </form>
  );
};

export default AddUserForm;