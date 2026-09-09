"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { User, Mail, Lock, Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { registerSchema, type RegisterInput } from "@/lib/auth.ts";

export default function RegisterForm() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: RegisterInput) => {
    try {
      await registerUser(values);
      toast.success("Account created — welcome!");
      router.push("/");
    } catch (err) {
      const anyErr = err as { message?: string; code?: string };
      if (anyErr.code === "duplicate_email") {
        setError("email", { message: anyErr.message ?? "That email is already registered." });
        toast.error(anyErr.message ?? "That email is already registered.");
        return;
      }
      toast.error(anyErr.message ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="name" className="text-sm font-medium text-ink">
          Full name
        </label>
        <div className="mt-1.5 flex items-center gap-2 rounded-md border border-line bg-paper px-3 focus-within:border-amber-deep">
          <User className="h-4 w-4 text-muted" aria-hidden="true" />
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Aditi Rao"
            className="w-full bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-muted"
            {...register("name")}
          />
        </div>
        {errors.name && <p className="mt-1 text-xs text-lost">{errors.name.message}</p>}
      </div>

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
            autoComplete="new-password"
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

      <div>
        <label htmlFor="confirmPassword" className="text-sm font-medium text-ink">
          Confirm password
        </label>
        <div className="mt-1.5 flex items-center gap-2 rounded-md border border-line bg-paper px-3 focus-within:border-amber-deep">
          <Lock className="h-4 w-4 text-muted" aria-hidden="true" />
          <input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-muted"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="text-muted hover:text-ink-soft"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-lost">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 flex items-center justify-center gap-2 rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink-soft disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Creating account...
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Create account
          </>
        )}
      </button>
    </form>
  );
}