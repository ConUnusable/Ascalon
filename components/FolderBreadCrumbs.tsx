import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FolderBreadcrumbs({ currentPath }: { currentPath: any }) {
    if (!Array.isArray(currentPath) || currentPath.length === 0 || currentPath[0]?.folderId === "0") {
        return ( <div className="breadcrumbs">
            <Button className="w-full lg:w-auto justify-between font-normal bg-transparent hover:bg-black hover:bg-opacity-10 border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-black focus:bg-white/30 transtion">
                <Link href={`/`}>Home</Link>
            </Button>
        </div>);
    }

    return (
        <div className="breadcrumbs">
            <Button className="w-full lg:w-auto justify-between font-normal bg-transparent hover:bg-black hover:bg-opacity-10 border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-black focus:bg-white/30 transtion">
                <Link href={`/`}>Home</Link>
            </Button>
            {currentPath.map((paths: any, index: number) => {
                const isLast = index === currentPath.length - 1;
                return (
                    <React.Fragment key={paths.folderId}>
                        <div className="breadcrumb-separator">/</div>
                        {isLast ? (
                            <span className="w-full lg:w-auto justify-between bg-transparent border-none outline-none text-black font-semibold" style={{paddingLeft: "10px"}}>{paths.folder}</span>
                        ) : (
                            <Button className="w-full lg:w-auto justify-between font-normal bg-transparent hover:bg-black hover:bg-opacity-10 border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-black focus:bg-white/30 transtion">
                                <Link href={`/folder/${paths.folderId}`}>
                                    {paths.folder}
                                </Link>
                            </Button>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}