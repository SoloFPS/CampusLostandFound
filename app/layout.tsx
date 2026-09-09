import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import { Space_Grotesk, Inter } from "next/font/google";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Campus Lost & Found",
  description:
    "Report and find lost items across campus — post, search, and reconnect items with their owners.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "var(--color-paper-raised)",
                color: "var(--color-ink)",
                border: "1px solid var(--color-line)",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
