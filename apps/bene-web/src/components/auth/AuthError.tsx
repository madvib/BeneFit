"use client";

import { AlertCircle } from "lucide-react";

interface AuthErrorProps {
  message: string;
}

export function AuthError({ message }: AuthErrorProps) {
  if (!message) return null;

  return (
    <div
      data-testid="auth-error-container"
      className="bg-error/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-error"
    >
      <AlertCircle data-testid="alert-icon" className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
}
