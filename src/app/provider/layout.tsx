import { Navbar } from "@/components/layout/Navbar";
import { ProviderShell } from "@/components/provider/ProviderShell";

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <ProviderShell>{children}</ProviderShell>
    </div>
  );
}
