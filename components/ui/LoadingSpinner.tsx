import { LoaderCircle } from "lucide-react";

interface LoadingSpinnerProps {
  label?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-9 w-9",
};

export default function LoadingSpinner({
  label = "Loading...",
  size = "md",
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-2 py-10 text-muted"
    >
      <LoaderCircle className={`${sizeMap[size]} animate-spin`} aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}