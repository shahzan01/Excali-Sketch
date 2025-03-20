import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider, ToastViewport } from "../components/ui/toast";
import { ThemeProvider } from "../components/theme-provider";
import { ToastContainer } from "@/components/ui/toastContainer";

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
    <html lang="en" suppressHydrationWarning className="Dark">
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
