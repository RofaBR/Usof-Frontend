import { Outlet } from 'react-router-dom';
import "~/styles/AuthForm.css";

function AuthLayout() {
    return (
        <div className="auth-page">
            <div className="auth-branding">
                <img src="/logo.png" alt="Syntaxly" className="auth-logo" />
            </div>
            <Outlet />
        </div>
    );
}

export default AuthLayout;