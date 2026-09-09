import Link from "next/link";
import { Radar } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper-raised">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-display text-base font-semibold text-ink">
              <Radar className="h-5 w-5 text-amber-deep" aria-hidden="true" />
              Campus Lost &amp; Found
            </div>
            <p className="mt-2 max-w-xs text-sm text-muted">
              Helping students and staff reconnect with the things they've
              misplaced, one post at a time.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-ink">Navigate</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/items" className="hover:text-ink">Browse items</Link></li>
              <li><Link href="/items/new" className="hover:text-ink">Report an item</Link></li>
              <li><Link href="/my-posts" className="hover:text-ink">My posts</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-ink">Account</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/login" className="hover:text-ink">Login</Link></li>
              <li><Link href="/register" className="hover:text-ink">Register</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-line pt-6 text-sm text-muted">
          © {new Date().getFullYear()} Campus Lost &amp; Found. Built for
          campus communities.
        </div>
      </div>
    </footer>
  );
}