# CBL Progress & Frontend Documentation

## CBL Progress

### Stage 1: Project Setup & Initial Configuration
- Initialized React project with **Vite** build tool for fast development.
- Configured **ESLint** for code quality and consistency.
- Set up **path aliases** (`~`, `~src`, `~components`, `~assets`) in `vite.config.js` for cleaner imports.
- Configured **Vite dev server proxy** to forward `/api` requests to backend at `http://localhost:8080`.
- Created basic project structure with separate directories for components, pages, hooks, contexts, and utilities.

### Stage 2: Authentication System
- Implemented **JWT-based authentication** using access tokens and refresh tokens.
- Created **AuthContext** with Context API for global authentication state management.
- Built authentication API layer in `src/api/authApi.js`:
  - Login, register, logout functions
  - Access token refresh mechanism
  - User data fetching
- Developed authentication forms:
  - **LoginForm** - User login with email/password
  - **RegisterForm** - New user registration
  - **ForgotPasswordForm** - Password reset request
  - **ResetPasswordForm** - Password reset with token
  - **EmailConfirmation** - Email verification flow
- Implemented **httpOnly cookie-based** refresh token storage for security.

### Stage 3: Core Layout & Navigation
- Created **responsive layout system**:
  - **Header** - Top navigation with logo, search bar, notifications, and user menu
  - **Sidebar** - Main navigation with icons (Home, Posts, Categories, Favorites, Users)
  - **RightSidebar** - Additional content area (guidelines, stats)
  - **Footer** - Site footer with links and information
  - **Layout** - Wrapper component combining header, content, and footer
- Implemented **UserAvatar** component with dropdown menu showing user info and logout.
- Built **NotificationBell** component for real-time notification display.
- Created **SearchBar** with debounced search functionality.
- Designed **dark-themed UI** with purple accents and smooth transitions.

### Stage 4: Post Management System
- Developed comprehensive post components:
  - **PostCard** - Individual post display with author info, content preview, stats
  - **PostList** - Paginated list of posts with loading states
  - **CreatePostForm** - Multi-step form for creating posts with image upload
  - **GenericPostPage** - Reusable page component for different post views
- Implemented **post interactions**:
  - Like/dislike functionality with optimistic updates
  - Favorite/unfavorite posts
  - Subscribe to post updates
  - Author actions (edit, delete)
- Added **image upload system**:
  - Multiple image upload with preview
  - Image modal for full-screen viewing
- Created **pagination system** with page size selector and navigation buttons.
- Built **filtering and sorting**:
  - Sort by date or rating
  - Filter by status (active/inactive)
  - Filter by categories
  - Favorites-only view

### Stage 5: Advanced Features & User Interactions
- Implemented **commenting system**:
  - **Comment** component with nested display
  - **CommentForm** for adding/editing comments
  - Like/dislike for comments
- Created **notification system**:
  - Notification count badge
  - Delete individual or all notifications
- Developed **search functionality**:
  - **SearchContext** for global search state
  - **SearchBar** with debounced input
  - Search results highlighting
- Added **content expansion**:
  - "Read more" functionality for long posts
  - Expandable comment threads
  - Image galleries with modal view
- Implemented **toast notifications** using React Hot Toast for user feedback.

### Stage 6: User Management & Profiles
- Built **user profile system**:
  - **ProfilePage** - User profile view with tabs (Posts, Comments)
  - **EditProfilePage** - Profile editing with avatar upload
  - **UserPostsList** - List of user's posts
  - **UserCommentsList** - List of user's comments
- Created **UsersPage** with user cards and pagination.
- Implemented **avatar management**:
  - Avatar upload and preview
  - Default avatar fallback
  - Avatar display in multiple components
- Added **user statistics**:
  - Post count
  - Comment count
  - User rating
  - Role display (admin/user)
- Developed **CategoriesPage** for browsing post categories.
- Implemented **404 Not Found page** for invalid routes.

---

