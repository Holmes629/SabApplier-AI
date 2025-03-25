const API_URL = 'http://localhost:8000/api';

const getHeaders = (includeAuth = false) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (includeAuth) {
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
};

export const api = {
    async login(email, password) {
        const response = await fetch(`${API_URL}/users/login/`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        return data;
    },

    async signup(userData) {
        const response = await fetch(`${API_URL}/users/signup/`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Signup failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        return data;
    },

    async getProfile() {
        const response = await fetch(`${API_URL}/users/profile/`, {
            headers: getHeaders(true),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }

        return await response.json();
    },

    logout() {
        localStorage.removeItem('token');
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
}; 