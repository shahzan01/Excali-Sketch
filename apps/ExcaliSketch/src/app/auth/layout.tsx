import { ToastProvider, ToastViewport } from "../../components/ui/toast";
import { ToastContainer } from "@/components/ui/toastContainer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body>
        <ToastProvider>
          {children}
          <ToastContainer />
          <ToastViewport />
        </ToastProvider>
      </body>
    </html>
  );
}
