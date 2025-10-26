const API_URL = import.meta.env.VITE_SERVER_API;

let isRefreshing = false;
let refreshSubscribers = [];

    const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

const onRefreshed = (newToken) => {
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];
};

const refreshAccessToken = async () => {
    try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            return data.accessToken;
        }
        return null;
    } catch (err) {
        console.error('Token refresh failed:', err);
        return null;
    }
};

export const apiFetch = async (endpoint, options = {}, accessToken = null) => {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const config = {
        ...options,
        headers,
        credentials: 'include',
    };

    let response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 401) {
        if (!accessToken) {
            window.location.href = '/auth/login';
            throw new Error('Authentication required. Please login.');
        }

        if (!isRefreshing) {
            isRefreshing = true;
            const newToken = await refreshAccessToken();
            isRefreshing = false;

            if (newToken) {
                onRefreshed(newToken);

                headers['Authorization'] = `Bearer ${newToken}`;
                const retryConfig = {
                    ...options,
                    headers,
                    credentials: 'include',
                };
                response = await fetch(`${API_URL}${endpoint}`, retryConfig);
            } else {
                window.location.href = '/auth/login';
                throw new Error('Session expired. Please login again.');
            }
        } else {
            return new Promise((resolve) => {
                subscribeTokenRefresh(async (newToken) => {
                    headers['Authorization'] = `Bearer ${newToken}`;
                    const retryConfig = {
                        ...options,
                        headers,
                        credentials: 'include',
                    };
                    const retryResponse = await fetch(`${API_URL}${endpoint}`, retryConfig);
                    resolve(retryResponse);
                });
            });
        }
    }

    return response;
};

export const apiGet = async (endpoint, accessToken = null) => {
    return apiFetch(endpoint, { method: 'GET' }, accessToken);
};

export const apiPost = async (endpoint, body, accessToken = null) => {
    return apiFetch(
        endpoint,
        {
            method: 'POST',
            body: JSON.stringify(body),
        },
        accessToken
    );
};

export const apiPut = async (endpoint, body, accessToken = null) => {
    return apiFetch(
        endpoint,
        {
            method: 'PUT',
            body: JSON.stringify(body),
        },
        accessToken
    );
};

export const apiDelete = async (endpoint, accessToken = null) => {
    return apiFetch(endpoint, { method: 'DELETE' }, accessToken);
};

export const apiPatch = async (endpoint, body, accessToken = null) => {
    return apiFetch(
        endpoint,
        {
            method: 'PATCH',
            body: JSON.stringify(body),
        },
        accessToken
    );
};