## Program Structure and Algorithm Overview

### Frontend Architecture

The application follows a **component-based architecture** with clear separation of concerns:

```
React App
├── Routing Layer (React Router)
├── Context Layer (Global State)
├── Pages (Route Components)
├── Components (Reusable UI)
├── Hooks (Custom Logic)
├── API Layer (Backend Communication)
└── Utils (Helper Functions)
```

### Project Structure

```
src/
├── api/                    # API communication layer
│   └── authApi.js          # Authentication API calls
├── assets/                 # SVG icons and static assets
│   ├── BellIcon.jsx        # Notification icon
│   ├── HomeIcon.jsx        # Home icon
│   ├── PostsIcon.jsx       # Posts icon
│   ├── CategoriesIcon.jsx  # Categories icon
│   └── ...                 # Other icons
├── components/             # Reusable UI components
│   ├── AuthForm/           # Authentication forms
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   ├── ForgotPasswordForm.jsx
│   │   ├── ResetPasswordForm.jsx
│   │   └── EmailConfirmation.jsx
│   ├── Comments/           # Comment-related components
│   │   ├── Comment.jsx
│   │   ├── CommentForm.jsx
│   │   └── CommentsSection.jsx
│   ├── Common/             # Shared utility components
│   │   ├── Pagination.jsx
│   │   ├── PaginationButtons.jsx
│   │   ├── PostsPerPageSelector.jsx
│   │   ├── SortDropdown.jsx
│   │   └── ScrollToTop.jsx
│   ├── Header/             # Header components
│   │   ├── Header.jsx
│   │   ├── SearchBar.jsx
│   │   ├── NotificationBell.jsx
│   │   └── UserAvatar.jsx
│   ├── Layout/             # Layout components
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   ├── RightSidebar.jsx
│   │   └── Footer.jsx
│   ├── Posts/              # Post-related components
│   │   ├── PostCard.jsx
│   │   ├── PostList.jsx
│   │   ├── CreatePostForm.jsx
│   │   ├── GenericPostPage.jsx
│   │   ├── PostAuthorActions.jsx
│   │   ├── usePostInteractions.jsx    # Custom hook
│   │   ├── useImageModal.jsx          # Custom hook
│   │   └── useContentExpansion.jsx    # Custom hook
│   ├── Profile/            # Profile components
│   │   ├── UserPostsList.jsx
│   │   └── UserCommentsList.jsx
│   └── Users/              # User components
│       └── UserCard.jsx
├── contexts/               # React Context providers
│   ├── AuthContext.jsx     # Authentication state
│   └── SearchContext.jsx   # Search state
├── hooks/                  # Custom React hooks
│   ├── useAuth.jsx         # Hook to access AuthContext
│   ├── useFetch.jsx        # Generic data fetching hook
│   └── useDebounce.jsx     # Debounce hook for search
├── pages/                  # Page-level components (routes)
│   ├── AuthLayout.jsx      # Auth pages layout
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── ForgotPasswordPage.jsx
│   ├── ResetPasswordPage.jsx
│   ├── EmailConfirmationPage.jsx
│   ├── EmailChangeConfirmationPage.jsx
│   ├── MainPage.jsx        # Main app layout with nested routes
│   ├── HomePage.jsx        # Landing/home page
│   ├── CreatePostPage.jsx
│   ├── EditPostPage.jsx
│   ├── PostPage.jsx        # Individual post view
│   ├── CategoriesPage.jsx
│   ├── UsersPage.jsx
│   ├── ProfilePage.jsx
│   ├── EditProfilePage.jsx
│   └── NotFoundPage.jsx
├── store/                  # Redux store (optional/future use)
├── styles/                 # CSS modules
│   └── *.module.css        # Component-specific styles
├── utils/                  # Utility functions
├── App.jsx                 # Main app component with routing
├── main.jsx                # Application entry point
└── index.css               # Global styles
```

---

## Application Flow & Algorithms

### 1. Application Initialization

