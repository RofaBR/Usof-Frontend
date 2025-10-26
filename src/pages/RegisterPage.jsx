import RegisterForm from "~components/AuthForm/RegisterForm.jsx"
import "~/styles/AuthForm.css";

function RegisterPage() {
    return (
        <div className="auth-layout">
            <RegisterForm />
        </div>
    );
}

export default RegisterPage;