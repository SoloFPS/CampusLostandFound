import Link from "next/link";
import { Radar } from "lucide-react";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col items-center text-center">
        <Radar className="h-8 w-8 text-amber-deep" aria-hidden="true" />
        <h1 className="mt-3 font-display text-2xl font-semibold text-ink">Create an account</h1>
        <p className="mt-1 text-sm text-muted">Join the campus lost &amp; found community.</p>
      </div>

      <div className="rounded-lg border border-line bg-paper-raised p-6">
        <RegisterForm />
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-amber-deep hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}