```
main.jsx
  ↓
Wraps App in <StrictMode>
  ↓
Renders <App />
  ↓
App.jsx sets up <Router> with routes
  ↓
Wraps app in <AuthProvider> (in main.jsx)
  ↓
AuthContext initializes:
  - Calls refreshAccessToken() on mount
  - Restores user session if refresh token valid
  - Sets loading state to false
  ↓
Routes render based on URL
```

**Key Code Flow (main.jsx):**
```javascript
ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)
```

### 2. Authentication Flow

```
User visits /auth/login
  ↓
LoginPage renders LoginForm
  ↓
User submits credentials
  ↓
LoginForm calls login() from useAuth()
  ↓
AuthContext.login() calls authApi.loginUser()
  ↓
API sends POST /api/auth/login
  ↓
Backend validates credentials
  ↓
Backend returns:
  - accessToken (short-lived, stored in memory)
  - refreshToken (long-lived, stored in httpOnly cookie)
  - user object (id, email, role)
  ↓
AuthContext updates state:
  - setAccessToken(accessToken)
  - setUser(user)
  ↓
App re-renders with authenticated state
  ↓
User redirected to /syntaxly (main page)
```

**Token Refresh Mechanism:**
```
On app load or token expiry:
  ↓
refreshAccessToken() called
  ↓
Sends refresh token from cookie to /api/auth/refresh
  ↓
Backend validates refresh token
  ↓
Returns new accessToken + user data
  ↓
AuthContext updates state
  ↓
Subsequent API calls use new accessToken
```

### 3. Routing Architecture

The app uses **nested routing** with React Router:

```
/ (root)
  ↓ redirects to /syntaxly

/syntaxly (MainPage - contains Sidebar + Outlet)
  ├── /syntaxly (HomePage - default view)
  ├── /syntaxly/home (HomePage)
  ├── /syntaxly/recent (GenericPostPage - recent posts)
  ├── /syntaxly/posts (GenericPostPage - all posts)
  ├── /syntaxly/posts/create (CreatePostPage)
  ├── /syntaxly/post/:post_id (PostPage - single post)
  ├── /syntaxly/post/:post_id/edit (EditPostPage)
  ├── /syntaxly/unanswered (GenericPostPage - unanswered filter)
  ├── /syntaxly/categories (CategoriesPage)
  ├── /syntaxly/favorites (GenericPostPage - favorites only)
  ├── /syntaxly/users (UsersPage)
  ├── /syntaxly/profile/:user_id (ProfilePage)
  └── /syntaxly/profile/edit (EditProfilePage)

/auth (AuthLayout - separate layout for auth pages)
  ├── /auth/login (LoginPage)
  ├── /auth/register (RegisterPage)
  ├── /auth/forgot-password (ForgotPasswordPage)
  ├── /auth/reset-password/:token (ResetPasswordPage)
  ├── /auth/confirm-email/:token (EmailConfirmationPage)
  └── /auth/confirm-email-change/:token (EmailChangeConfirmationPage)

* (NotFoundPage - 404 handler)
```

**Route Protection:**
- Currently, routes are not strictly protected, but components check `user` state from AuthContext
- Protected actions (create post, edit profile) check if user is authenticated
- Admin-only features check `user.role === 'admin'`

### 4. State Management

#### Global State (Context API)

**AuthContext** (`src/contexts/AuthContext.jsx`):
```javascript
State:
- user: { id, email, role, login, full_name, avatar, rating }
- accessToken: string (JWT)
- loading: boolean

Methods:
- login(credentials)
- register(credentials)
- logout()
- fetchUser(userId) // Fetch full user data
```

**SearchContext** (`src/contexts/SearchContext.jsx`):
```javascript
State:
- searchQuery: string

Methods:
- setSearchQuery(query)
```

#### Local State
- Component-specific state using `useState`
- Form state for inputs
- UI state (modals, dropdowns, etc.)

### 5. Data Fetching Pattern

