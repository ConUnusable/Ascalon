"use client";
import React, { useState, useEffect } from "react";
import AddFolderButton from "@/components/add-folder";
import useFolder from "@/components/hooks/useFolder";
import AddFileButton from "@/components/add-file";
import FolderBreadCrumbs from "@/components/FolderBreadCrumbs";
import Folder from "@/components/Folder";
import File from "@/components/File";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import TestButton from "@/components/test-button";

export default function Home() {
  const { user } = useUser();
  const folderId = useParams()?.folder?.[1] || "0";
  const openFileId = null; //useParams()?.folder?.[2] || null;
  const { folder, childFolders, childFiles, path, addFolder, deleteFolder, renameFolder, moveFolder } = useFolder(folderId);
  const [files, setFiles] = useState(childFiles);
  const rootAccessIds: string[] = (user?.unsafeMetadata.rootFolderAccess as string[]) || [];
  const accessLevel = user?.unsafeMetadata.accessLevel;
  const showFileUpload = ["Upload"];
  const [hasAccess, setHasAccess] = useState(true);

  useEffect(() => {
    if (path?.length >= 1 && folderId !== "0" && !rootAccessIds.includes(path[0]?.folderId  ?? "") && !rootAccessIds.includes("0")) {
      setHasAccess(false);
    } else {
      setHasAccess(true);
    }
  }, [path, folderId, rootAccessIds]);

  useEffect(() => {
    setFiles(childFiles);
  }, [childFiles]);

  const handleFileAdded = (newFile: any) => {
    setFiles((prevFiles: any) => [...prevFiles, newFile]);
  };

  const handleFileDeleted = (fileId: string) => {
    setFiles((prevFiles: any) => prevFiles.filter((file: any) => file.fileId !== fileId));
  }

  if (!hasAccess) {
    return "Illegal access";
  }
return (
    <>
      {/* <TestButton /> */}

      <div className="d-flex align-items-center">
        <FolderBreadCrumbs currentPath={path} />
      </div>

      <div className="max-w-screen mx-auto flex items-center justify-between pb-8">
        <div>{/* detail / icon view */}</div>
        <div className="flex items-center gap-x-2">
          {(accessLevel === 0 || accessLevel === 1) && (
            <AddFolderButton currentFolder={folderId} addFolder={addFolder} />
          )}
          {folderId !== "0" &&
            (folder?.includes(showFileUpload) ||
              accessLevel === 0 ||
              accessLevel === 1) && (
                <AddFileButton currentFolder={folderId} onFileAdded={handleFileAdded} />
              )}
        </div>
      </div>

      <div className="relative bg-black bg-opacity-15 min-h-[70vh]">
        <Image
          src="/Ascalon vector no line.svg"
          alt=""
          width={500}
          height={500}
          className="absolute inset-0 z-0 opacity-15 flex items-center max-w-screen mx-auto"
        />
        <div className="relative z-10">
          {childFolders.length > 0 && (
            <div className="mx-auto grid grid-cols-5 max-w-screen-2xl pt-3">
              {childFolders.map((childFolder: any) => (
                <div
                  key={childFolder.folderId}
                  className="p-1"
                  style={{ maxWidth: "250px" }}
                >
                  {folderId !== "0" && <Folder 
                    folder={childFolder} 
                    onDelete={deleteFolder} 
                    onRename={renameFolder}
                    onMove={moveFolder} />}
                  {(folderId === "0" && rootAccessIds.includes(childFolder.folderId) || rootAccessIds.includes("0") && folderId === "0") && (
                    <Folder 
                    folder={childFolder} 
                    onDelete={deleteFolder} 
                    onRename={renameFolder}
                    onMove={moveFolder} />
                  )}
                </div>
              ))}
            </div>
          )}

          {files.length > 0 && (
            <div className="flex flex-wrap mt-4 gap-x-3">
              {files.map((childFile: any) => {
                const isFileOpen = childFile.fileId === openFileId;
                return (
                  <div
                    key={childFile.fileId}
                    className="p-2"
                    style={{ maxWidth: "250px" }}
                  >
                    <File file={childFile} isOpen={isFileOpen} onDeleteFile={handleFileDeleted}/>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}