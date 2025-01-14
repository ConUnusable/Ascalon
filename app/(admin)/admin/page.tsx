"use client";
import React, { useState } from 'react';
import AddUserForm from '@/components/addUserForm';
import ViewUserForm from '@/components/ViewUserForm';
import { useUser } from "@clerk/nextjs"; 

export default function Page() {
  const { user } = useUser();
  const accessLevel = user?.unsafeMetadata.accessLevel;
  const [showAddUserForm, setShowAddUserForm] = useState(true);

  if (accessLevel !== 0) {
    return("Illegal access");
  }

  const toggleForm = () => {
    setShowAddUserForm((prevShowAddUserForm) => !prevShowAddUserForm);
  };

  return (
    <div className="flex flex-col items-center mt-12">
      <div className="flex items-center mb-4">
        <button
          onClick={toggleForm}
          className={`px-4 py-2 rounded-l-full ${showAddUserForm ? 'bg-[#e63d4e] text-white' : 'bg-gray-200 text-black'}`}
        >
          View Users
        </button>
        <button
          onClick={toggleForm}
          className={`px-4 py-2 rounded-r-full ${!showAddUserForm ? 'bg-[#e63d4e] text-white' : 'bg-gray-200 text-black'}`}
        >
          Add User
        </button>
      </div>
      {showAddUserForm ? <ViewUserForm /> :<AddUserForm />}
    </div>
  );
}