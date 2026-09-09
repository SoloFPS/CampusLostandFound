"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { loginSchema, type LoginInput } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginInput) => {
    try {
      await login(values);
      toast.success("Welcome back!");
      router.push("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-ink">
          Email
        </label>
        <div className="mt-1.5 flex items-center gap-2 rounded-md border border-line bg-paper px-3 focus-within:border-amber-deep">
          <Mail className="h-4 w-4 text-muted" aria-hidden="true" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@campus.edu"
            className="w-full bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-muted"
            {...register("email")}
          />
        </div>
        {errors.email && <p className="mt-1 text-xs text-lost">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-medium text-ink">
          Password
        </label>
        <div className="mt-1.5 flex items-center gap-2 rounded-md border border-line bg-paper px-3 focus-within:border-amber-deep">
          <Lock className="h-4 w-4 text-muted" aria-hidden="true" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-muted"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-muted hover:text-ink-soft"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-xs text-lost">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 flex items-center justify-center gap-2 rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink-soft disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Logging in...
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Log in
          </>
        )}
      </button>
    </form>
  );
}