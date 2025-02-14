import { ToastProvider, ToastViewport } from "../../components/ui/toast";
import { ThemeProvider } from "../../components/theme-provider";
import { ToastContainer } from "@/components/ui/toastContainer";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <ToastProvider>
        {children} <ToastContainer></ToastContainer>{" "}
        <ToastViewport></ToastViewport>
      </ToastProvider>
    </ThemeProvider>
  );
}
