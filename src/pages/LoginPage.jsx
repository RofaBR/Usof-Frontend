import LoginForm from "~components/AuthForm/LoginForm.jsx";
import "~/styles/AuthForm.css";

function LoginPage() {
    return (
        <div className="auth-layout">
            <LoginForm />
        </div>
    );
}

export default LoginPage;