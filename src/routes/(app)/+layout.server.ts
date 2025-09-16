import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, url }) => {
    if (!locals.user) {
        throw redirect(302, `/login?redirectTo=${encodeURIComponent(url.pathname + url.search)}`);
    }
    return { user: locals.user };
};

