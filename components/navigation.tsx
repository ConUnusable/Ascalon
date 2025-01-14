"use client";

import { usePathname } from "next/navigation";

import { NavButton } from "@/components/nav-button";

const routes = [ 
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/report",
    label: "Generate Report",
  },
  {
    href: "/admin",
    label: "Admin",
  },
];

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center gap-x-2 overflow-x-hidden">
      {routes.map((route) => (
        <NavButton
          key={route.href}
          href={route.href}
          label={route.label}
          isActive={pathname === route.href}       
        />
      ))}
    </nav>

  );
};