**Generic Pattern (useFetch hook):**
```javascript
const [data, loading, error] = useFetch('/api/endpoint', { params })

Effect:
  ↓
Fetch data from API
  ↓
Update state with loading → data/error
  ↓
Component re-renders with data
```

**Example - Post List:**
```
PostList component mounts
  ↓
Calls useFetch('/api/posts', { page, limit, filters })
  ↓
Shows loading spinner
  ↓
API returns posts array
  ↓
Maps posts to PostCard components
  ↓
Renders list with pagination
```

### 6. Post Interaction Algorithm

**Like/Dislike Flow:**
```
User clicks like button on PostCard
  ↓
PostCard calls handleLike() from usePostInteractions hook
  ↓
Optimistic update: increment like count locally
  ↓
Send POST /api/posts/:id/like
  ↓
If success: keep optimistic update
If error: revert to original count + show error toast
  ↓
Component re-renders with updated state
```

**Favorite Flow:**
```
User clicks favorite icon
  ↓
PostCard calls handleFavorite()
  ↓
Toggle favorite state optimistically
  ↓
Send POST or DELETE /api/posts/:id/favorite
  ↓
Update local state based on response
  ↓
Show toast notification
```

### 7. Comment System Architecture

**Nested Comment Structure:**
```
CommentsSection
  ├── Fetches all comments for post
  ├── Organizes into tree structure (parent-child)
  └── Renders Comment components recursively
      ├── Comment displays content, author, actions
      ├── Can be liked/disliked
      ├── Can be edited (by author)
      ├── Can be deleted (by author/admin)
      └── Can have child comments (replies)
```

**Comment Submission:**
```
User types comment in CommentForm
  ↓
Submits form
  ↓
POST /api/comments with { post_id, content, parent_id? }
  ↓
Backend creates comment
  ↓
Frontend refreshes comments list
  ↓
New comment appears in UI
```

### 8. Notification System

**Notification Flow:**
```
User subscribes to a post
  ↓
POST /api/posts/:id/subscribe
  ↓
Post is updated by author
  ↓
Backend creates notification for all subscribers
  ↓
Frontend polls or checks for new notifications
  ↓
NotificationBell shows unread count
  ↓
User clicks notification bell
  ↓
Dropdown shows notification list
  ↓
User clicks "View Post" or "Delete"
  ↓
Notification removed from list
```

### 9. Image Upload Algorithm

**Create Post with Images:**
```
User fills out CreatePostForm
  ↓
User selects images (up to 10)
  ↓
Images previewed locally using FileReader
  ↓
User submits form
  ↓
FormData created with:
  - title, content, categories
  - images[] array
  ↓
POST /api/posts with multipart/form-data
  ↓
Backend stores images in filesystem
  ↓
Returns post with image URLs
  ↓
User redirected to new post page
  ↓
Images displayed in PostCard
```

### 10. Pagination Algorithm

```
User on page 1 of posts
  ↓
PostList renders with page=1, limit=10
  ↓
Fetches /api/posts?page=1&limit=10
  ↓
Displays posts 1-10
  ↓
Pagination component shows: [1] 2 3 ... 10
  ↓
User clicks page 2
  ↓
URL updates to ?page=2
  ↓
useEffect triggers refetch
  ↓
Fetches /api/posts?page=2&limit=10
  ↓
Displays posts 11-20
  ↓
Scroll to top (ScrollToTop component)
```

---

## Key Implementation Patterns

### 1. Custom Hooks

**useAuth** - Access authentication context
```javascript
const { user, accessToken, login, logout } = useAuth()
```

**useFetch** - Generic data fetching
```javascript
const [posts, loading, error] = useFetch('/api/posts', { page: 1 })
```

**useDebounce** - Debounce search input
```javascript
const debouncedSearch = useDebounce(searchTerm, 500)
```

**usePostInteractions** - Post actions (like, favorite, subscribe)
```javascript
const { handleLike, handleFavorite, handleSubscribe } = usePostInteractions(post)
```

