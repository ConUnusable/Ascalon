import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

export default function AddFolderButton({ currentFolder, addFolder }: { currentFolder: any, addFolder: (newFolder: any) => void }) {
    const [open, setOpen] = useState(false);
    const reserved = ["Upload", "Images", "Changes"]
    const [name, setName] = useState('');
    const { user } = useUser();
    const [error, setError] = useState('');

    function openModal() {
        setOpen(true);
    }

    function closeModal() {
        setOpen(false);
    }

    async function handleSubmit(e: { preventDefault: () => void; }) {
      e.preventDefault();
      if (reserved.includes(name)) {
        alert("This folder name is reserved. Please choose another name.");
      } else {
          var folder_json = {
            folder: name,
            parentId: currentFolder,
        };

        try {
            const response = await axios.post('/api/new-folder', folder_json);
            addFolder(response.data);
            if (user) {
                const query = { email: user.primaryEmailAddress?.emailAddress };
                const userResponse = await axios.post('/api/get-user', query);
                await axios.post('/api/log-activity', {
                    UserId: userResponse.data.UserId,
                    activityType: 'createdFolders',
                    activityData: response.data.folder,
                });
            }
        } catch (error) {
            console.error("Error posting folder:", error);
            setError('Failed to post folder. Please try again later.');
        }
      }
        setName('');
        closeModal();
    }

    return (
      <>
        <Button
          onClick={openModal}
          className="bg-[#e63d4e] hover:bg-[#e63d4e] hover:bg-opacity-80 py-5 px-5"
        >
          <Image
            src="/add folder icon.png"
            alt="Folder"
            height={35}
            width={35}
          />
        </Button>
        {open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <span
                className="absolute top-2 right-2 text-gray-500 cursor-pointer"
                onClick={closeModal}
              >
                &times;
              </span>
              <label className="block text-gray-700 mb-2">
                Choose Folder Name:
              </label>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-500 text-white px-4 py-2 rounde hover:bg-gray-500 hover:text-white hover:bg-opacity-80"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#e63d4e] text-white px-4 py-2 rounded hover:bg-[#e63d4e] hover:text-white hover:bg-opacity-80"
                  >
                    Add Folder
                  </button>
                </div>
              </form>
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
          </div>
        )}
      </>
    );
}