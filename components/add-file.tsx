import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { useUser } from "@clerk/nextjs";

export default function AddFileButton({ currentFolder, onFileAdded }: { currentFolder: any, onFileAdded: (file: any) => void }) { 
    const { user } = useUser();
    async function handleUpload(e: any) {
        e.preventDefault();
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = async function(event) {
            const fileData = new Uint8Array(event.target?.result as ArrayBuffer);

            var file_json = {
                fileName: file.name,
                folderId: currentFolder,
                fileData: Array.from(fileData),
                fileSize: 0,
            };

            try {
                const response = await axios.post('/api/new-file', file_json);
                console.log(response);
                onFileAdded(response.data); // Call the callback function with the new file data

                if (user) {
                    const query = { email: user.primaryEmailAddress?.emailAddress };
                    const userResponse = await axios.post('/api/get-user', query);
                    await axios.post('/api/log-activity', {
                        UserId: userResponse.data.UserId,
                        activityType: 'uploadedFiles',
                        activityData: response.data.fileName,
                    });
                }

            } catch (error) {
                console.error("Error posting file:", error);
            }
        };

        reader.readAsArrayBuffer(file);
    }

    return (
        <label className="relative inline-block">
          <Button className="bg-[#e63d4e] hover:bg-[#e63d4e] hover:bg-opacity-80 relative z-10 px-6 ">
            <Image src="/upload icon.png" alt="Folder" height={23} width={23} />
          </Button>
          <input
            type="file"
            className="absolute inset-0 w-full overflow-hidden opacity-0 z-20"
            onChange={handleUpload}
          />
        </label>
    );
}