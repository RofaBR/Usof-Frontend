
export const scrollToTop = (behavior = 'instant') => {

    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.scrollTo({
        top: 0,
        left: 0,
        behavior: behavior
        });
    }

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: behavior
    });
};

export const scrollToTopSmooth = () => scrollToTop('smooth');

export const scrollToTopInstant = () => scrollToTop('instant');