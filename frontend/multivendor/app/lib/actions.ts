"use server";

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

// Refresh token logic
export async function handleRefresh() {
    console.log("handleRefresh triggered");
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
        console.log("No refresh token found");
        return null;
    }

    const fetchTokenUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!fetchTokenUrl) {
        console.error("API URL not defined in environment");
        return null;
    }

    try {
        const response = await fetch(`${fetchTokenUrl}/api/auth/token/refresh/`, {
            method: "POST",
            body: JSON.stringify({ refresh: refreshToken }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        });

        const json = await response.json();
        console.log("Refresh response:", json);

        if (response.ok && json.access) {
            // Set new access token
            (await cookies()).set("session_access_token", json.access, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Secure in production
                maxAge: 60 * 60, // 60 minutes
                path: "/",
            });

            // If backend rotates refresh tokens, update it
            if (json.refresh) {
                (await cookies()).set("session_refresh_token", json.refresh, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                    path: "/",
                });
            }

            return json.access;
        } else {
            console.log("Refresh failed, resetting cookies");
            await resetAuthCookies();
            return null;
        }
    } catch (error) {
        console.error("Error during token refresh:", error);
        await resetAuthCookies();
        return null;
    }
}

// Login handler
export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
    console.log("handleLogin triggered for user:", userId);
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
    };

    (await cookies()).set("session_userid", userId, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    (await cookies()).set("session_access_token", accessToken, {
        ...cookieOptions,
        maxAge: 60 * 60, // 60 minutes
    });

    (await cookies()).set("session_refresh_token", refreshToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 30, // 30 days
    });
}

// Reset cookies on logout or failure
export async function resetAuthCookies() {
    console.log("Resetting auth cookies");
    (await cookies()).set("session_userid", "", { maxAge: 0, path: "/" });
    (await cookies()).set("session_access_token", "", { maxAge: 0, path: "/" });
    (await cookies()).set("session_refresh_token", "", { maxAge: 0, path: "/" });
}

// Getters
export async function getUserId() {
    const userId = (await cookies()).get("session_userid")?.value;
    return userId || null;
}

export async function getAccessToken() {
    console.log("Getting access token");
    let accessToken = (await cookies()).get("session_access_token")?.value;

    if (!accessToken) {
        console.log("No access token, attempting refresh");
        accessToken = await handleRefresh();
    }

    return accessToken || null;
}

export async function getRefreshToken() {
    const refreshToken = (await cookies()).get("session_refresh_token")?.value;
    return refreshToken || null;
}

// Logout function (optional for e-commerce)
export async function handleLogout() {
    await resetAuthCookies();
    // Redirect to login page or homepage if needed
}