import { contactContent } from "@/content/contact";
import { resolveTranslation } from "./shared";
import type { Locale } from "@/types/content";
import type { ResolvedContactContent } from "@/types/contact";

export function getContactContent(locale: Locale): ResolvedContactContent {
  return resolveTranslation(contactContent, locale) as ResolvedContactContent;
}
