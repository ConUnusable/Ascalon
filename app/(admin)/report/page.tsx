"use client";
import { useUser } from "@clerk/nextjs";
import ViewReport from "@/components/viewReport";

export default function Page() {
  const { user } = useUser();
  const accessLevel = user?.unsafeMetadata.accessLevel;
  
  if (accessLevel !== 0) {
    return ("Illegal access");
  }
  
  return (
    <ViewReport />
  );
}