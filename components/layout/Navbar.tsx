"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Radar, Menu, X, Plus, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/items", label: "Browse Items" },
  { href: "/items/new", label: "Report Item" },
  { href: "/my-posts", label: "My Posts" },
];

export default function Navbar() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = Boolean(user);

  const handleLogout = async () => {
    setMenuOpen(false);
    setMobileOpen(false);
    await logout();
    toast.success("Logged out.");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper-raised/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
          <Radar className="h-6 w-6 text-amber-deep" aria-hidden="true" />
          Campus Lost &amp; Found
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop auth area */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoading ? (
            <div className="h-8 w-20 animate-pulse rounded-full bg-paper" />
          ) : isLoggedIn && user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-sm font-medium text-ink hover:bg-paper"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-tint text-xs font-semibold text-amber-deep">
                  {user.name.charAt(0)}
                </span>
                {user.name}
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-44 overflow-hidden rounded-lg border border-line bg-paper-raised shadow-md"
                >
                  <Link
                    href="/my-posts"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-soft hover:bg-paper"
                  >
                    <User className="h-4 w-4" aria-hidden="true" />
                    My Posts
                  </Link>
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-lost hover:bg-lost-bg"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-ink-soft hover:text-ink"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink-soft"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="h-6 w-6 text-ink" />
          ) : (
            <Menu className="h-6 w-6 text-ink" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-line bg-paper-raised px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-md px-2 py-2.5 text-sm font-medium text-ink-soft hover:bg-paper"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
            {isLoading ? null : isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-md px-2 py-2.5 text-left text-sm font-medium text-lost"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-2 py-2.5 text-sm font-medium text-ink-soft hover:bg-paper"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-1 rounded-md bg-ink px-2 py-2.5 text-sm font-medium text-paper"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}