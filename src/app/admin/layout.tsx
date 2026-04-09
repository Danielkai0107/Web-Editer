import { ToastProvider } from "@/components/ui/toast";

export const metadata = {
  title: "SiteForge Admin",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ToastProvider>{children}</ToastProvider>;
}
