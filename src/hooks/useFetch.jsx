import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_SERVER_API;

export function useFetch(endpoint, options = {}) {
    const { accessToken, credentials = 'include' } = options;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!endpoint) {
            setLoading(false);
            setData(null);
            setError(null);
            return;
        }

        const controller = new AbortController();

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const headers = {};
                if (accessToken) {
                    headers['Authorization'] = `Bearer ${accessToken}`;
                }

                const response = await fetch(`${API_URL}${endpoint}`, {
                    signal: controller.signal,
                    headers,
                    credentials,
                });

                if (response.status === 401) {
                    navigate('/auth/login');
                    throw new Error('Unauthorized');
                }

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                setData(result);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            controller.abort();
        };
    }, [endpoint, accessToken, credentials, navigate]);

    return { data, loading, error };
}