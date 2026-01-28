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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, LogOut, Menu, X, Clock, Package, CreditCard, CheckCircle, AlertCircle, Info } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import HeaderTitle from "../ReusableComponents/HeaderTitle";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAllNotifications } from "@/lib/hooks/useNotification";
import { Notification } from "@/lib/types/notification";

// Helper function to get notification icon based on type
const getNotificationIcon = (type: string) => {
  switch (type) {
    case "order":
      return <Package className="w-4 h-4" />;
    case "payment":
      return <CreditCard className="w-4 h-4" />;
    case "success":
      return <CheckCircle className="w-4 h-4" />;
    case "warning":
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Info className="w-4 h-4" />;
  }
};

// Helper function to get notification color based on type
const getNotificationColor = (type: string) => {
  switch (type) {
    case "order":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "payment":
      return "bg-[#086646]/10 text-[#086646] border-[#086646]/30";
    case "success":
      return "bg-[#086646]/10 text-[#086646] border-[#086646]/30";
    case "warning":
      return "bg-yellow-50 text-yellow-600 border-yellow-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

// Helper function to format time ago
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

export default function DashboardHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const pathname = usePathname();
  const userId = session?.user?.id || '';
  const { data } = useAllNotifications(userId);
  
  const notifications: Notification[] = data?.data || [];
  const unreadCount = notifications.filter(n => !n.isViewed).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  console.log("pathname", pathname);

  const routeConfig: Record<string, { title: string; subtitle: string }> = {
    "/dashboard": {
      title: "Dashboard Overview",
      subtitle: "Welcome back, Admin",
    },
    "/orders": {
      title: "Orders Management",
      subtitle: "Welcome back, Admin",
    },
    "/products": {
      title: "Products Management",
      subtitle: "Welcome back, Admin",
    },
    "/customers": {
      title: "Customers Management",
      subtitle: "Welcome back, Admin",
    },
    "/reports": {
      title: "Reports & Analytics",
      subtitle: "Welcome back, Admin",
    },
    "/payments": {
      title: "Payments Overview",
      subtitle: "Welcome back, Admin",
    },
    "/profile": {
      title: "Profile",
      subtitle: "Welcome back, Admin",
    },
    "/review": {
      title: "Reviews Management",
      subtitle: "Welcome back, Admin",
    },
    "/subscription": {
      title: "Subscription Plans",
      subtitle: "Welcome back, Admin",
    },
    "/suppliers": {
      title: "Supplier Management",
      subtitle: "Welcome back, Admin",
    },
    "/categories": {
      title: "Categories Management",
      subtitle: "Welcome back, Admin",
    },
  };

  const currentHeader = routeConfig[pathname] || routeConfig["/dashboard"];
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
          title={currentHeader.title}
          subtitle={currentHeader.subtitle}
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <div className=" relative">
         {/* Notification Bell */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <Bell className="w-6 h-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3" style={{ background: 'linear-gradient(to right, #086646, #0a7a54)' }}>
              <h3 className="text-white font-semibold">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <Bell className="w-10 h-10 mb-2" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !notification.isViewed ? "bg-[#086646]/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full border ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug ${!notification.isViewed ? "font-medium text-gray-800" : "text-gray-600"}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${getNotificationColor(notification.type)}`}>
                            {notification.type}
                          </span>
                        </div>
                      </div>
                      {!notification.isViewed && (
                        <span className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ backgroundColor: '#086646' }}></span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <Link
              href="/notifications"
              className="block text-center py-3 text-sm font-medium hover:bg-[#086646]/5 transition-colors"
              style={{ color: '#086646' }}
              onClick={() => setIsOpen(false)}
            >
              View all notifications
            </Link>
          </div>
        )}
      </div>
        </div>
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
