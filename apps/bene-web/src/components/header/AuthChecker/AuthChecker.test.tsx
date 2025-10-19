import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthChecker } from "./AuthChecker";
import { useSession } from "@/hooks/useSession";

// Mock the useSession hook
vi.mock("@/hooks/useSession", () => ({
  useSession: vi.fn(),
}));

describe("AuthChecker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children with logged-in state when user exists and is not loading", () => {
    vi.mocked(useSession).mockReturnValue({
      user: { id: "test-user", email: "test@example.com" },
      isLoading: false,
    });

    render(
      <AuthChecker>
        {({ isLoggedIn, isLoading, user }) => (
          <div data-testid="auth-state">
            <span data-testid="isLoggedIn">{String(isLoggedIn)}</span>
            <span data-testid="isLoading">{String(isLoading)}</span>
            <span data-testid="user-id">{user?.id}</span>
          </div>
        )}
      </AuthChecker>,
    );

    expect(screen.getByTestId("isLoggedIn")).toHaveTextContent("true");
    expect(screen.getByTestId("isLoading")).toHaveTextContent("false");
    expect(screen.getByTestId("user-id")).toHaveTextContent("test-user");
  });

  it("renders children with logged-out state when no user exists", () => {
    vi.mocked(useSession).mockReturnValue({
      user: null,
      isLoading: false,
    });

    render(
      <AuthChecker>
        {({ isLoggedIn, isLoading, user }) => (
          <div data-testid="auth-state">
            <span data-testid="isLoggedIn">{String(isLoggedIn)}</span>
            <span data-testid="isLoading">{String(isLoading)}</span>
            <span data-testid="user-id">{user?.id || "no-user"}</span>
          </div>
        )}
      </AuthChecker>,
    );

    expect(screen.getByTestId("isLoggedIn")).toHaveTextContent("false");
    expect(screen.getByTestId("isLoading")).toHaveTextContent("false");
    expect(screen.getByTestId("user-id")).toHaveTextContent("no-user");
  });

  it("renders children with loading state when loading", () => {
    vi.mocked(useSession).mockReturnValue({
      user: null,
      isLoading: true,
    });

    render(
      <AuthChecker>
        {({ isLoggedIn, isLoading }) => (
          <div data-testid="auth-state">
            <span data-testid="isLoggedIn">{String(isLoggedIn)}</span>
            <span data-testid="isLoading">{String(isLoading)}</span>
          </div>
        )}
      </AuthChecker>,
    );

    expect(screen.getByTestId("isLoggedIn")).toHaveTextContent("false");
    expect(screen.getByTestId("isLoading")).toHaveTextContent("true");
  });

  it("renders children with logged-out state when user exists but is still loading", () => {
    vi.mocked(useSession).mockReturnValue({
      user: { id: "test-user", email: "test@example.com" },
      isLoading: true,
    });

    render(
      <AuthChecker>
        {({ isLoggedIn, isLoading }) => (
          <div data-testid="auth-state">
            <span data-testid="isLoggedIn">{String(isLoggedIn)}</span>
            <span data-testid="isLoading">{String(isLoading)}</span>
          </div>
        )}
      </AuthChecker>,
    );

    // When loading, the user is considered not logged in yet
    expect(screen.getByTestId("isLoggedIn")).toHaveTextContent("false");
    expect(screen.getByTestId("isLoading")).toHaveTextContent("true");
  });

  it("passes user object to children when logged in", () => {
    const mockUser = {
      id: "123",
      email: "test@example.com",
      name: "Test User",
    };
    vi.mocked(useSession).mockReturnValue({
      user: mockUser,
      isLoading: false,
    });

    render(
      <AuthChecker>
        {({ user }) => (
          <div data-testid="user-info">
            <span data-testid="user-email">{user?.email}</span>
            <span data-testid="user-name">{user?.name}</span>
          </div>
        )}
      </AuthChecker>,
    );

    expect(screen.getByTestId("user-email")).toHaveTextContent(
      "test@example.com",
    );
    expect(screen.getByTestId("user-name")).toHaveTextContent("Test User");
  });
});
