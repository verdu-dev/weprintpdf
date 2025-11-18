import type { LayoutLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutLoad = async ({ params }) => {
  const { year } = params;
  if (!year) return;

  const isYear = /^(19|20)\d{2}$/.test(year ?? '');
  if (!isYear) error(404, 'El año no es válido');

  return { year };
};