import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Transit · Health passport for care across borders",
  description:
    "Transit is your health passport when you move countries: corridor-aware care continuity, clinic-ready records, and handoffs prepared before you land.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
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
