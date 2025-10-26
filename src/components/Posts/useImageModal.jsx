import { useState, useEffect } from 'react';

export function useImageModal(imagesLength) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    const openImageModal = (index) => {
        setSelectedImageIndex(index);
    };

    const closeImageModal = () => {
        setSelectedImageIndex(null);
    };

    const navigateImage = (direction) => {
        if (selectedImageIndex === null || imagesLength === 0) return;

        if (direction === 'next') {
            setSelectedImageIndex((prev) => (prev + 1) % imagesLength);
        } else if (direction === 'prev') {
            setSelectedImageIndex((prev) => (prev - 1 + imagesLength) % imagesLength);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedImageIndex === null) return;

            if (e.key === 'Escape') {
                closeImageModal();
            } else if (e.key === 'ArrowRight') {
                navigateImage('next');
            } else if (e.key === 'ArrowLeft') {
                navigateImage('prev');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImageIndex, imagesLength]);

    return {
        selectedImageIndex,
        openImageModal,
        closeImageModal,
        navigateImage
    };
}