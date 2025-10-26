import { useState, useEffect, useRef } from 'react';

export function useContentExpansion(maxHeight = 300, dependencies = []) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showExpandButton, setShowExpandButton] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            const scrollHeight = contentRef.current.scrollHeight;
            setShowExpandButton(scrollHeight > maxHeight);
        }
    }, dependencies);

    const toggleExpansion = () => {
        setIsExpanded((prev) => !prev);
    };

    return {
        contentRef,
        isExpanded,
        showExpandButton,
        toggleExpansion
    };
}