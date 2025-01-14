import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faDownload, faFilePdf, faVideo, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import Image from 'next/image';
import { useUser } from "@clerk/nextjs"; 
import axios from "axios";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export default function File({ file, isOpen = false, onDeleteFile }: { file: any, isOpen: boolean, onDeleteFile: (id: string) => void }) {
    const [isModalOpen, setIsModalOpen] = useState(isOpen);
    const [isDetailedView, setIsDetailedView] = useState(false); 
    const [shouldDownload, setShouldDownload] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [optionsVisible, setOptionsVisible] = useState(false);
    const toggleOptions = () => setOptionsVisible(!optionsVisible);
    const toggleDeleteModal = () => setDeleteModalVisible(!deleteModalVisible);
    const { user } = useUser();
    const edit = user?.unsafeMetadata.accessLevel === 0 || user?.unsafeMetadata.accessLevel === 1;

    async function handleUserDownloadedFile(e: { preventDefault: () => void; }) {
        e.preventDefault();
        console.log("User downloaded file", file.fileId);
        if (user) {
            try {
                const query = { email: user.primaryEmailAddress?.emailAddress };
                const userResponse = await axios.post('/api/get-user', query);
                await axios.post('/api/log-activity', {
                    UserId: userResponse.data.UserId,
                    activityType: 'downloadedFiles',
                    activityData: file.fileName,
                });
                setShouldDownload(true);
            } catch (error) {
                console.error('Error logging download activity:', error);
            }
        }
    };
    const handleDelete = async () => {
        try {
          await axios.post('/api/delete-file', { 
            fileId: file.fileId, 
          });
          onDeleteFile(file.fileId);
          if (user) {
            const query = { email: user.primaryEmailAddress?.emailAddress };
            const userResponse = await axios.post('/api/get-user', query);
            await axios.post('/api/log-activity', {
                UserId: userResponse.data.UserId,
                activityType: 'deletedFiles',
                activityData: file.fileName,
            });  
          }
        } catch (err) {
          console.error('Failed to delete:', err);
        }
        setDeleteModalVisible(false);
        setOptionsVisible(false);
      };

    const filePreviewUrl = `data:application/octet-stream;base64,${Buffer.from(
        file.fileData //filePreview
    ).toString("base64")}`;

    const fileDataUrl = `data:application/octet-stream;base64,${Buffer.from(
        file.fileData
    ).toString("base64")}`;

    useEffect(() => {
        setIsModalOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        if (shouldDownload) {
            const link = document.createElement('a');
            link.href = fileDataUrl;
            link.download = file.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setShouldDownload(false);
        }
    }, [shouldDownload, file.fileName, fileDataUrl]);

    const isImage = /\.(jpeg|jpg|png|gif|bmp|tiff)$/i.test(file.fileName);
    const isVideo = /\.(mp4|mov)$/i.test(file.fileName);
    const isPdf = /\.pdf$/i.test(file.fileName);
    const isPowerpoint = /\.ppt$/i.test(file.fileName);

    const renderPreview = () => {
        if (isImage) {
            return (
                <Image src={filePreviewUrl} alt={file.fileName} width={64} height={64} className="object-scale-down max-h-16 maxw-16 pb-2" onClick={() => setIsModalOpen(true)} />     
            );
        } else if (isVideo) {
            return (
                <FontAwesomeIcon icon={faVideo} className="text-4xl pb-2" onClick={() => setIsModalOpen(true)} />  
            );
        } else if (isPdf || isPowerpoint) {
            return (
                <FontAwesomeIcon icon={faFilePdf} className="text-4xl pb-2" onClick={() => setIsModalOpen(true)} />
            );
        } else {
            return (
                <div onClick={() => setIsModalOpen(true)}>{file.fileName}</div>
            );
        }
    };

    const renderFile = () => {
        if (isImage) {
            return (
                <Image src={filePreviewUrl} alt={file.fileName} width={720} height={720} onClick={() => setIsModalOpen(true)} />     
            );
        } else if (isVideo) {
            return (
                <video controls>
                    <source src={fileDataUrl} type="video/mp4" />
                </video>
            );
        } else if (isPdf || isPowerpoint) {
            return (
                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                    <Viewer fileUrl={fileDataUrl} />
                </Worker>
            );
        } else {
            return (
                <div>{file.fileName}</div>
            );
        }
    };

    return (
        <>
        <div className="relative flex flex-col items-center p-4 bg-gray-100 rounded-lg min-w-32 min-h-32 max-w-32 max-h-32">
        <div>{renderPreview()}</div>
        <div className="flex-1 w-full overflow-hidden text-ellipsis whitespace-nowrap pb-4">
          {file.fileName}
        </div>
        {(edit && <button
            className="absolute bottom-2 right-2 bg-opacity-0 text-black hover:bg-white hover:bg-opacity-80 hover:text-white min-w-[20px] rounded-sm max-w-[20px]"
            onClick={toggleOptions}
        >
            <FontAwesomeIcon
                icon={faEllipsisVertical}
                className="text-black"
            />
        </button> )}
                
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl h-auto max-h-[90vh] relative overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold truncate">{file.fileName}</h1>
                <button
                  className="text-gray-500 hover:text-gray-700 text-2xl ml-4"
                  onClick={() => setIsModalOpen(false)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              {renderFile()}
              <a
                href={fileDataUrl}
                download={`${file.fileName}`}
                className="mt-4 inline-block text-[#e63d4e] cursor-pointer"
                onClick={handleUserDownloadedFile}
              >
                <FontAwesomeIcon icon={faDownload} />
                <span className="ml-2">Download</span>
              </a>
            </div>
          </div>
        )}
      </div>
      {optionsVisible && (
          <div className="flex mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
            <button
              className="w-full px-4 py-2 text-red-600 hover:bg-gray-100"
              onClick={toggleDeleteModal}
            >
              Delete
            </button>
          </div>
        )}

      {deleteModalVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
              <p>Are you sure you want to delete this file?</p>
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
      </>

    );
}