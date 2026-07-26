const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  in_progress: "bg-purple-500/20 text-purple-400",
  processing: "bg-yellow-500/20 text-yellow-400",
  completed: "bg-green-500/20 text-green-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
  packed: "bg-blue-500/20 text-blue-400",
  shipped: "bg-indigo-500/20 text-indigo-400",
};

export function StatusBadge({ status }: { status: string }) {
  const label = status.replace(/_/g, " ");
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[status] || "bg-zinc-700 text-zinc-300"}`}
    >
      {label}
    </span>
  );
}
