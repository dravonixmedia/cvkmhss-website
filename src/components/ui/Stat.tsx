import type { FactItem } from "@/types";

export function Stat({ value, label }: FactItem) {
  return (
    <div className="border-l-2 border-gold pl-5">
      <div className="font-heading text-4xl font-bold text-navy sm:text-5xl">{value}</div>
      <div className="mt-1.5 text-sm text-slate">{label}</div>
    </div>
  );
}
