import { json } from '@sveltejs/kit';

export const POST: import('./$types').RequestHandler = async ({ locals }) => {
    if (locals.pb) {
        locals.pb.authStore.clear();
        locals.user = null as any;
    }
    return json({ ok: true });
};

