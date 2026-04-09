import { ToastProvider } from "@/components/ui/toast";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ToastProvider>{children}</ToastProvider>;
}
