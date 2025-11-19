import type { DocOrientation, DocSize } from "@/lib/enums";

export interface Tool {
  createdAt: string;
  icon: string;
  name: string;
  description: string;
  category: string;
  slug: string;
}

export interface CalendarOptions {
  year: string,
  size: DocSize
  orientation: DocOrientation
}