import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/hooks/useAuth';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_SERVER_API || 'http://localhost:8080/api';

export function usePostInteractions(post_id, initialRating, initialFavorite = false, initialSubscribed = false) {
    const navigate = useNavigate();
    const { accessToken, user } = useAuth();

    const [currentVote, setCurrentVote] = useState(null);
    const [rating, setRating] = useState(initialRating || 0);
    const [isFavorite, setIsFavorite] = useState(initialFavorite);
    const [isSubscribed, setIsSubscribed] = useState(initialSubscribed);

    useEffect(() => {
        setRating(initialRating || 0);
    }, [initialRating]);

    useEffect(() => {
        setIsFavorite(initialFavorite);
    }, [initialFavorite]);

    useEffect(() => {
        setIsSubscribed(initialSubscribed);
    }, [initialSubscribed]);

    useEffect(() => {
        if (!post_id || !accessToken || !user) return;

        const fetchUserVote = async () => {
            try {
                const response = await fetch(`${API_URL}/posts/${post_id}/like`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    const userLike = data.likes?.find(like => like.author_id === user.id);
                    if (userLike) {
                        setCurrentVote(userLike.type);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch user vote:', error);
            }
        };

        fetchUserVote();
    }, [post_id, accessToken, user]);

    const checkAuth = () => {
        if (!accessToken || !user) {
            navigate('/auth/login');
            return false;
        }
        return true;
    };

    const handleVote = async (voteType) => {
        if (!checkAuth()) return;

        try {
            if (currentVote === voteType) {
                await fetch(`${API_URL}/posts/${post_id}/like`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setCurrentVote(null);
                setRating(prev => voteType === 'like' ? prev - 1 : prev + 1);
            } else {
                if (currentVote !== null) {
                    await fetch(`${API_URL}/posts/${post_id}/like`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                }

                await fetch(`${API_URL}/posts/${post_id}/like`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({ type: voteType })
                });

                if (currentVote === null) {
                    setRating(prev => voteType === 'like' ? prev + 1 : prev - 1);
                } else {
                    setRating(prev => voteType === 'like' ? prev + 2 : prev - 2);
                }
                setCurrentVote(voteType);
            }
        } catch (error) {
            console.error('Failed to vote:', error);
            alert('Failed to vote. Please try again.');
        }
    };

    const handleToggleFavorite = async () => {
        if (!checkAuth()) return;

        try {
            if (isFavorite) {
                const response = await fetch(`${API_URL}/posts/${post_id}/favorite`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (response.ok) {
                    setIsFavorite(false);
                    toast.success('Removed from favorites');
                }
            } else {
                const response = await fetch(`${API_URL}/posts/${post_id}/favorite`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (response.ok) {
                    setIsFavorite(true);
                    toast.success('Added to favorites');
                }
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
            toast.error('Failed to update favorite');
        }
    };

    const handleToggleSubscribe = async () => {
        if (!checkAuth()) return;

        try {
            if (isSubscribed) {
                const response = await fetch(`${API_URL}/posts/${post_id}/subscribe`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (response.ok) {
                    setIsSubscribed(false);
                    toast.success('Unsubscribed from notifications');
                }
            } else {
                const response = await fetch(`${API_URL}/posts/${post_id}/subscribe`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (response.ok) {
                    setIsSubscribed(true);
                    toast.success('Subscribed to notifications');
                }
            }
        } catch (error) {
            console.error('Failed to toggle subscribe:', error);
            toast.error('Failed to update subscription');
        }
    };

    return {
        rating,
        currentVote,
        isFavorite,
        isSubscribed,
        handleVote,
        handleToggleFavorite,
        handleToggleSubscribe
    };
}