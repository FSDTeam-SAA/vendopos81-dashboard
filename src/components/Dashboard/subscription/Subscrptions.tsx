'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import SubscriptionsModal from './SubscriptionsModal';
import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '@/lib/services/subscriptionService';
import { format } from 'date-fns';
import { Loader2, Mail, CalendarDays, SendHorizonal } from 'lucide-react';
import Pagination from '../../shared/Pagination';

const Subscriptions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubscriberId, setSelectedSubscriberId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['subscriptions', currentPage, limit],
    queryFn: () => subscriptionService.getAll(currentPage, limit),
  });

  const handleOpenModal = (id: string | null = null) => {
    setSelectedSubscriberId(id);
    setIsModalOpen(true);
  };

  const subscribers = data?.data || [];
  const meta = data?.meta;

  // Pagination
  const totalPage = meta?.totalPage || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Subscribers</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage newsletter subscribers and send email campaigns.
            </p>
          </div>

          <Button
            onClick={() => handleOpenModal(null)}
            className="h-10 px-5 bg-[#086646] hover:bg-[#06543a] text-white rounded-lg"
          >
            <SendHorizonal className="w-4 h-4 mr-2" />
            Send Bulk Email
          </Button>
        </div>

        {/* Summary Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Subscribers</p>

                <h2 className="text-3xl font-semibold text-gray-900 mt-2">
                  {meta?.total || subscribers.length || 0}
                </h2>
              </div>

              <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
                <Mail className="w-5 h-5 text-gray-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email Address
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Subscribed Date
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="py-16">
                      <div className="flex items-center justify-center gap-3 text-gray-500">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Loading subscribers...</span>
                      </div>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={3} className="py-16 text-center">
                      <p className="text-sm font-medium text-red-500">
                        Failed to load subscribers. Please try again.
                      </p>
                    </td>
                  </tr>
                ) : subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-16 text-center">
                      <p className="text-sm text-gray-500">No subscribers found.</p>
                    </td>
                  </tr>
                ) : (
                  subscribers.map((subscriber) => (
                    <tr key={subscriber._id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Email */}
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4 text-gray-600" />
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-900">{subscriber.email}</p>

                            <p className="text-xs text-gray-500 mt-1">Newsletter Subscriber</p>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CalendarDays className="w-4 h-4 text-gray-400" />

                          {format(new Date(subscriber.createdAt), 'PPP')}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-5 text-right">
                        <Button
                          onClick={() => handleOpenModal(subscriber._id)}
                          size="sm"
                          className="h-9 px-4 rounded-lg bg-[#086646] hover:bg-[#06543a] text-white"
                        >
                          Send Email
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && !isError && totalPage > 1 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200">
          <SubscriptionsModal
            onClose={() => setIsModalOpen(false)}
            subscriberId={selectedSubscriberId}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Subscriptions;
