import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider, ToastViewport } from "../components/ui/toast";
import { ThemeProvider } from "../components/theme-provider";
import { ToastContainer } from "@/components/ui/toastContainer";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ExcaliSketch ",
  description: "Collaborative Whiteboarding Reimagined",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
