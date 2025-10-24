import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { SessionProvider, useSession } from "./session-provider";
import { User } from "@supabase/supabase-js";

// Mock the supabase client
vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => ({
    auth: {
      onAuthStateChange: vi.fn(() => ({
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      })),
    },
  })),
}));

// Create a test component that uses the session
const TestComponent = () => {
  const { user, isLoading } = useSession();
  return (
    <div>
      <div data-testid="user">{user?.email || "no-user"}</div>
      <div data-testid="loading">{isLoading ? "loading" : "loaded"}</div>
    </div>
  );
};

describe("SessionProvider", () => {
  beforeEach(() => {
    // Reset module mocks between tests
    vi.resetAllMocks();
  });

  it("provides initial session state from server", () => {
    const mockUser: User = {
      id: "test-id",
      email: "test@example.com",
      user_metadata: {},
      app_metadata: {},
      aud: "authenticated",
      confirmation_sent_at: undefined,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
      last_sign_in_at: undefined,
      role: "authenticated",
    };

    render(
      <SessionProvider serverSession={mockUser}>
        <TestComponent />
      </SessionProvider>
    );

    expect(screen.getByTestId("user")).toHaveTextContent("test@example.com");
    expect(screen.getByTestId("loading")).toHaveTextContent("loaded");
  });

  it("provides undefined user when no server session", () => {
    render(
      <SessionProvider serverSession={undefined}>
        <TestComponent />
      </SessionProvider>
    );

    expect(screen.getByTestId("user")).toHaveTextContent("no-user");
    expect(screen.getByTestId("loading")).toHaveTextContent("loading");
  });
});
