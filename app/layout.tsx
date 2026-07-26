import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Transit — Your healthcare moves with you",
  description:
    "Transit is an AI healthcare relocation agent that prepares medical history, destination care plans, and clinical handoffs before you move.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full antialiased">
        {children}
        <Toaster
          richColors
          position="top-center"
          toastOptions={{
            className: "border border-border bg-card shadow-[var(--shadow)]",
          }}
        />
      </body>
    </html>
  );
}
