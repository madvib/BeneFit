"use client";

import { useState } from "react";
import Button from "@/presentation/ui/Button/button";
import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/(auth)/actions";

interface LogoutButtonProperties {
  variant?: "default" | "ghost";
  className?: string;
  onItemClick?: () => void;
}

export function LogoutButton({
  variant = "default",
  className,
  onItemClick,
}: LogoutButtonProperties) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOutAction();
      // Redirect after successful logout
      globalThis.location.href = "/";
      if (onItemClick) {
        onItemClick();
      }
    } catch (error) {
      console.error("Error signing out:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignOut}
      disabled={isLoading}
      className={`${variant === "ghost" ? "btn-ghost" : ""} ${variant === "default" ? "w-full" : ""} ${className || ""}`}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
          Signing out...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <LogOut data-testid="logout-icon" className="h-4 w-4" />
          Logout
        </span>
      )}
    </Button>
  );
}
