"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { LoginInput, RegisterInput } from "@/lib/auth.ts";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthError extends Error {
  status?: number;
  code?: "invalid_credentials" | "duplicate_email" | "validation" | "server";
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function makeAuthError(message: string, status?: number, code?: AuthError["code"]) {
  const err = new Error(message) as AuthError;
  err.status = status;
  err.code = code;
  return err;
}

async function parseErrorMessage(res: Response, fallback: string) {
  try {
    const data = await res.json();
    return (data?.error as string) || (data?.message as string) || fallback;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // The token itself lives in an httpOnly cookie, invisible to JS — this
  // "whoami" call is how the client discovers whether that cookie is valid.
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    })();
  }, [refreshUser]);

  const login = useCallback(async (input: LoginInput) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(input),
    });

    if (res.status === 401) {
      throw makeAuthError(
        await parseErrorMessage(res, "Incorrect email or password."),
        401,
        "invalid_credentials"
      );
    }
    if (res.status === 400) {
      throw makeAuthError(
        await parseErrorMessage(res, "Check your details and try again."),
        400,
        "validation"
      );
    }
    if (!res.ok) {
      throw makeAuthError(
        await parseErrorMessage(res, "Something went wrong. Please try again."),
        res.status,
        "server"
      );
    }

    const data = await res.json();
    setUser(data.user);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const { confirmPassword, ...payload } = input;
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (res.status === 409) {
      throw makeAuthError(
        await parseErrorMessage(res, "An account with that email already exists."),
        409,
        "duplicate_email"
      );
    }
    if (res.status === 400) {
      throw makeAuthError(
        await parseErrorMessage(res, "Check your details and try again."),
        400,
        "validation"
      );
    }
    if (!res.ok) {
      throw makeAuthError(
        await parseErrorMessage(res, "Something went wrong. Please try again."),
        res.status,
        "server"
      );
    }

    const data = await res.json();
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}