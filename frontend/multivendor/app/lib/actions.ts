'use server';

import { cookies } from 'next/headers';

export async function handleRefresh() {
    console.log('handleRefresh');

    const refreshToken = await getRefreshToken();
    if (!refreshToken) return null;
    const fetchtoken=process.env.NEXT_PUBLIC_API_URL
    const token = await fetch(`${fetchtoken}/api/auth/token/refresh/`, {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(async (json) => {
            console.log('Response - Refresh:', json);

            if (json.access) {
                // Set new access token
                (await cookies()).set('session_access_token', json.access, {
                    httpOnly: true,
                    secure: false,  // Change to true in production
                    maxAge: 60 * 60, // 60 minutes
                    path: '/'
                });

                return json.access;
            } else {
                resetAuthCookies();
                return null;  // Refresh failed, reset cookies
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
        secure: false,
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/'
    });

    (await cookies()).set('session_access_token', accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60, // 60 minutes
        path: '/'
    });

    (await cookies()).set('session_refresh_token', refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/'
    });
}

export async function resetAuthCookies() {
    (await cookies()).set('session_userid', '');
    (await cookies()).set('session_access_token', '');
    (await cookies()).set('session_refresh_token', '');
}

//
// Get data

export async function getUserId() {
    const userId = (await cookies()).get('session_userid')?.value
    return userId ? userId : null
}
// lib/actions.ts


  

export async function getAccessToken() {
    let accessToken = (await cookies()).get('session_access_token')?.value;

    if (!accessToken) {
        // If no access token, attempt to refresh it
        accessToken = await handleRefresh();
    }

    return accessToken;
}

export async function getRefreshToken() {
    let refreshToken = (await cookies()).get('session_refresh_token')?.value;

    return refreshToken;
}
