export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border border-dashed border-border bg-paper px-6 py-12 text-center">
      <p className="font-heading text-lg font-semibold text-navy">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate">{description}</p>
    </div>
  );
}
