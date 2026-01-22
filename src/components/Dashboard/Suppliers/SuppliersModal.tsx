"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Calendar, Store, Tag } from "lucide-react";
import { Supplier } from "@/lib/types/supplier";

interface SuppliersModalProps {
  modalOpen: boolean;
  onModalChange: (open: boolean) => void;
  data: Supplier | null;
}

const SuppliersModal = ({ modalOpen, onModalChange, data }: SuppliersModalProps) => {
  if (!data) return null;

  return (
    <Dialog open={modalOpen} onOpenChange={onModalChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Store className="w-6 h-6 text-teal-600" />
            Supplier Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Store className="w-4 h-4" /> Shop Name
              </p>
              <p className="text-gray-900 font-semibold">{data.shopName || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Tag className="w-4 h-4" /> Brand Name
              </p>
              <p className="text-gray-900 font-semibold">{data.brandName || "N/A"}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="w-5 h-5 text-gray-400" />
              <span>{data.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Phone className="w-5 h-5 text-gray-400" />
              <span>{data.userId?.phone || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span>{data.location || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span>Joined: {new Date(data.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Badge
                variant={data.status === "approved" ? "secondary" : "destructive"}
                className={
                  data.status === "approved"
                    ? "bg-green-100 text-green-700 hover:bg-green-100 capitalize"
                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 capitalize"
                }
              >
                {data.status}
              </Badge>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-sm font-medium text-gray-500">Rating</p>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-gray-900">{data.rating}</span>
                <span className="text-yellow-400">★</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuppliersModal;