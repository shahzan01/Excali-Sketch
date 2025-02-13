// ToastContainer.tsx
"use client";
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast";

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-0 right-0 p-4 space-y-2 z-50">
      {toasts.map((toastItem) => (
        <Toast
          key={toastItem.id}
          open={toastItem.open}
          onOpenChange={(open) => {
            // When the toast is closed via UI (e.g. clicking close), dismiss it.
            if (!open) {
              dismiss(toastItem.id);
            }
          }}
          variant={toastItem.variant}
        >
          {toastItem.title && <ToastTitle>{toastItem.title}</ToastTitle>}
          {toastItem.description && (
            <ToastDescription>{toastItem.description}</ToastDescription>
          )}
          <ToastClose />
        </Toast>
      ))}
    </div>
  );
}
