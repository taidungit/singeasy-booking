import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { AuthProvider, useAuth, type User } from "@/context/AuthContext";

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

const mockUser: User = {
  id: "1",
  name: "Test User",
  email: "test@example.com",
  role: "USER",
};

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("restores user from localStorage on mount", async () => {
    localStorage.setItem("user", JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    expect(result.current.state.user).toEqual(mockUser);
    expect(result.current.state.isAuthenticated).toBe(true);
  });

  it("clears session on logout", async () => {
    localStorage.setItem("user", JSON.stringify(mockUser));
    localStorage.setItem("access_token", "token");

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.state.isAuthenticated).toBe(true);
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.state.user).toBeNull();
    expect(result.current.state.isAuthenticated).toBe(false);
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("access_token")).toBeNull();
  });

  it("updates user and persists to localStorage", async () => {
    localStorage.setItem("user", JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.state.user).not.toBeNull();
    });

    const updated = { ...mockUser, name: "Updated Name" };

    act(() => {
      result.current.updateUser(updated);
    });

    expect(result.current.state.user?.name).toBe("Updated Name");
    expect(JSON.parse(localStorage.getItem("user")!)).toEqual(updated);
  });
});
