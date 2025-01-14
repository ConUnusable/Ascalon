import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

export default function Folder({ folder, onDelete, onMove, onRename }: { folder: any, onDelete: (id: string) => void, onRename: (id: string, newName : string) => void, onMove: (id: string) => void }) {
    const [menuVisible, setMenuVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteFilesAndFolders, setDeleteFilesAndFolders] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [newFolderParent, setFolderParent] = useState("");
    const [renameModalVisible, setRenameModalVisible] = useState(false);
    const [moveModalVisible, setMoveModalVisible] = useState(false);

    const toggleMenu = () => setMenuVisible(!menuVisible);
    const toggleDeleteModal = () => setDeleteModalVisible(!deleteModalVisible);
    const toggleRenameModal = () => setRenameModalVisible(!renameModalVisible);
    const toggleMoveModal = () => setMoveModalVisible(!moveModalVisible);
  
    const { user } = useUser();
    const edit = user?.unsafeMetadata.accessLevel === 0 || user?.unsafeMetadata.accessLevel === 1;

    const handleLinkClick = async () => {
      try {
        if (user) {
          const query = { email: user.primaryEmailAddress?.emailAddress };
          const userResponse = await axios.post('/api/get-user', query);
          await axios.post('/api/log-activity', {
              UserId: userResponse.data.UserId,
              activityType: 'accessedFolders',
              activityData: folder.folder,
          }); 
        }
      } catch (err) {
          console.error('log actibity failed:', err);
      }
  };

    const handleDelete = async () => {
      try {
        await axios.post('/api/delete-folder', { 
          folderId: folder.folderId, 
          deleteChilds: deleteFilesAndFolders 
        });
        onDelete(folder.folderId);
        if (user) {
          const query = { email: user.primaryEmailAddress?.emailAddress };
          const userResponse = await axios.post('/api/get-user', query);
          await axios.post('/api/log-activity', {
              UserId: userResponse.data.UserId,
              activityType: 'deletedFolders',
              activityData: folder.folder,
          });  
        }
      } catch (err) {
        console.error('Failed to delete:', err);
      }
      setDeleteModalVisible(false);
      setDeleteFilesAndFolders(false);
      setMenuVisible(false);
    };
  
    const handleRename = async () => {
      try {
        await axios.post('/api/rename-folder', {
          folderId: folder.folderId,
          folder: newFolderName
        });
        onRename(folder.folderId, newFolderName);
      } catch (err) {
        console.error('Failed to rename:', err);
      }
      setRenameModalVisible(false);
      setNewFolderName("");
      setMenuVisible(false);
    };
  
    const handleMove = async () => {
      console.log("move", newFolderParent);
      try {
        await axios.post('/api/move-folder', {
          folderId: folder.folderId,
          parentId: newFolderParent
        });
        onMove(folder.folderId);
      } catch (err) {
        console.error('Failed to move:', err);
      }
      setMoveModalVisible(false);
      setFolderParent("");
      setMenuVisible(false);
    };

    return (
      <div className="relative flex max-h-20 max-w-[200px]">
        {((folder.parentId !== "0" || folder.parentId === null) && edit) && (
          <>
            <button 
            onClick={handleLinkClick}
            className="bg-blue-950 text-white pt-2 pb-2 hover:bg-blue-950 hover:bg-opacity-80 hover:text-white flex-auto items-center justify-start max-w-[180px] rounded-l-sm truncate">
              <Link
                href={`/folder/${folder.folderId}`}
                className="flex items-center"
              >
                <FontAwesomeIcon icon={faFolder} className="mr-2 ml-2" />
                <span className="truncate -mr-5">{folder.folder}</span>
              </Link>
            </button>
            <button
              className="bg-blue-950 text-white hover:bg-blue-950 hover:bg-opacity-80 hover:text-white flex-auto items-center justify-center min-w-[20px] rounded-r-sm max-w-[20px]"
              onClick={toggleMenu}
            >
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                className="text-white"
              />
            </button>
          </>
        )}

        {(folder.parentId === "0" || !edit) && (
          <button 
          onClick={handleLinkClick}
          className="bg-blue-950 text-white pt-2 pb-2 hover:bg-blue-950 hover:bg-opacity-80 hover:text-white flex-auto items-center justify-start max-w-[200px] rounded-l-sm rounded-r-sm truncate">
            <Link
              href={`/folder/${folder.folderId}`}
              className="flex items-center"
            >
              <FontAwesomeIcon icon={faFolder} className="mr-2 ml-2" />
              <span className="truncate -mr-5">{folder.folder}</span>
            </Link>
          </button>
        )}

        {menuVisible && (
          <div className="absolute left-52 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={toggleRenameModal}
            >
              Rename
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={toggleMoveModal}
            >
              Move
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              onClick={toggleDeleteModal}
            >
              Delete
            </button>
          </div>
        )}

        {deleteModalVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white p-6 rounded-md shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
              <p>Are you sure you want to delete this folder?</p>
              <label className="block mt-4">
                <input
                  type="checkbox"
                  checked={deleteFilesAndFolders}
                  onChange={(e) => setDeleteFilesAndFolders(e.target.checked)}
                  className="mr-2"
                />
                Delete files and folders inside?
              </label>
              <div className="mt-6 flex justify-end">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                  onClick={toggleDeleteModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {renameModalVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white p-6 rounded-md shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Rename Folder</h2>
              <div className="mt-6 flex justify-end">
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded mr-2"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />

                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                  onClick={toggleRenameModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#e63d4e] text-white px-4 py-2 rounded"
                  onClick={handleRename}
                >
                  Rename
                </button>
              </div>
            </div>
          </div>
        )}
        {moveModalVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white p-6 rounded-md shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Move Folder</h2>
              <div className="mt-6 flex justify-end">
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded mr-2"
                  value={newFolderParent}
                  onChange={(e) => setFolderParent(e.target.value)}
                />

                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                  onClick={toggleMoveModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#e63d4e] text-white px-4 py-2 rounded"
                  onClick={handleMove}
                >
                  Move
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}