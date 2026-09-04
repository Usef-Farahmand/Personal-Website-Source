import {
  Code2,
  Server,
  Smartphone,
  Gamepad2,
  Sparkles,
  Cloud,
  Terminal,
  Palette,
  Database,
  Wrench,
  Brush,
  Users,
  PenTool,
  type LucideIcon,
} from "lucide-react";
import type { SkillDomain } from "@/types/content";

/** Shared by SkillCard and SkillCategoryCard — a category's icon is a
 *  single authored choice, not something either component should
 *  maintain its own copy of. */
export const SKILL_DOMAIN_ICON: Record<SkillDomain, LucideIcon> = {
  frontend: Code2,
  backend: Server,
  mobile: Smartphone,
  game: Gamepad2,
  ai: Sparkles,
  cloud: Cloud,
  devops: Terminal,
  "ui-ux": Palette,
  art: Brush,
  management: Users,
  content: PenTool,
  database: Database,
  tools: Wrench,
};
