'use server';

import { cookies } from 'next/headers';

const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const ACCESS_TOKEN_MAX_AGE = 60 * 60; // 60 minutes

export async function handleRefresh() {
    console.log('handleRefresh');
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return null;

    const fetchToken = process.env.NEXT_PUBLIC_API_URL;
    const token = await fetch(`${fetchToken}/api/auth/token/refresh/`, {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then(async (json) => {
            console.log('Response - Refresh:', json);
            if (json.access) {
                (await cookies()).set('session_access_token', json.access, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: ACCESS_TOKEN_MAX_AGE,
                    path: '/',
                });
                if (json.refresh) {
                    (await cookies()).set('session_refresh_token', json.refresh, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: REFRESH_TOKEN_MAX_AGE,
                        path: '/',
                    });
                }
                return json.access;
            } else {
                resetAuthCookies();
                return null;
            }
        })
        .catch((error) => {
            console.error('Error during token refresh:', error);
            resetAuthCookies();
            return null;
        });

    return token;
}

export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
    (await cookies()).set('session_userid', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: REFRESH_TOKEN_MAX_AGE,
        path: '/',
    });
    (await cookies()).set('session_access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: ACCESS_TOKEN_MAX_AGE,
        path: '/',
    });
    (await cookies()).set('session_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: REFRESH_TOKEN_MAX_AGE,
        path: '/',
    });
}

export async function resetAuthCookies() {
    (await cookies()).set('session_userid', '', { maxAge: 0 });
    (await cookies()).set('session_access_token', '', { maxAge: 0 });
    (await cookies()).set('session_refresh_token', '', { maxAge: 0 });
}

export async function getUserId() {
    const userId = (await cookies()).get('session_userid')?.value;
    return userId || null;
}

export async function getAccessToken() {
    let accessToken = (await cookies()).get('session_access_token')?.value;
    if (!accessToken) {
        accessToken = await handleRefresh();
    }
    return accessToken;
}

export async function getRefreshToken() {
    return (await cookies()).get('session_refresh_token')?.value || null;
}