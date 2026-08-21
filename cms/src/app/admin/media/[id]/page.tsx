import Link from "next/link";
import { notFound } from "next/navigation";
import { getMediaById, getMediaUsage } from "@/lib/queries/media";
import MediaDetailView from "@/components/admin/media/MediaDetailView";

export const metadata = { title: "Media details" };

export default async function AdminMediaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const media = await getMediaById(id);
  if (!media) notFound();

  const usage = await getMediaUsage(id);

  return (
    <div className="space-y-4">
      <Link
        href="/admin/media"
        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        ← Back to Media Library
      </Link>
      <MediaDetailView media={media} usage={usage} />
    </div>
  );
}
