"use client";

import { MessageCircle } from "lucide-react";

interface ContactPosterProps {
  posterName: string;
}

// TODO: no contact channel exists yet — the Item model only stores
// postedBy.{id, name}, no email/phone. Once a real contact mechanism
// exists (in-app messaging, or storing a contact email on the user),
// wire this button up for real. For now it's a disabled placeholder
// so the UI doesn't imply a feature that isn't built.
export default function ContactPoster({ posterName }: ContactPosterProps) {
  return (
    <button
      disabled
      title="Direct contact isn't available yet"
      className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper opacity-50"
    >
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      Contact {posterName.split(" ")[0]} (coming soon)
    </button>
  );
}