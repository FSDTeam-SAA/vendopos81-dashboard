"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Calendar, User, Hash, CreditCard } from "lucide-react";
import { Order } from "@/lib/types/order";

interface CustomerModalProps {
  modalOpen: boolean;
  onModalChange: (open: boolean) => void;
  data: Order | null;
}

const CustomerModal = ({ modalOpen, onModalChange, data }: CustomerModalProps) => {
  if (!data) return null;

  return (
    <Dialog open={modalOpen} onOpenChange={onModalChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6 text-teal-600" />
            Customer Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <User className="w-4 h-4" /> Name
              </p>
              <p className="text-gray-900 font-semibold">
                {data.userId.firstName} {data.userId.lastName}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Hash className="w-4 h-4" /> Order ID
              </p>
              <p className="text-gray-900 font-semibold">{data.orderUniqueId}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="w-5 h-5 text-gray-400" />
              <span>{data.userId.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Phone className="w-5 h-5 text-gray-400" />
              <span>{data.billingInfo.phone || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span>
                {data.billingInfo.address}, {data.billingInfo.city}, {data.billingInfo.country}
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span>Order Date: {new Date(data.purchaseDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Payment Status</p>
              <Badge
                className={`capitalize ${
                  data.paymentStatus === "paid"
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                }`}
              >
                {data.paymentStatus}
              </Badge>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-sm font-medium text-gray-500 flex items-center justify-end gap-2">
                <CreditCard className="w-4 h-4" /> Total Spent
              </p>
              <p className="text-lg font-bold text-gray-900">
                ${data.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerModal;