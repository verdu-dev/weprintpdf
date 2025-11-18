import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params }) => {
  if (params.year) {
    return {
      year: params.year
    };
  }
};