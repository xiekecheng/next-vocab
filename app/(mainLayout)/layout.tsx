import Navbar from "@/components/general/Navbar";
import React from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 px-6">
        {children}
      </div>
    </div>
  );
}
