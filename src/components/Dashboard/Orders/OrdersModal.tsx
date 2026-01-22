"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Package, ShoppingCart, CreditCard, MapPin } from "lucide-react";
import { Order } from "@/lib/types/order";

interface OrderModalProps {
  modalOpen: boolean;
  onModalChange: (open: boolean) => void;
  data: Order | null;
}

const OrdersModal = ({ modalOpen, onModalChange, data }: OrderModalProps) => {
  if (!data) return null;

  return (
    <Dialog open={modalOpen} onOpenChange={onModalChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto text-black">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 border-b pb-4">
            <ShoppingCart className="w-6 h-6 text-teal-600" />
            Order Details: #{data.orderUniqueId}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Order Status & Summary */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Order Date
              </p>
              <p className="text-gray-900 font-semibold">
                {new Date(data.purchaseDate).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Badge
                className={`capitalize ${
                  data.orderStatus === "delivered"
                    ? "bg-green-100 text-green-700"
                    : data.orderStatus === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {data.orderStatus}
              </Badge>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-3">
             <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" /> Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm pl-7">
              <div>
                <p className="font-medium text-gray-900">
                  {data.userId.firstName} {data.userId.lastName}
                </p>
                <p className="text-gray-500">{data.userId.email}</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-gray-900 flex items-center gap-1">
                   <MapPin className="w-3 h-3" /> {data.billingInfo.city}, {data.billingInfo.country}
                </p>
                <p className="text-gray-500">{data.billingInfo.address}</p>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
              <Package className="w-5 h-5 text-gray-400" /> Ordered Items
            </h3>
            <div className="space-y-3">
              {data.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.product.images[0]?.url} 
                      alt={item.product.title} 
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{item.product.title}</p>
                      <p className="text-gray-500">Qty: {item.quantity} x ${item.unitPrice.toFixed(2)}</p>
                      {item.variant && <p className="text-xs text-teal-600">Variant: {item.variant.label}</p>}
                    </div>
                  </div>
                  <p className="font-bold text-gray-900">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          <div className="pt-4 border-t space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-600">
                <CreditCard className="w-5 h-5" />
                <span>Payment: <span className="font-medium capitalize">{data.paymentType}</span></span>
              </div>
              <Badge
                variant="outline"
                className={`capitalize ${
                  data.paymentStatus === "paid" ? "border-green-200 text-green-700" : "border-yellow-200 text-yellow-700"
                }`}
              >
                {data.paymentStatus}
              </Badge>
            </div>
            <div className="flex justify-between items-center text-xl font-bold">
              <span className="text-gray-900 uppercase">Total Amount</span>
              <span className="text-teal-700">${data.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrdersModal;