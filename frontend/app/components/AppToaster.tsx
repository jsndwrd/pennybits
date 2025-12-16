"use client";

import { Toaster } from "sonner";

export default function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      theme="light"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "border bg-background text-foreground shadow-lg",
          title: "text-sm font-medium",
          description: "text-sm text-muted-foreground",
        },
      }}
    />
  );
}
