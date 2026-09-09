import Link from "next/link";
import { Radar } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col items-center text-center">
        <Radar className="h-8 w-8 text-amber-deep" aria-hidden="true" />
        <h1 className="mt-3 font-display text-2xl font-semibold text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">Log in to manage your lost &amp; found posts.</p>
      </div>

      <div className="rounded-lg border border-line bg-paper-raised p-6">
        <LoginForm />
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-amber-deep hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}