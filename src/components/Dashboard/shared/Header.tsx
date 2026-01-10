"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import HeaderTitle from "../ReusableComponents/HeaderTitle";

export default function DashboardHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { data: session } = useSession();

  const loading = false;

  const handleLogout = () => {
    signOut();
    setLogoutDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-4 p-5 bg-white rounded-md">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <header className="w-full h-[100px] bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
      {/* Left: Logo + Sidebar Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-md border hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>

        <HeaderTitle
          title="Dashboard Overview"
          subtitle="Welcome back, Admin"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 px-3 cursor-pointer"
            >
              <div className="text-left">
                <p className="text-sm font-medium">
                  {session?.user?.firstName} {session?.user?.lastName}
                </p>
                <p className="text-xs text-gray-600">{session?.user?.email}</p>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={session?.user?.image || "/images/profile-mini.jpg"}
                  alt="User"
                />
                <AvatarFallback>
                  {session?.user?.firstName?.charAt(0)}
                  {session?.user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {/* <Link href="/profile">
              <DropdownMenuItem>
                <User2Icon /> Profile
              </DropdownMenuItem>
            </Link>

            <Link href="/profile/changePassword">
              <DropdownMenuItem>
                <KeyIcon /> Change Password
              </DropdownMenuItem>
            </Link> */}

            <DropdownMenuItem
              className="text-[#e5102e] hover:bg-[#feecee] cursor-pointer"
              onClick={() => setLogoutDialogOpen(true)}
            >
              <LogOut /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Logout Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogTrigger asChild>
          <button style={{ display: "none" }}></button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
