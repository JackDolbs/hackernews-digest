import { json } from '@sveltejs/kit';

export const POST: import('./$types').RequestHandler = async ({ request, locals }) => {
    try {
        const { email, password } = await request.json();
        if (!email || !password) return json({ error: 'Missing email or password' }, { status: 400 });

        if (!locals.pb) return json({ error: 'Auth not configured' }, { status: 500 });

        const user = await locals.pb.collection('users').create({ email, password, passwordConfirm: password });
        // optional: send verification email here if rules require verification
        return json({ ok: true, user });
    } catch (error: any) {
        return json({ error: error?.message || 'Registration failed' }, { status: 400 });
    }
};

