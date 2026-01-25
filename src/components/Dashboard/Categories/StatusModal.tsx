"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "success" | "error";
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function StatusModal({
  isOpen,
  onClose,
  status,
  title,
  message,
  actionLabel = "Close",
  onAction,
}: StatusModalProps) {
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] text-center">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            {status === "success" ? (
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            ) : (
              <AlertCircle className="h-6 w-6 text-red-600" />
            )}
          </div>
          <DialogTitle className="text-xl text-center">{title}</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-gray-500 mb-4">{message}</div>
        <DialogFooter className="sm:justify-center">
          <Button
            onClick={handleAction}
            className={`w-full sm:w-auto min-w-[120px] ${
              status === "success"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
