import type { CalendarOptions } from "@/lib/types";
import { type Writable, writable } from "svelte/store";
import { CURRENT_YEAR } from "@/lib/consts";
import { DocOrientation, DocSize } from "@/lib/enums";

export const bloburi: Writable<string> = writable("");

export const calendarOptions: Writable<CalendarOptions> = writable({
  year: CURRENT_YEAR,
  size: DocSize.A4,
  orientation: DocOrientation.LANDSCAPE,
  grid: "4,3",
  sundays: true,
  dayBox: false,
  textSize: "m",
  image: null,
  multipage: false,
  holydays: false,
  saints: false
})