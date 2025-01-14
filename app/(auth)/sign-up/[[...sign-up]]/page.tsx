"use client";
import Link from "next/link";
import axios from "axios";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import SignupForm from "@/components/SignUpForm";
import VerifyForm from "@/components/VerifyForm";

const checkEmailWithDatabase = async (email: string) => {
  try {
    const response = await axios.post("/api/check-email", { email });
    return response.data;
  } catch (error) {
    console.error("Error checking email:", error);
    return null;
  }
};

const Signup = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [clerkError, setClerkError] = useState("");
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");

  const signUpWithEmail = async ({
    emailAddress,
    password,
    firstName,
    lastName,
  }: {
    emailAddress: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    if (!isLoaded) {
      return;
    }

    try {
      const emailExists = await checkEmailWithDatabase(emailAddress);
      if (!emailExists) {
        setClerkError("Email not found in the database.");
        return;
      }

      const rootFolderAccessArray = emailExists.rootFolderAccess
        ? emailExists.rootFolderAccess.split(",").map((item: string) => item.trim())
        : [];

      await signUp.create({
        emailAddress,
        password,
        unsafeMetadata: {
          accessLevel: emailExists.accessLevel,
          rootFolderAccess: rootFolderAccessArray,
        },
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to our pending section.
      setVerifying(true);
    } catch (err: any) {
      if (err.errors && err.errors.length > 0) {
        setClerkError(err.errors[0].message);
      } else {
        setClerkError("An unexpected error occurred.");
      }
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      }
    } catch (err) {
      console.log("Error:", JSON.stringify(err, null, 2));
    }
  };

  return (
    <>
      {!verifying ? (
        <SignupForm signUpWithEmail={signUpWithEmail} clerkError={clerkError} />
      ) : (
        <VerifyForm handleVerify={handleVerify} code={code} setCode={setCode} />
      )}
    </>
  );
};

export default Signup;