### 2. Component Composition

**Reusable Components:**
- `PostCard` - Used in PostList, HomePage, ProfilePage
- `Pagination` - Used in all list views
- `GenericPostPage` - Template for different post views
- `Layout` - Wraps all main pages with header/footer

**Higher-Order Pattern:**
```
Layout (Header + Footer)
  └── MainPage (Sidebar + Content Area)
      └── Outlet (Nested Route Content)
          └── HomePage / PostPage / etc.
```

### 3. API Integration

All API calls go through dedicated service functions:

```javascript
// authApi.js
export async function loginUser(credentials) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    credentials: 'include',
  })
  return await response.json()
}
```

**API Call Pattern:**
1. Component calls service function
2. Service function sends HTTP request
3. Backend responds with JSON
4. Service function returns data
5. Component updates state
6. UI re-renders

### 4. Error Handling

**Try-Catch Pattern:**
```javascript
try {
  const data = await apiCall()
  setData(data)
  toast.success('Success!')
} catch (error) {
  console.error(error)
  toast.error(error.message || 'An error occurred')
}
```

**Toast Notifications:**
- Success: Green toast with success message
- Error: Red toast with error message
- Info: Blue toast with information

### 5. Responsive Design

**CSS Approach:**
- Mobile-first design
- CSS Grid for layouts
- Flexbox for components
- Media queries for breakpoints
- CSS modules for scoping

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## Technology Stack

### Core Libraries
- **React 19.1.1** - UI library with latest features
- **React Router DOM 7.9.3** - Client-side routing
- **Vite 7.1.7** - Fast build tool and dev server

### State Management
- **React Context API** - Global state (auth, search)
- **useState/useEffect** - Local component state
- **Redux Toolkit 2.9.2** - Optional (not currently used)

### UI & Styling
- **CSS Modules** - Component-scoped styles
- **React Hot Toast 2.6.0** - Toast notifications
- **Custom CSS** - Dark theme with purple accents

### Development Tools
- **ESLint 9.36.0** - Code linting
- **Vite Plugin React** - Fast Refresh for React

### API Communication
- **Fetch API** - Native browser API for HTTP requests
- **FormData** - Multipart file uploads

---

## API Endpoints Used

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/confirm-email/:token` - Confirm email

### Posts
- `GET /api/posts` - Get all posts (with pagination, filters)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PATCH /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/dislike post
- `POST /api/posts/:id/favorite` - Favorite post
- `DELETE /api/posts/:id/favorite` - Unfavorite post
- `POST /api/posts/:id/subscribe` - Subscribe to post
- `DELETE /api/posts/:id/subscribe` - Unsubscribe from post

### Comments
- `GET /api/posts/:post_id/comments` - Get post comments
- `POST /api/comments` - Create comment
- `PATCH /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/like` - Like/dislike comment

### Users
- `GET /api/users/:id` - Get user profile
- `PATCH /api/users/:id` - Update user profile
- `GET /api/users` - Get all users (with pagination)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (admin)
- `PATCH /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Notifications
- `GET /api/notifications` - Get user notifications
- `DELETE /api/notifications` - Delete all notifications
- `DELETE /api/notifications/posts/:post_id` - Delete notification

---

## Security Considerations

### Authentication Security
- **httpOnly cookies** for refresh tokens (prevents XSS attacks)
- **Access tokens** stored in memory (not localStorage)
- **CSRF protection** via SameSite cookies
- **Token expiration** with automatic refresh

### Input Validation
- Frontend validation for forms
- Backend validation via Zod schemas
- XSS prevention through React's automatic escaping

### Authorization
- Role-based access control (user/admin)
- Component-level permission checks
- API endpoint protection on backend

---

## Author
- **Name:** Rostyslav Bryhynets
- **Project:** USOF Frontend — React SPA for Q&A Platform
- **GitHub:** [RofaBR](https://github.com/RofaBR)