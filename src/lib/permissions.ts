import type { UserRole } from "@/lib/auth";

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "worker":
    case "contractor":
      return "/provider/dashboard";
    case "vendor":
      return "/vendor/dashboard";
    default:
      return "/profile";
  }
}

export function canAccessRoute(role: UserRole | null, pathname: string): boolean {
  if (!role) return false;
  if (pathname.startsWith("/admin")) return role === "admin";
  if (pathname.startsWith("/provider"))
    return role === "worker" || role === "contractor";
  if (pathname.startsWith("/vendor")) return role === "vendor";
  if (pathname.startsWith("/bookings") || pathname.startsWith("/profile"))
    return true;
  return true;
}

export function canManageWorkers(role: UserRole | null): boolean {
  return role === "admin" || role === "worker";
}

export function canManageContractors(role: UserRole | null): boolean {
  return role === "admin" || role === "contractor";
}

export function canManageProducts(role: UserRole | null): boolean {
  return role === "admin" || role === "vendor";
}

export function canEditProvider(
  role: UserRole | null,
  userId: string,
  ownerUserId: string
): boolean {
  if (role === "admin") return true;
  if (role === "worker" || role === "contractor") return userId === ownerUserId;
  return false;
}

export function canEditProduct(
  role: UserRole | null,
  userId: string,
  vendorId: string
): boolean {
  if (role === "admin") return true;
  if (role === "vendor") return userId === vendorId;
  return false;
}
