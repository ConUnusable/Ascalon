"use client";
import { HeaderLogo } from "@/components/header-Logo";
import { Navigation } from "@/components/navigation";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export const Header = () => {
    const { user } = useUser();
    const accessLevel = user?.unsafeMetadata.accessLevel;

    return (
      <header className="bg-black bg-opacity-95 px-4 py-4">
        <div className=" mx-auto flex items-center justify-between">
          <div className="flex items-center gap-x-16">
            <HeaderLogo />
            {accessLevel === 0 && <Navigation />}
          </div>
          <div className="flex items-center">
            <ClerkLoaded>
                <UserButton />
            </ClerkLoaded>
            <ClerkLoading>
              <Loader2 className="size-8 animate-spin text-slate-400" />
            </ClerkLoading>
          </div>
        </div>
      </header>
    );
};