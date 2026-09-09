"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-lg border border-lost-bg bg-lost-bg px-6 py-10 text-center"
    >
      <AlertTriangle className="h-8 w-8 text-lost" aria-hidden="true" />
      <h3 className="font-display text-base font-medium text-lost">{title}</h3>
      <p className="max-w-sm text-sm text-lost/80">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 flex items-center gap-2 rounded-md border border-lost px-4 py-2 text-sm font-medium text-lost hover:bg-lost hover:text-paper"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}