import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { apiPost } from '~/utils/api.js'

function EmailConfirmation() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const response = await apiPost(`/auth/email-confirm/${token}`, {});

                if (response.ok) {
                    setStatus('success');
                    setMessage('Email confirmed successfully! Redirecting to login...');
                    setTimeout(() => {
                        navigate('/auth/login');
                    }, 3000);
                } else {
                    const data = await response.json();
                    setStatus('error');
                    setMessage(data.message || 'Invalid or expired confirmation link.');
                }
            } catch (err) {
                setStatus('error');
                setMessage('An error occurred. Please try again.');
                console.error(err);
            }
        };

        if (token) {
            confirmEmail();
        } else {
            setStatus('error');
            setMessage('No confirmation token provided.');
        }
    }, [token, navigate]);

    return (
        <div className="auth-form">
            <h2>Email Confirmation</h2>

            {status === 'verifying' && (
                <div className="info-message">
                    <p>Verifying your email...</p>
                </div>
            )}

            {status === 'success' && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {status === 'error' && (
                <>
                    <div className="error-message">
                        {message}
                    </div>
                    <Link to="/auth/login">
                        <button type="button">Back to Login</button>
                    </Link>
                </>
            )}
        </div>
    );
}

export default EmailConfirmation;