import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Activity {
  activityId: number;
  userId: number;
  accessedFolders: string;
  createdFolders: string;
  deletedFolders: string;
  uploadedFiles: string;
  downloadedFiles: string;
  deletedFiles: string;
  activityDate: string;
}

const ViewReport = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.post('/api/get-activity', { folderId: '' });
        setActivities(response.data);
      } catch (err) {
        console.error('Failed to fetch activities:', err);
      }
    };

    fetchActivities();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredActivities = activities.filter(activity =>
    activity.userId.toString().includes(searchTerm)
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4 text-[#e63d4e]">
        VIEW ACTIVITIES
      </h1>
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
            <th className="py-2 px-4 border-b">ActivityId</th>
            <th className="py-2 px-4 border-b border-l-2">UserId</th>
            <th className="py-2 px-4 border-b border-l-2">Accessed Folders</th>
            <th className="py-2 px-4 border-b border-l-2">Created Folders</th>
            <th className="py-2 px-4 border-b border-l-2">Deleted Folders</th>
            <th className="py-2 px-4 border-b border-l-2">Uploaded Files</th>
            <th className="py-2 px-4 border-b border-l-2">Downloaded Files</th>
            <th className="py-2 px-4 border-b border-l-2">Deleted Files</th>
            <th className="py-2 px-4 border-b border-l-2">Activity Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredActivities.map((activity) => (
            <tr key={activity.activityId}>
              <td className="py-2 px-4 border-b">{activity.activityId}</td>
              <td className="py-2 px-4 border-b border-l-2">
                {activity.userId}
              </td>
              <td
                className="py-2 px-4 border-b border-l-2 truncate max-w-64"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxHeight: "100px",
                }}
              >
                {activity.accessedFolders.split(", ").map((folder, index) => (
                  <div
                    key={index}
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {folder}
                  </div>
                ))}
              </td>
              <td
                className="py-2 px-4 border-b border-l-2 truncate max-w-64"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxHeight: "100px",
                }}
              >
                {activity.createdFolders.split(", ").map((folder, index) => (
                  <div
                    key={index}
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {folder}
                  </div>
                ))}
              </td>
              <td
                className="py-2 px-4 border-b border-l-2 truncate max-w-64"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxHeight: "100px",
                }}
              >
                {activity.deletedFolders.split(", ").map((folder, index) => (
                  <div
                    key={index}
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {folder}
                  </div>
                ))}
              </td>
              <td
                className="py-2 px-4 border-b border-l-2 truncate max-w-64"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxHeight: "100px",
                }}
              >
                {activity.uploadedFiles.split(", ").map((file, index) => (
                  <div
                    key={index}
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {file}
                  </div>
                ))}
              </td>
              <td
                className="py-2 px-4 border-b border-l-2 truncate max-w-64"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxHeight: "100px",
                }}
              >
                {activity.downloadedFiles.split(", ").map((file, index) => (
                  <div
                    key={index}
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {file}
                  </div>
                ))}
              </td>
              <td
                className="py-2 px-4 border-b border-l-2 truncate max-w-64"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxHeight: "100px",
                }}
              >
                {activity.deletedFiles.split(", ").map((file, index) => (
                  <div
                    key={index}
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {file}
                  </div>
                ))}
              </td>
              <td className="py-2 px-4 border-b border-l-2">
                {new Date(activity.activityDate).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewReport;