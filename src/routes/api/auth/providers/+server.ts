import { json } from '@sveltejs/kit';

export const GET: import('./$types').RequestHandler = async ({ locals }) => {
    if (!locals.pb) return json({ error: 'PocketBase not configured', providers: [] });
    
    try {
        const authMethods = await locals.pb.collection('users').listAuthMethods();
        console.log('PocketBase authMethods:', JSON.stringify(authMethods, null, 2));
        
        // Return only enabled OAuth2 providers - use them as-is from PocketBase
        const providers = authMethods?.oauth2?.providers?.map(p => {
            const pbUrl = locals.pb?.baseUrl || 'https://db.auriel.tech';
            const redirectUri = `${pbUrl}/api/oauth2-redirect`;
            
            // Fix the authUrl by replacing empty redirect_uri with PocketBase's redirect
            let authUrl = p.authUrl || p.authURL || '';
            if (authUrl.includes('redirect_uri=')) {
                authUrl = authUrl.replace(/redirect_uri=[^&]*(&|$)/, `redirect_uri=${encodeURIComponent(redirectUri)}$1`);
            }

            return {
                name: p.name,
                displayName: p.displayName,
                state: p.state,
                codeVerifier: p.codeVerifier,
                authUrl: authUrl,
                redirectUrl: redirectUri
            };
        }) || [];
        
        console.log('Fixed providers:', providers);
        
        return json({ providers, debug: authMethods });
    } catch (error) {
        console.error('PocketBase auth methods error:', error);
        return json({ error: error.message, providers: [] });
    }
};

