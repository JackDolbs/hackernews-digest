import PocketBase from 'pocketbase';
import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const handle: Handle = async ({ event, resolve }) => {
    // Prefer server/private envs; supports either POCKETBASE_URL or VITE_POCKETBASE_URL
    const pbUrl = env.POCKETBASE_URL || env.VITE_POCKETBASE_URL;
    const pb = pbUrl ? new PocketBase(pbUrl) : null;

    if (pb) {
        pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
        try {
            if (pb.authStore.isValid) {
                await pb.collection('users').authRefresh();
            }
        } catch {
            pb.authStore.clear();
        }
        event.locals.pb = pb as any;
        event.locals.user = pb.authStore.model as any;
    }

    const response = await resolve(event);

    if (pb) {
        const secure = event.url.protocol === 'https:';
        response.headers.append(
            'set-cookie',
            pb.authStore.exportToCookie({ httpOnly: true, secure, sameSite: 'lax', path: '/' })
        );
    }

    return response;
};

