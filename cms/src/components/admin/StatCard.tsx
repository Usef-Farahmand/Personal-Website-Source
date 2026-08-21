export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
        {value}
      </p>
    </div>
  );
}
