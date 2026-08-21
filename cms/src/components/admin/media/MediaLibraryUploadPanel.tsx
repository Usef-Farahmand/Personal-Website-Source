"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MediaUploader from "./MediaUploader";
import type { MediaType } from "@/lib/validation/shared";

const ALL_MEDIA_TYPES: MediaType[] = ["IMAGE", "VIDEO", "PDF"];

export default function MediaLibraryUploadPanel() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      >
        {isOpen ? "Cancel" : "+ Upload media"}
      </button>

      {isOpen ? (
        <MediaUploader
          allowedTypes={ALL_MEDIA_TYPES}
          onUploaded={() => {
            setIsOpen(false);
            // The grid below is server-rendered; a fresh fetch picks up
            // the item that was just uploaded without needing this
            // component to duplicate the list-query logic client-side.
            router.refresh();
          }}
        />
      ) : null}
    </div>
  );
}
