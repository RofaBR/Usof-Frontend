import { scrollToTopSmooth } from '~/utils/scrollHelpers';
import '~/styles/PaginationButtons.css';

function PaginationButtons({ currentPage, totalPages, onPageChange, loading = false }) {
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage && !loading) {
            onPageChange(page);
            scrollToTopSmooth();
        }
    };

    const getPageNumbers = () => {
        const pages = [];

        if (currentPage > 2) {
            pages.push(1);
            if (currentPage > 3) {
                pages.push('...');
            }
        }

        for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
            if (i !== 1 && i !== totalPages) {
                pages.push(i);
            } else if (pages.length === 0) {
                pages.push(i);
            }
        }

        if (currentPage < totalPages - 1) {
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }
            pages.push(totalPages);
        } else if (totalPages > 1 && !pages.includes(totalPages)) {
            pages.push(totalPages);
        }

        return pages;
    };

    const renderPaginationButtons = () => {
        const buttons = [];

        buttons.push(
            <button
                key="first"
                className="pagination-btn"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || loading}
                title="First page"
            >
                ⟪
            </button>
        );

        buttons.push(
            <button
                key="prev"
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                title="Previous page"
            >
                ‹
            </button>
        );

        const pageNumbers = getPageNumbers();
        pageNumbers.forEach((page, index) => {
            if (page === '...') {
                buttons.push(
                    <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                        ...
                    </span>
                );
            } else {
                buttons.push(
                    <button
                        key={`page-${page}`}
                        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                        disabled={loading}
                    >
                        {page}
                    </button>
                );
            }
        });

        buttons.push(
            <button
                key="next"
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                title="Next page"
            >
                ›
            </button>
        );

        buttons.push(
            <button
                key="last"
                className="pagination-btn"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || loading}
                title="Last page"
            >
                ⟫
            </button>
        );

        return buttons;
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="pagination-container">
            <div className="pagination-buttons">
                {renderPaginationButtons()}
            </div>
            <div className="pagination-info">
                Page {currentPage} of {totalPages}
            </div>
        </div>
    );
}

export default PaginationButtons;