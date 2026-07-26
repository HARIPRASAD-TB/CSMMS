import { Navbar } from "@/components/layout/Navbar";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
