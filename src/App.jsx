import '~/App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import ScrollToTop from "~/components/Common/ScrollToTop.jsx";
import AuthLayout from "~/pages/AuthLayout.jsx";
import LoginPage from "~/pages/LoginPage.jsx"
import RegisterPage from "~/pages/RegisterPage.jsx"
import ForgotPasswordPage from "~/pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "~/pages/ResetPasswordPage.jsx";
import EmailConfirmationPage from "~/pages/EmailConfirmationPage.jsx";
import EmailChangeConfirmationPage from "~/pages/EmailChangeConfirmationPage.jsx";

import MainPage from "~/pages/MainPage.jsx";
import HomePage from "~/pages/HomePage.jsx";
import GenericPostPage from "~/components/Posts/GenericPostPage.jsx";
import CreatePostPage from "~/pages/CreatePostPage.jsx";
import EditPostPage from "~/pages/EditPostPage.jsx";
import PostPage from "~/pages/PostPage.jsx";
import CategoriesPage from "~/pages/CategoriesPage.jsx";
import UsersPage from "~/pages/UsersPage.jsx";
import ProfilePage from "~/pages/ProfilePage.jsx";
import EditProfilePage from "~/pages/EditProfilePage.jsx";
import NotFoundPage from "~/pages/NotFoundPage.jsx";

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="reset-password/:token" element={<ResetPasswordPage />} />
                    <Route path="confirm-email/:token" element={<EmailConfirmationPage />} />
                    <Route path="confirm-email-change/:token" element={<EmailChangeConfirmationPage />} />
                </Route>

                <Route path="/" element={<Navigate to="/syntaxly" replace />} />
                <Route path="/syntaxly" element={<MainPage />}>
                    <Route index element={<HomePage />} />
                    <Route path="home" element={<HomePage />} />
                    <Route path="recent" element={<GenericPostPage title="Recent Posts" />} />
                    <Route path="posts" element={<GenericPostPage title="All Posts" showCreateButton={true} showAllStatuses={true} />} />
                    <Route path="posts/create" element={<CreatePostPage />} />
                    <Route path="post/:post_id/edit" element={<EditPostPage />} />
                    <Route path="post/:post_id" element={<PostPage />} />
                    <Route path="unanswered" element={<GenericPostPage title="Unanswered Posts" postListProps={{ filter: "unanswered" }} />} />
                    <Route path="categories" element={<CategoriesPage />} />
                    <Route path="favorites" element={<GenericPostPage title="Favorites" postListProps={{ favoritesOnly: true }} />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="profile/:user_id" element={<ProfilePage />} />
                    <Route path="profile/edit" element={<EditProfilePage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#2a1a44',
                        color: '#fff',
                        borderRadius: '8px',
                        fontSize: '14px',
                        border: '1px solid rgba(255,255,255,0.1)',
                    },
                }}
            />
        </Router>
    );
}

export default App
