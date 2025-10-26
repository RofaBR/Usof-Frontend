import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiPost } from '~/utils/api.js';
import { toast } from 'react-hot-toast';

function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cooldown > 0) return;

        try {
            const response = await apiPost('/auth/password-reset', { email });

            if (response.ok) {
                await response.json();
                toast.success('Password reset link has been sent to your email!');
                setCooldown(60);
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to send reset link');
            }
        } catch (err) {
            console.error(err);
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h2>Reset Password</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                Enter your email address and we'll send you a link to reset your password.
            </p>

            <div className="input-group">
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
            </div>

            <button type="submit" disabled={cooldown > 0}>
                {cooldown > 0 ? `Wait ${cooldown}s` : 'Send Reset Link'}
            </button>

            <p className="auth-switch">
                Remember your password? <Link to="/auth/login">Login</Link>
            </p>
        </form>
    );
}

export default ForgotPasswordForm;
