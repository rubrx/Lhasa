"use client";

import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#1c1c1a",
            border: "1px solid #e4e4e0",
            borderRadius: "0.75rem",
            fontSize: "0.875rem",
          },
        }}
      />
    </AuthProvider>
  );
}
