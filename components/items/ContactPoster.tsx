"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MessageCircle, Copy, Check } from "lucide-react";

interface ContactPosterProps {
  posterName: string;
  email?: string;
  phone?: string;
}

export default function ContactPoster({
  posterName,
  email,
  phone,
}: ContactPosterProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState<"email" | "phone" | null>(null);

  const hasContactInfo = Boolean(email || phone);

  const handleCopy = async (
    value: string,
    field: "email" | "phone"
  ) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(field);

      toast.success(
        `${field === "email" ? "Email" : "Phone number"} copied`
      );

      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("Couldn't copy — try selecting it manually.");
    }
  };

  if (!hasContactInfo) {
    return (
      <p className="text-sm text-muted">
        No contact details were shared for this post.
      </p>
    );
  }

  if (!revealed) {
    return (
      <button
        onClick={() => setRevealed(true)}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink-soft"
      >
        <MessageCircle
          className="h-4 w-4"
          aria-hidden="true"
        />
        Contact {posterName.split(" ")[0]}
      </button>
    );
  }

  return (
    <div className="space-y-2 rounded-md border border-line bg-paper p-3">
      {email && (
        <div className="flex items-center justify-between gap-2">
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 truncate text-sm text-ink hover:underline"
          >
            <Mail
              className="h-4 w-4 flex-shrink-0 text-amber-deep"
              aria-hidden="true"
            />
            {email}
          </a>

          <button
            onClick={() => handleCopy(email, "email")}
            className="flex-shrink-0 text-ink-soft hover:text-ink"
            aria-label="Copy email"
          >
            {copied === "email" ? (
              <Check
                className="h-4 w-4 text-found"
                aria-hidden="true"
              />
            ) : (
              <Copy
                className="h-4 w-4"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      )}

      {phone && (
        <div className="flex items-center justify-between gap-2">
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-2 truncate text-sm text-ink hover:underline"
          >
            <Phone
              className="h-4 w-4 flex-shrink-0 text-amber-deep"
              aria-hidden="true"
            />
            {phone}
          </a>

          <button
            onClick={() => handleCopy(phone, "phone")}
            className="flex-shrink-0 text-ink-soft hover:text-ink"
            aria-label="Copy phone number"
          >
            {copied === "phone" ? (
              <Check
                className="h-4 w-4 text-found"
                aria-hidden="true"
              />
            ) : (
              <Copy
                className="h-4 w-4"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      )}
    </div>
  );
}