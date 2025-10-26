import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_SERVER_API || 'http://localhost:8080/api';

function EmailChangeConfirmation() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const confirmEmailChange = async () => {
            try {
                const response = await fetch(`${API_URL}/users/email-change/confirm/${token}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage('Email changed successfully!');
                    setTimeout(() => {
                        navigate('/auth/login');
                    }, 3000);
                } else {
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
            confirmEmailChange();
        } else {
            setStatus('error');
            setMessage('No confirmation token provided.');
        }
    }, [token, navigate]);

    return (
        <div className="auth-form">
            <h2>Email Change Confirmation</h2>

            {status === 'verifying' && (
                <div className="info-message">
                    <p>Verifying your new email address...</p>
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

export default EmailChangeConfirmation;