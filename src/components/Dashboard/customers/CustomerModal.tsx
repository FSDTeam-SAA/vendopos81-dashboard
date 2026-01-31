"use client";

import {
  Dialog,
  DialogContent,

} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Calendar,
  Hash,
  MapPin,
  X,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { User } from "@/lib/types/users";
import { useDeleteUser, useSuspendUser } from "@/lib/hooks/useUsers";
import { Button } from "@/components/ui/button";

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
  const { mutate: suspendUser, isPending: isSuspending } = useSuspendUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  if (!data) return null;

  const handleSuspend = () => {
    console.log("user data", data);
    suspendUser(data._id, {
      onSuccess: () => onModalChange(false),
    });
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;
    deleteUser(data._id, {
      onSuccess: () => onModalChange(false),
    });
  };

  const initials = data.firstName.charAt(0) + data.lastName.charAt(0);

  return (
    <Dialog open={modalOpen} onOpenChange={onModalChange}>
      <DialogContent className="max-w-[720px] p-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Customer Details
            </h2>
            <p className="text-sm text-gray-500">
              Complete customer information and order history
            </p>
          </div>

          {/* <button
            onClick={() => onModalChange(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button> */}
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Customer Card */}
          <div className="border rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-lg">
                  {initials}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {data.firstName} {data.lastName}
                  </h3>

                  <Badge
                    className={`mt-1 ${
                      data.isSuspended
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {data.isSuspended ? "Suspended" : "Active"}
                  </Badge>
                </div>
              </div>

              {/* Customer ID */}
              <div className="text-right">
                <p className="text-sm text-gray-500">Customer ID</p>
                <p className="font-medium text-gray-900">
                  #{data._id.slice(-6)}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-4 h-4 text-gray-400" />
                {data.email}
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-4 h-4 text-gray-400" />
                Join Date:{" "}
                {new Date(data.createdAt).toLocaleDateString()}
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Hash className="w-4 h-4 text-gray-400" />
                Total Orders: {data.totalOrder}
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Hash className="w-4 h-4 text-gray-400" />
                Total Spent: ${data.totalSpent.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border rounded-xl p-5 flex items-start justify-between">
            {/* <div>
              <h4 className="flex items-center gap-2 font-medium text-gray-900">
                <MapPin className="w-5 h-5 text-emerald-600" />
                Shipping Address
              </h4>

              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                123 Main Street, Apt 4B <br />
                New York, NY 10001 <br />
                United States
              </p>
            </div> */}

            <div className="flex  gap-2">
              {!data.isSuspended && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleSuspend}
                  disabled={isSuspending || isDeleting}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Suspend
                </Button>
              )}
              
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDelete}
                disabled={isSuspending || isDeleting}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerModal;
