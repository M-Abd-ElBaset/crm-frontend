const styles: Record<string, string> = {
  prospect: "bg-yellow-900/40 text-yellow-300",
  active: "bg-green-900/40 text-green-300",
  inactive: "bg-gray-800 text-gray-400",
  lead: "bg-gray-800 text-gray-300",
  qualified: "bg-blue-900/40 text-blue-300",
  proposal: "bg-purple-900/40 text-purple-300",
  negotiation: "bg-orange-900/40 text-orange-300",
  won: "bg-green-900/40 text-green-300",
  lost: "bg-red-900/40 text-red-300",
};

export function Badge({ value }: { value: string }) {
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${styles[value] ?? "bg-gray-800 text-gray-300"}`}>
      {value.charAt(0).toUpperCase() + value.slice(1)}
    </span>
  );
}