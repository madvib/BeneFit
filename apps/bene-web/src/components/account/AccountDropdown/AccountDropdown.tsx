"use client";
import { useState, useRef, useEffect } from "react";
import AccountDropdownContent from "../AccountDropdownContent/AccountDropdownContent";

interface AccountDropdownProps {
  isLoggedIn: boolean;
}

export default function AccountDropdown({ isLoggedIn }: AccountDropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="btn btn-ghost rounded-full p-2 flex items-center justify-center"
        aria-label="Account menu"
        aria-expanded={dropdownOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-secondary-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg z-50 border border-muted">
          <AccountDropdownContent
            onItemClick={() => setDropdownOpen(false)}
            showThemeToggle={true}
            showLogoutButton={true}
          />
        </div>
      )}
    </div>
  );
}
