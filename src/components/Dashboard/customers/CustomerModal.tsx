'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useGetSingleCustomerData, useSuspendCustomer } from '@/lib/hooks/useUsers';
import { User } from '@/lib/types/users';
import { AlertTriangle, Calendar, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

interface CustomerModalProps {
  modalOpen: boolean;
  onModalChange: (open: boolean) => void;
  data: User | null;
}

const CustomerModal = ({ modalOpen, onModalChange, data }: CustomerModalProps) => {
  const { mutate: suspendCustomer, isPending: isSuspending } = useSuspendCustomer();

  const customerId = data?._id;
  const { data: customerResponse } = useGetSingleCustomerData(customerId);

  if (!data) return null;

  const customer = customerResponse?.data || data;
  const initials = (customer.firstName?.charAt(0) || '') + (customer.lastName?.charAt(0) || '');

  const handleSuspend = () => {
    suspendCustomer(customer._id);
  };

  return (
    <Dialog open={modalOpen} onOpenChange={onModalChange}>
      <DialogContent className="max-w-[720px] overflow-hidden rounded-2xl bg-white p-0 shadow-xl">
        {/* Header */}
        <div className="px-7 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Customer Details</h2>
              <p className="mt-1 text-sm text-gray-500">Account information overview</p>
            </div>

            <Badge
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all border backdrop-blur-md shadow-sm ${
                customer.isSuspended
                  ? 'border-red-200/60 bg-red-50/70 text-red-700 shadow-red-100/40'
                  : 'border-emerald-200/60 bg-emerald-50/70 text-emerald-700 shadow-emerald-100/40'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    customer.isSuspended ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                />
                {customer.isSuspended ? 'Suspended' : 'Active'}
              </span>
            </Badge>
          </div>

          {/* Profile */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                {customer?.image?.url ? (
                  <Image src={customer.image.url} alt="Customer" fill className="object-cover" />
                ) : (
                  <span className="text-sm font-semibold text-gray-700 uppercase">{initials}</span>
                )}
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  {customer.firstName} {customer.lastName}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck className="h-4 w-4" />
                  Customer Account
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs font-medium text-gray-400 tracking-wide uppercase">
                Customer ID
              </p>

              <div className="mt-1 inline-flex items-center gap-2 rounded-md border border-green-200 bg-white px-3 py-1.5">
                <span className="font-mono text-sm font-medium text-gray-900">
                  #{customer._id?.slice(-6)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-7 pb-6 space-y-5">
          {/* Email */}
          {/* Email */}
          <div className="flex items-start gap-3">
            <Mail className="h-4 w-4 text-gray-400 mt-1" />

            <div className="w-full">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Email</p>

              <div className="mt-1 rounded-lg px-3 py-2">
                <p className="text-sm font-medium text-gray-900 break-all">
                  {customer.email || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3">
            <Phone className="h-4 w-4 text-gray-400 mt-1" />

            <div className="w-full">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Phone</p>

              <div className="mt-1 rounded-lg px-3 py-2">
                <p className="text-sm font-medium text-gray-900">
                  {customer.phone || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Join Date */}
          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-gray-400 mt-1" />

            <div className="w-full">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Joined</p>

              <div className="mt-1 inline-flex items-center rounded-lg px-3 py-1.5">
                <p className="text-sm font-medium text-gray-900">
                  {customer?.createdAt
                    ? new Date(customer.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Not available'}
                </p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-gray-400 mt-1" />

            <div className="w-full">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Address</p>

              <div className="mt-1 rounded-lg px-3 py-2 space-y-1">
                <p className="text-sm font-medium text-gray-900">
                  {customer.street || 'Not provided'}
                </p>

                {customer.location && <p className="text-sm text-gray-600">{customer.location}</p>}

                {customer.postalCode && (
                  <p className="text-sm text-gray-600 font-mono">{customer.postalCode}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="pt-4 flex justify-end">
            {customer.isSuspended ? (
              <Button
                size="sm"
                onClick={handleSuspend}
                disabled={isSuspending}
                className="h-10 rounded-xl bg-emerald-600 px-5 text-white hover:bg-emerald-700"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Unsuspend
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleSuspend}
                disabled={isSuspending}
                className="h-10 rounded-sm bg-red-500 px-5 text-white hover:bg-red-600"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Suspend
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerModal;
