"use client";

import { useWebSocket } from "@/lib/hooks/useWebSocket";
import {
  useAllNotifications,
  useMarkNotificationAsViewed,
} from "@/lib/hooks/useNotification";
import { Notification } from "@/lib/types/notification";
import { Bell, Package, Eye, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

const NotificationListener = () => {
  const { message: wsMessage } = useWebSocket();
  const { data: session } = useSession();
  const [page, setPage] = useState(1);

  // Get user ID from session or use fallback
  const userId = session?.user?.id || "";

  const { data, isLoading, isError, refetch } = useAllNotifications(userId);
  const { mutate: markAsViewed } = useMarkNotificationAsViewed();

  // Refetch when new WebSocket message arrives
  if (wsMessage) {
    refetch();
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "product":
        return <Package className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleMarkAsViewed = () => {
    markAsViewed();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500">
        <Bell className="w-12 h-12 mb-4" />
        <p>Error loading notifications</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const notifications: Notification[] = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8 text-lime-500" />
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        </div>
        {meta && (
          <div className="text-sm flex gap-4 items-center text-gray-500">
            {notifications.length > 0 &&  <Button onClick={()=>handleMarkAsViewed()} className="bg-[#086646] hover:bg-[#144836]">
              Read to Mark
            </Button>

            }
           
            <span>
              Total: {meta.total} notification{meta.total !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-50 rounded-xl">
          <Bell className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`relative p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
                notification.isViewed
                  ? "bg-white border-gray-200"
                  : "bg-lime-50 border-lime-200"
              }`}
            >
              {!notification.isViewed && (
                <span className="absolute top-4 right-4 w-3 h-3 bg-lime-500 rounded-full animate-pulse"></span>
              )}

              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-full ${
                    notification.isViewed ? "bg-gray-100" : "bg-lime-100"
                  }`}
                >
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1">
                  <p
                    className={`text-sm ${
                      notification.isViewed
                        ? "text-gray-600"
                        : "text-gray-800 font-medium"
                    }`}
                  >
                    {notification.message}
                  </p>

                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {formatDate(notification.createdAt)}
                    </div>

                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">
                      {notification.type}
                    </span>
{/* 
                    {notification.isViewed ? (
                      <span className="flex items-center gap-1 text-xs text-green-500">
                        <CheckCircle className="w-3 h-3" />
                        Viewed
                      </span>
                    ) : (
                      <button
                        onClick={() => }
                        className="flex items-center gap-1 text-xs text-lime-600 hover:text-lime-700 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        Mark as read
                      </button>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Previous
          </button>

          <span className="px-4 py-2 text-sm text-gray-600">
            Page {meta.page} of {meta.totalPage}
          </span>

          <button
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, meta.totalPage))
            }
            disabled={page === meta.totalPage}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationListener;
