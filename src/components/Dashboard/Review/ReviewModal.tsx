"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star, User, Calendar, MessageSquare, Package } from "lucide-react";
import { Review } from "@/lib/types/review";

interface ReviewsModalProps {
  modalOpen: boolean;
  onModalChange: (open: boolean) => void;
  data: Review | null;
}

const ReviewsModal = ({ modalOpen, onModalChange, data }: ReviewsModalProps) => {
  if (!data) return null;

  return (
    <Dialog open={modalOpen} onOpenChange={onModalChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 border-b pb-4">
            <MessageSquare className="w-6 h-6 text-teal-600" />
            Review Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Package className="w-4 h-4" /> Product ID
              </p>
              <p className="text-gray-900 font-semibold">{data.productId || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <User className="w-4 h-4" /> Reviewer
              </p>
              <p className="text-gray-900 font-semibold">
                {data.userId ? `${data.userId.firstName} ${data.userId.lastName}` : "Anonymous"}
              </p>
            </div>
          </div>

          <div className="space-y-1 bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500 mb-2">Comment</p>
            <p className="text-gray-700 italic">&quot;{data.comment}&quot;</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 text-gray-700">
               <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Date
              </p>
              <span>{new Date(data.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-sm font-medium text-gray-500">Rating</p>
              <div className="flex items-center gap-1 justify-end">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < data.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  data.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : data.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {data.status}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewsModal;