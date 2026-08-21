const MESSAGES: Record<string, string> = {
  created: "Project created.",
  updated: "Project saved.",
  deleted: "Project deleted.",
};

export default function SuccessBanner({ success }: { success?: string }) {
  if (!success || !MESSAGES[success]) return null;

  return (
    <div
      role="status"
      className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"
    >
      {MESSAGES[success]}
    </div>
  );
}
