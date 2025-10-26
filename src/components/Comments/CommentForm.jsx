import { useState } from 'react';
import '~/styles/CommentForm.css';

function CommentForm({
    initialContent = '',
    onSubmit,
    onCancel,
    submitLabel = 'Post Comment',
    placeholder = 'Write your comment...'
}) {
    const [content, setContent] = useState(initialContent);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(content);
            setContent('');
        } catch (error) {
            console.error('Failed to submit comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="comment-form" onSubmit={handleSubmit}>
            <textarea
                className="comment-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                rows={4}
                disabled={isSubmitting}
                required
            />
            <div className="comment-form-actions">
                {onCancel && (
                    <button
                        type="button"
                        className="comment-form-button cancel-button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="comment-form-button submit-button"
                    disabled={isSubmitting || !content.trim()}
                >
                    {isSubmitting ? 'Posting...' : submitLabel}
                </button>
            </div>
        </form>
    );
}

export default CommentForm;