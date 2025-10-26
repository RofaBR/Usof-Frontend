import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/hooks/useAuth';
import { getAvatarUrl } from '~/utils/urlHelpers';
import toast from 'react-hot-toast';
import '~/styles/EditProfilePage.css';

const API_URL = import.meta.env.VITE_SERVER_API || 'http://localhost:8080/api';

const splitFullName = (fullName) => {
    const names = (fullName || '').trim().split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';
    return { firstName, lastName };
};

function EditProfilePage() {
    const navigate = useNavigate();
    const { user, accessToken } = useAuth();
    const [initialLoading, setInitialLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const [avatarState, setAvatarState] = useState({
        preview: null,
        file: null,
        currentUrl: null,
        loading: false
    });

    const [profileState, setProfileState] = useState({
        firstName: '',
        lastName: '',
        loading: false
    });

    const [emailState, setEmailState] = useState({
        currentEmail: '',
        newEmail: '',
        pendingEmail: null,
        loading: false
    });

    const [passwordState, setPasswordState] = useState({
        password: '',
        confirmPassword: '',
        loading: false
    });

    const [loginState, setLoginState] = useState({
        currentLogin: '',
        newLogin: '',
        currentPassword: '',
        loading: false
    });

    useEffect(() => {
        if (!user) {
            navigate('/auth/login');
            return;
        }

        if (!accessToken) return;

        const fetchFullUserData = async () => {
            setInitialLoading(true);
            try {
                const response = await fetch(`${API_URL}/users/${user.id}`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    const userInfo = data.user;
                    setUserData(userInfo);

                    const { firstName, lastName } = splitFullName(userInfo.full_name);
                    setProfileState({ firstName, lastName, loading: false });

                    setEmailState({
                        currentEmail: userInfo.email || '',
                        newEmail: '',
                        pendingEmail: userInfo.pending_email || null,
                        loading: false
                    });

                    const avatarUrl = getAvatarUrl(userInfo.avatar);
                    setAvatarState({
                        preview: avatarUrl,
                        file: null,
                        currentUrl: userInfo.avatar ? avatarUrl : null,
                        loading: false
                    });

                    setLoginState({
                        currentLogin: userInfo.login || '',
                        newLogin: '',
                        currentPassword: '',
                        loading: false
                    });
                } else {
                    toast.error('Failed to load profile data.');
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                toast.error('Failed to load profile data.');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchFullUserData();
    }, [user?.id, accessToken, navigate, refetchTrigger]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setAvatarState(prev => ({ ...prev, file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarState(prev => ({ ...prev, preview: reader.result }));
            };
            reader.readAsDataURL(file);
        } else if (file) {
            toast.error('Please select an image file.');
        }
    };

    const handleAvatarSave = async () => {
        if (!avatarState.file) {
            toast.error('Please select an image first.');
            return;
        }

        setAvatarState(prev => ({ ...prev, loading: true }));
        try {
            const formData = new FormData();
            formData.append('avatar', avatarState.file);

            const response = await fetch(`${API_URL}/users/avatar`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${accessToken}` },
                body: formData
            });

            if (!response.ok) throw new Error('Failed to upload avatar');

            setRefetchTrigger(prev => prev + 1);
            toast.success('Avatar updated successfully!');
        } catch (error) {
            console.error('Avatar upload error:', error);
            toast.error(error.message || 'Failed to upload avatar');
        } finally {
            setAvatarState(prev => ({ ...prev, loading: false }));
        }
    };

    const handleAvatarRemove = async () => {
        if (!avatarState.currentUrl) return;
        if (!window.confirm('Are you sure you want to remove your profile picture?')) return;

        setAvatarState(prev => ({ ...prev, loading: true }));
        try {
            const response = await fetch(`${API_URL}/users/avatar`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            if (!response.ok) throw new Error('Failed to remove avatar');

            setRefetchTrigger(prev => prev + 1);
            toast.success('Avatar removed successfully!');
        } catch (error) {
            console.error('Remove avatar error:', error);
            toast.error(error.message || 'Failed to remove avatar');
        } finally {
            setAvatarState(prev => ({ ...prev, loading: false }));
        }
    };

    const handleProfileSave = async () => {
        if (!profileState.firstName.trim()) {
            toast.error('First name is required');
            return;
        }

        setProfileState(prev => ({ ...prev, loading: true }));
        try {
            const fullName = `${profileState.firstName.trim()} ${profileState.lastName.trim()}`.trim();

            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ full_name: fullName })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            setRefetchTrigger(prev => prev + 1);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setProfileState(prev => ({ ...prev, loading: false }));
        }
    };

    const handleEmailChange = async () => {
        if (!emailState.newEmail.trim()) {
            toast.error('Please enter a new email address');
            return;
        }

        if (emailState.newEmail === emailState.currentEmail) {
            toast.error('New email must be different from current email');
            return;
        }

        setEmailState(prev => ({ ...prev, loading: true }));
        try {
            const response = await fetch(`${API_URL}/users/email-change`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ email: emailState.newEmail })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to request email change');
            }

            setRefetchTrigger(prev => prev + 1);
            toast.success('Confirmation email sent! Check your new email address.');
        } catch (error) {
            console.error('Email change error:', error);
            toast.error(error.message || 'Failed to request email change');
        } finally {
            setEmailState(prev => ({ ...prev, loading: false }));
        }
    };

    const handlePasswordChange = async () => {
        if (!passwordState.password || !passwordState.confirmPassword) {
            toast.error('Please fill in both password fields');
            return;
        }

        if (passwordState.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        if (passwordState.password !== passwordState.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setPasswordState(prev => ({ ...prev, loading: true }));
        try {
            const response = await fetch(`${API_URL}/users/password`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    password: passwordState.password,
                    confirmPassword: passwordState.confirmPassword
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update password');
            }

            setPasswordState({ password: '', confirmPassword: '', loading: false });
            toast.success('Password updated successfully!');
        } catch (error) {
            console.error('Password update error:', error);
            toast.error(error.message || 'Failed to update password');
            setPasswordState(prev => ({ ...prev, loading: false }));
        }
    };

    const handleLoginChange = async () => {
        if (!loginState.newLogin.trim()) {
            toast.error('Please enter a new login');
            return;
        }

        if (loginState.newLogin.length < 3) {
            toast.error('Login must be at least 3 characters long');
            return;
        }

        if (loginState.newLogin === loginState.currentLogin) {
            toast.error('New login must be different from current login');
            return;
        }

        if (!loginState.currentPassword) {
            toast.error('Please enter your current password to confirm');
            return;
        }

        setLoginState(prev => ({ ...prev, loading: true }));
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    newLogin: loginState.newLogin,
                    currentPassword: loginState.currentPassword
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update login');
            }

            setRefetchTrigger(prev => prev + 1);
            setLoginState(prev => ({
                ...prev,
                newLogin: '',
                currentPassword: '',
                loading: false
            }));
            toast.success('Login updated successfully!');
        } catch (error) {
            console.error('Login update error:', error);
            toast.error(error.message || 'Failed to update login');
            setLoginState(prev => ({ ...prev, loading: false }));
        }
    };

    if (initialLoading) {
        return <section className="edit-profile-page"><p>Loading profile...</p></section>;
    }

    if (!user || !userData) {
        return null;
    }

    return (
        <section className="edit-profile-page">
            <div className="edit-profile-header">
                <h1>Edit Profile</h1>
                <button
                    className="btn-back"
                    onClick={() => navigate(`/syntaxly/profile/${user.id}`)}
                >
                    Back to Profile
                </button>
            </div>

            <div className="cards-container">
                <div className="profile-card">
                    <h2 className="card-title">Profile Picture</h2>
                    <div className="avatar-section">
                        <label htmlFor="avatar-input" className="avatar-preview-container">
                            <img
                                src={avatarState.preview || getAvatarUrl(null)}
                                alt="Avatar preview"
                                className="avatar-preview"
                            />
                            <div className="avatar-overlay">
                                <span>Click to change</span>
                            </div>
                        </label>
                        <input
                            type="file"
                            id="avatar-input"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleAvatarChange}
                            className="avatar-input"
                        />
                        <div className="avatar-actions">
                            <button
                                type="button"
                                onClick={handleAvatarSave}
                                className="btn-primary"
                                disabled={!avatarState.file || avatarState.loading}
                            >
                                {avatarState.loading ? 'Saving...' : 'Save Avatar'}
                            </button>
                            {avatarState.currentUrl && (
                                <button
                                    type="button"
                                    onClick={handleAvatarRemove}
                                    className="btn-danger"
                                    disabled={avatarState.loading}
                                >
                                    Remove Avatar
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="profile-card">
                    <h2 className="card-title">Personal Information</h2>
                    <div className="card-content">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    value={profileState.firstName}
                                    onChange={(e) => setProfileState(prev => ({ ...prev, firstName: e.target.value }))}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    value={profileState.lastName}
                                    onChange={(e) => setProfileState(prev => ({ ...prev, lastName: e.target.value }))}
                                    className="form-input"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleProfileSave}
                            className="btn-primary btn-full"
                            disabled={profileState.loading}
                        >
                            {profileState.loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                <div className="profile-card">
                    <h2 className="card-title">Change Login</h2>
                    <div className="card-content">
                        <div className="form-group">
                            <label>Current Login</label>
                            <input
                                type="text"
                                value={loginState.currentLogin}
                                className="form-input"
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newLogin">New Login</label>
                            <input
                                type="text"
                                id="newLogin"
                                value={loginState.newLogin}
                                onChange={(e) => setLoginState(prev => ({ ...prev, newLogin: e.target.value }))}
                                className="form-input"
                                placeholder="Enter new login"
                                minLength={3}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmLoginPassword">Current Password</label>
                            <input
                                type="password"
                                id="confirmLoginPassword"
                                value={loginState.currentPassword}
                                onChange={(e) => setLoginState(prev => ({ ...prev, currentPassword: e.target.value }))}
                                className="form-input"
                                placeholder="Enter password to confirm"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleLoginChange}
                            className="btn-primary btn-full"
                            disabled={loginState.loading}
                        >
                            {loginState.loading ? 'Updating...' : 'Update Login'}
                        </button>
                    </div>
                </div>

                <div className="profile-card">
                    <h2 className="card-title">Email Settings</h2>
                    <div className="card-content">
                        <div className="form-group">
                            <label>Current Email</label>
                            <input
                                type="email"
                                value={emailState.currentEmail}
                                className="form-input"
                                disabled
                            />
                        </div>
                        {emailState.pendingEmail && (
                            <div className="pending-email-notice">
                                <svg className="icon-warning" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" fill="currentColor"/>
                                </svg>
                                <span>
                                    Email change pending: <strong>{emailState.pendingEmail}</strong>
                                    <br/>Please check your new email inbox for confirmation link.
                                </span>
                            </div>
                        )}
                        <div className="form-group">
                            <label htmlFor="newEmail">New Email Address</label>
                            <input
                                type="email"
                                id="newEmail"
                                value={emailState.newEmail}
                                onChange={(e) => setEmailState(prev => ({ ...prev, newEmail: e.target.value }))}
                                className="form-input"
                                placeholder="Enter new email address"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleEmailChange}
                            className="btn-primary btn-full"
                            disabled={emailState.loading}
                        >
                            {emailState.loading ? 'Sending...' : 'Request Email Change'}
                        </button>
                    </div>
                </div>

                <div className="profile-card">
                    <h2 className="card-title">Change Password</h2>
                    <div className="card-content">
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={passwordState.password}
                                onChange={(e) => setPasswordState(prev => ({ ...prev, password: e.target.value }))}
                                className="form-input"
                                placeholder="Enter new password"
                                minLength={6}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmNewPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmNewPassword"
                                value={passwordState.confirmPassword}
                                onChange={(e) => setPasswordState(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                className="form-input"
                                placeholder="Confirm new password"
                                minLength={6}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handlePasswordChange}
                            className="btn-primary btn-full"
                            disabled={passwordState.loading}
                        >
                            {passwordState.loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default EditProfilePage;