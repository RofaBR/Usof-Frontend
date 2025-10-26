import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from "~/hooks/useAuth.jsx";
import toast from 'react-hot-toast'

function LoginForm() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        login: "",
        password: ""
    });

    const fields = [
        {name: "login", type: "text", placeholder: "Enter your login"},
        {name: "password", type: "password", placeholder: "Enter your password"},
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
            toast.success('Welcome back!');
            navigate('/syntaxly/');
        } catch (err) {
            toast.error(err.message || 'Invalid login or password');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            {fields.map((field) => (
                <div key={field.name} className="input-group">
                    <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                    />
                </div>
            ))}

            <button type="submit">Log In</button>

            <p className="auth-switch">
                <Link to="/auth/forgot-password">Forgot password?</Link>
            </p>
            <p className="auth-switch">
                Don't have an account? <Link to="/auth/register">Register</Link>
            </p>
        </form>
    );
}

export default LoginForm;
