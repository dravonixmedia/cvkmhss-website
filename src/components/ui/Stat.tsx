import type { FactItem } from "@/types";

export function Stat({ value, label }: FactItem) {
  return (
    <div className="border-l-2 border-gold pl-4">
      <div className="font-heading text-3xl font-bold text-navy sm:text-4xl">{value}</div>
      <div className="mt-1 text-sm text-slate">{label}</div>
    </div>
  );
}
