import type { LayoutLoad } from './$types';
import { calendarOptions } from '@/lib/stores';
import { error } from '@sveltejs/kit';

export const load: LayoutLoad = async ({ params }) => {
  const { year } = params;

  if (!year) return;

  const isYear = /^([0-9]){1,4}$/.test(year ?? '');
  if (!isYear) error(404, 'El año no es válido');

  calendarOptions.update((opts) => ({ ...opts, year }));
  return { year };
};