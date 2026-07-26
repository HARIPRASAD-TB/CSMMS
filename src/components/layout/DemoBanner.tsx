import { isDemoMode } from "@/lib/paths";
import { DEMO_PASSWORD } from "@/lib/demo/handler";

export function DemoBanner() {
  if (!isDemoMode) return null;

  return (
    <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-200">
      GitHub Pages demo mode — login with{" "}
      <strong>user@buildconnect.com</strong> / <strong>{DEMO_PASSWORD}</strong>{" "}
      (also admin, worker, contractor, vendor @buildconnect.com). API data is simulated.
    </div>
  );
}
