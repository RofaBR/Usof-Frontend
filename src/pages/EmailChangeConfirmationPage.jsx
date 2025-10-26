import EmailChangeConfirmation from '~/components/AuthForm/EmailChangeConfirmation.jsx';
import "~/styles/AuthForm.css";

function EmailChangeConfirmationPage() {
    return (
        <div className="auth-layout">
            <EmailChangeConfirmation />
        </div>
    );
}

export default EmailChangeConfirmationPage;