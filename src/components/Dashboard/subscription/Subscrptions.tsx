'use client'

'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import SubscriptionsModal from './SubscriptionsModal'
import { useQuery } from '@tanstack/react-query'
import { subscriptionService } from '@/lib/services/subscriptionService'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'

const Subscriptions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSubscriberId, setSelectedSubscriberId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, isError } = useQuery({
    queryKey: ['subscriptions', page, limit],
    queryFn: () => subscriptionService.getAll(page, limit),
  })

  const handleOpenModal = (id: string | null = null) => {
    setSelectedSubscriberId(id)
    setIsModalOpen(true)
  }

  const subscribers = data?.data || []
  const meta = data?.meta

  return (
    <div className="w-full bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Subscription</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your newsletter subscribers
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal(null)}
          className="bg-green-700 hover:bg-green-800 text-white"
        >
          Send Bulk Email
        </Button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Email Address
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Subscribed Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center">
                  <div className="flex justify-center items-center gap-2 text-gray-500">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading subscribers...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-red-500">
                  Failed to load subscribers. Please try again.
                </td>
              </tr>
            ) : subscribers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No subscribers found.
                </td>
              </tr>
            ) : (
              subscribers.map((subscriber) => (
                <tr
                  key={subscriber._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {subscriber.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {format(new Date(subscriber.createdAt), 'PPP')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <Button
                      onClick={() => handleOpenModal(subscriber._id)}
                      className="bg-green-700 hover:bg-green-800 text-white"
                      size="sm"
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

      {!isLoading && !isError && meta && meta.totalPage > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {meta.totalPage}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
            disabled={page === meta.totalPage}
          >
            Next
          </Button>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-full">
          <SubscriptionsModal 
            onClose={() => setIsModalOpen(false)} 
            subscriberId={selectedSubscriberId}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Subscriptions
