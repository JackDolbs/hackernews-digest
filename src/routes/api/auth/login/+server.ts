import { json } from '@sveltejs/kit';

export const POST: import('./$types').RequestHandler = async ({ request, locals }) => {
    try {
        const { email, password } = await request.json();
        if (!email || !password) return json({ error: 'Missing email or password' }, { status: 400 });

        if (!locals.pb) return json({ error: 'Auth not configured' }, { status: 500 });

        await locals.pb.collection('users').authWithPassword(email, password);
        return json({ ok: true, user: locals.pb.authStore.model });
    } catch (error: any) {
        return json({ error: error?.message || 'Login failed' }, { status: 401 });
    }
};

