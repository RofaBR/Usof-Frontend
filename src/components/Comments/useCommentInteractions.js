import { useState } from 'react';
import { useAuth } from '~/hooks/useAuth';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_SERVER_API || 'http://localhost:8080/api';

export function useCommentInteractions(commentId, initialRating = 0, initialVote = null) {
    const { accessToken } = useAuth();
    const [rating, setRating] = useState(Number(initialRating) || 0);
    const [currentVote, setCurrentVote] = useState(initialVote);
    const [isLoading, setIsLoading] = useState(false);

    const handleVote = async (type) => {
        if (!accessToken) {
            toast.error('Please login to vote');
            return;
        }

        if (isLoading) {
            return;
        }

        setIsLoading(true);

        try {
            if (currentVote === type) {
                await fetch(`${API_URL}/comments/${commentId}/like`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                setRating(prev => Number(prev) + (type === 'like' ? -1 : 1));
                setCurrentVote(null);
            } else {
                await fetch(`${API_URL}/comments/${commentId}/like`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({ type })
                });

                const ratingChange = type === 'like' ? 1 : -1;
                const previousVoteChange = currentVote ? (currentVote === 'like' ? -1 : 1) : 0;

                setRating(prev => Number(prev) + ratingChange + previousVoteChange);
                setCurrentVote(type);
            }
        } catch (error) {
            console.error('Failed to vote:', error);
            toast.error('Failed to vote');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        rating,
        currentVote,
        handleVote,
        isLoading
    };
}