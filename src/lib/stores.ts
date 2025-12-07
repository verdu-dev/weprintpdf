import type { CalendarOptions } from "@/lib/types";
import { type Writable, writable } from "svelte/store";
import { CURRENT_YEAR } from "@/lib/consts";
import { DocOrientation, DocSize } from "@/lib/enums";

export const bloburi: Writable<string> = writable("");

export const calendarOptions: Writable<CalendarOptions> = writable({
  year: CURRENT_YEAR,
  size: DocSize.A4,
  orientation: DocOrientation.PORTRAIT,
  sundays: true,
  multipage: true,
  cover: true,
  holidays: true,
  labelHolidays: false,
  images: []
});