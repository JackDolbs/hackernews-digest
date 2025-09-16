import { json } from '@sveltejs/kit';

export const GET: import('./$types').RequestHandler = async ({ locals }) => {
    return json({ user: locals.user || null });
};

