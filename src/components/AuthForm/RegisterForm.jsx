import { useState } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from "~/hooks/useAuth.jsx";
import { toast } from 'react-hot-toast';

function RegisterForm() {
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        login: "",
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: ""
    });

    const fields = [
        { name: "login", type: "text", placeholder: "Login" },
        { name: "email", type: "email", placeholder: "Email" },
        { name: "firstName", type: "text", placeholder: "First Name" },
        { name: "lastName", type: "text", placeholder: "Last Name" },
        { name: "password", type: "password", placeholder: "Password" },
        { name: "confirmPassword", type: "password", placeholder: "Confirm Password" }
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            toast.success("Registration successful! Check your email to confirm your account.");
        } catch (err) {
            toast.error(err.message || "Registration failed. Please try again.");
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
            <button type="submit">Register</button>
            <p className="auth-switch">
                Already have an account? <Link to="/auth/login">Login</Link>
            </p>
        </form>
    );
}

export default RegisterForm;
