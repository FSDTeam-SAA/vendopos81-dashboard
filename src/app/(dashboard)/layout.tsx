"use client";

import Header from "@/components/Dashboard/shared/Header";
import Sidebar from "@/components/Dashboard/shared/Sidebar";
import React, { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative bg-[#FCFBF8]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="sticky top-0 z-20">
          <Header />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 w-full overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
