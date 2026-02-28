"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  useGetSingleCustomerData,
  useSuspendCustomer,
} from "@/lib/hooks/useUsers";
import { User } from "@/lib/types/users";
import { AlertTriangle, Calendar, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

interface CustomerModalProps {
  modalOpen: boolean;
  onModalChange: (open: boolean) => void;
  data: User | null;
}

const CustomerModal = ({
  modalOpen,
  onModalChange,
  data,
}: CustomerModalProps) => {
  const { mutate: suspendCustomer, isPending: isSuspending } = useSuspendCustomer();

  const customerId = data?._id;
  const { data: customerResponse } = useGetSingleCustomerData(customerId);

  if (!data) return null;

  const customer = customerResponse?.data || data;
  const initials = customer.firstName?.charAt(0) + customer.lastName?.charAt(0);

  // suspend handler with console.log
  const handleSuspend = () => {
    console.log("Suspending user ID:", customer._id);
    suspendCustomer(customer._id);
  };

  return (
    <Dialog open={modalOpen} onOpenChange={onModalChange}>
      <DialogContent className="max-w-[700px] p-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Customer Details</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="border rounded-xl p-5">
            <div className="flex justify-between items-start">
              <div className="flex gap-4 items-center">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden bg-green-100 flex items-center justify-center font-semibold text-gray-700">
                  {customer?.image?.url ? (
                    <Image
                      src={customer.image.url}
                      alt="Customer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {customer.firstName} {customer.lastName}
                  </h3>

                  <Badge
                    className={`mt-1 text-xs ${
                      customer.isSuspended
                        ? "bg-red-100 text-red-600"
                        : "bg-emerald-100 text-green-700"
                    }`}
                  >
                    {customer.isSuspended ? "Suspended" : "Active"}
                  </Badge>
                </div>
              </div>

              {/* ID */}
              <div className="text-right text-sm">
                <p className="text-gray-500">Customer ID</p>
                <p className="font-medium">#{customer._id.slice(-6)}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-y-5 gap-x-10 mt-6 text-sm">
              <div className="flex items-start gap-3 text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-sm text-gray-900">
                    {customer.email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-gray-600">
                <Phone className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-sm text-gray-900">
                    {customer?.phone || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Join Date</p>
                  <p className="text-sm text-gray-900">
                    {customer?.createdAt
                      ? new Date(customer.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border rounded-xl p-5 flex justify-between items-end">
            <div>
              <div className="flex items-center gap-1 font-medium text-gray-800">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Address
              </div>

              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                {customer.street || "Not provided"} <br />
                {customer.location || "Not provided"} <br />
                {customer.postalCode || "Not provided"}
              </p>
            </div>

            {customer.isSuspended ? (
              <Button
                size="sm"
                onClick={handleSuspend}
                disabled={isSuspending}
                className="bg-green-800 hover:bg-green-900 text-white"
              >
                <AlertTriangle className="w-4 h-4 mr-1" />
                Unsuspend
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleSuspend}
                disabled={isSuspending}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <AlertTriangle className="w-4 h-4 mr-1" />
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
