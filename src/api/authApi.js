const API_URL = import.meta.env.VITE_SERVER_API;

export const refreshAccessToken = async () => {
    try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (err) {
        console.error('Token refresh failed:', err);
        return null;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Login failed');
        }
        return await response.json();
    } catch (err) {
        console.error('Login error:', err);
        throw err;
    }
};

export const registerUser = async (credentials) => {
    const payload = {
        ...credentials,
        full_name: `${credentials.firstName} ${credentials.lastName}`,
    };
    delete payload.firstName;
    delete payload.lastName;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Registration failed');
        }
        return await response.json();
    } catch (err) {
        console.error('Registration error:', err);
        throw err;
    }
};

export const logoutUser = async () => {
    try {
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
    } catch (err) {
        console.error('Logout error:', err);
    }
};

export const fetchUserData = async (userId, accessToken) => {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            headers: accessToken ? {
                'Authorization': `Bearer ${accessToken}`
            } : {},
        });

        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (err) {
        console.error('Failed to fetch user data:', err);
        return null;
    }
};