'use client';

import { useEffect, useState } from 'react';
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import { useAllNotifications, useMarkNotificationAsViewed } from '@/lib/hooks/useNotification';
import { Notification } from '@/lib/types/notification';
import { Bell, Package, Clock3, RefreshCw, CheckCheck } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Pagination from '../../shared/Pagination';

const NotificationListener = () => {
  const { message: wsMessage } = useWebSocket();
  const { data: session } = useSession();

  const [page, setPage] = useState(1);

  const userId = session?.user?.id || '';

  const { data, isLoading, isError, refetch } = useAllNotifications(userId);

  const { mutate: markAsViewed, isPending: isMarking } = useMarkNotificationAsViewed();

  // Refetch when new WebSocket message arrives
  useEffect(() => {
    if (wsMessage) {
      refetch();
    }
  }, [wsMessage, refetch]);

  const notifications: Notification[] = data?.data || [];
  const meta = data?.meta;

  const unreadCount = notifications.filter((item) => !item.isViewed).length;

  const getNotificationIcon = (type: string, isViewed: boolean) => {
    switch (type) {
      case 'product':
        return (
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
              isViewed ? 'border-gray-200 bg-gray-50' : 'border-emerald-100 bg-emerald-50'
            }`}
          >
            <Package className={`h-5 w-5 ${isViewed ? 'text-gray-500' : 'text-[#086646]'}`} />
          </div>
        );

      default:
        return (
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
              isViewed ? 'border-gray-200 bg-gray-50' : 'border-emerald-100 bg-emerald-50'
            }`}
          >
            <Bell className={`h-5 w-5 ${isViewed ? 'text-gray-500' : 'text-[#086646]'}`} />
          </div>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleMarkAsViewed = () => {
    markAsViewed();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader />
          <p className="text-sm text-gray-500">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[450px] flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
          <Bell className="h-7 w-7 text-red-500" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900">Failed to load notifications</h3>

        <p className="mt-2 text-sm text-gray-500">
          Something went wrong while fetching notifications.
        </p>

        <Button onClick={() => refetch()} className="mt-5 bg-[#086646] hover:bg-[#06543a]">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Stay updated with your latest activities and alerts.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Stats */}
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-sm font-semibold text-gray-900">{meta?.total || 0}</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2">
              <span className="text-sm text-[#086646]">Unread</span>
              <span className="text-sm font-semibold text-[#086646]">{unreadCount}</span>
            </div>

            {notifications.length > 0 && (
              <Button
                onClick={handleMarkAsViewed}
                disabled={isMarking}
                className="h-10 rounded-xl bg-[#086646] px-5 hover:bg-[#06543a]"
              >
                {isMarking ? (
                  <>
                    <Loader />
                    <span className="ml-2">Updating...</span>
                  </>
                ) : (
                  <>
                    <CheckCheck className="mr-2 h-4 w-4" />
                    Mark All as Read
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="overflow-hidden rounded-2xl">
          {notifications.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <Bell className="h-10 w-10 text-gray-400" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">No notifications yet</h3>

              <p className="mt-2 max-w-sm text-sm text-gray-500">
                When you receive notifications, they will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`group flex items-start gap-4 px-6 py-5 transition-colors ${
                    notification.isViewed
                      ? 'bg-white hover:bg-gray-50'
                      : 'bg-emerald-50/40 hover:bg-emerald-50/70'
                  }`}
                >
                  {/* Icon */}
                  {getNotificationIcon(notification.type, notification.isViewed)}

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <p
                          className={`text-sm leading-6 ${
                            notification.isViewed
                              ? 'font-normal text-gray-600'
                              : 'font-medium text-gray-900'
                          }`}
                        >
                          {notification.message}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Clock3 className="h-3.5 w-3.5" />
                            {formatDate(notification.createdAt)}
                          </div>

                          <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium capitalize text-gray-600">
                            {notification.type}
                          </span>
                        </div>
                      </div>

                      {/* Status */}
                      {!notification.isViewed && (
                        <div className="flex items-center gap-2 self-start rounded-full bg-emerald-100 px-3 py-1">
                          <span className="h-2 w-2 rounded-full bg-[#086646]" />
                          <span className="text-xs font-medium text-[#086646]">New</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta?.totalPage > 1 && (
          <div className="pt-2">
            <Pagination
              currentPage={page}
              totalPages={meta?.totalPage || 1}
              onPageChange={(page) => setPage(page)}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default NotificationListener;

/* Small Loader Component */
const Loader = () => (
  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#086646]" />
);
