import EmailConfirmation from '~components/AuthForm/EmailConfirmation.jsx'
import "~/styles/AuthForm.css";

function EmailConfirmationPage() {
    return (
        <div className="auth-layout">
            <EmailConfirmation />
        </div>
    );
}

export default EmailConfirmationPage