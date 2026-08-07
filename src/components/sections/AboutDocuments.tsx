import { getTranslations } from "next-intl/server";
import { listAboutDocuments } from "@/services/content/documents.service";
import { AboutDocumentsGrid } from "@/components/sections/AboutDocumentsGrid";
import { DocumentCard } from "@/components/ui/DocumentCard";
import { formatMonthYear } from "@/lib/date";
import type { Locale } from "@/types/content";

export async function AboutDocuments({ locale }: { locale: Locale }) {
  const documents = listAboutDocuments(locale);
  const t = await getTranslations({ locale, namespace: "about.documents" });

  if (documents.length === 0) {
    return null;
  }

  return (
    <AboutDocumentsGrid>
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          versionLabel={doc.version}
          lastUpdatedLabel={
            doc.lastUpdatedDate
              ? t("lastUpdated", {
                  date: formatMonthYear(doc.lastUpdatedDate, locale),
                })
              : undefined
          }
          previewLabel={t("preview")}
          downloadLabel={t("download")}
        />
      ))}
    </AboutDocumentsGrid>
  );
}
