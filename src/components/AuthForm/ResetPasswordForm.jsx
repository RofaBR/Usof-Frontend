import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiPost } from '~/utils/api.js';
import { toast } from 'react-hot-toast';

function ResetPasswordForm() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            const response = await apiPost(`/auth/password-reset/${token}`, {
                password: formData.password,
                confirmPassword: formData.confirmPassword
            });

            if (response.ok) {
                await response.json();
                toast.success('Password has been reset successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/auth/login');
                }, 2000);
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to reset password. The link may be invalid or expired.');
            }
        } catch (err) {
            console.error(err);
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h2>Set New Password</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                Enter your new password below.
            </p>

            <div className="input-group">
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    required
                />
            </div>

            <div className="input-group">
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    required
                />
            </div>

            <button type="submit">Reset Password</button>

            <p className="auth-switch">
                <Link to="/auth/login">Back to Login</Link>
            </p>
        </form>
    );
}

export default ResetPasswordForm;
