# USOF Frontend

A modern, responsive Q&A platform frontend inspired by StackOverflow, built with React and Vite.

## Description

USOF Frontend is a single-page application (SPA) that provides an intuitive user interface for a Question & Answer platform. Users can create posts, comment, vote, manage favorites, and interact with a vibrant community. The application features a clean, dark-themed UI with smooth animations and real-time notifications.

### Key Features
- User authentication (login, registration, password reset, email confirmation)
- Post creation, editing, and management with image upload support
- Commenting system with nested replies
- Like/dislike functionality for posts and comments
- Favorite posts management
- User profiles with activity tracking
- Real-time notification system
- Advanced search and filtering
- Category-based organization
- Pagination and sorting options
- Responsive design for all screen sizes

## Requirements and Dependencies

### System Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Modern web browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### Backend Requirement
This frontend application requires the USOF Backend API to be running. See the backend README in `../UsofB/` for setup instructions.

### Key Dependencies
- **React**: ^19.1.1 - UI library
- **React Router DOM**: ^7.9.3 - Client-side routing
- **React Hot Toast**: ^2.6.0 - Toast notifications
- **Redux Toolkit**: ^2.9.2 - State management (optional, for advanced state)
- **Vite**: ^7.1.7 - Build tool and dev server

### Development Dependencies
- **ESLint**: ^9.36.0 - Code linting
- **@vitejs/plugin-react**: ^5.0.3 - Vite React plugin

## How to Run the Solution

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd USOF/UsofF
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup
The frontend is configured to proxy API requests to `http://localhost:8080` (see `vite.config.js`).

Ensure the backend is running on port 8080 before starting the frontend. If your backend runs on a different port, update the proxy configuration in `vite.config.js`:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:YOUR_PORT',
      changeOrigin: true,
    }
  }
}
```

### Step 4: Start the Development Server
```bash
npm run dev
```

The application will start on `http://localhost:5173` by default.

### Step 5: Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```

You will be redirected to `/syntaxly` which is the main application route.

## Available Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint to check code quality
npm run lint
```

## Project Structure

```
UsofF/
├── src/
│   ├── api/              # API service layer
│   ├── assets/           # Icons and static assets
│   ├── components/       # Reusable UI components
│   │   ├── AuthForm/     # Authentication forms
│   │   ├── Comments/     # Comment components
│   │   ├── Common/       # Shared components (pagination, etc.)
│   │   ├── Header/       # Header, search, notifications
│   │   ├── Layout/       # Layout components (sidebar, footer)
│   │   ├── Posts/        # Post-related components
│   │   ├── Profile/      # User profile components
│   │   └── Users/        # User list components
│   ├── contexts/         # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page-level components
│   ├── store/            # Redux store (if used)
│   ├── styles/           # CSS modules
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main app component with routing
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles
├── public/               # Public static files
├── docs/                 # Documentation
├── vite.config.js        # Vite configuration
├── package.json          # Project dependencies
└── README.md             # This file
```

## Technology Stack

- **React 19** - Component-based UI framework
- **Vite** - Fast build tool and development server
- **React Router DOM** - Declarative routing for React
- **Context API** - State management for authentication and search
- **React Hot Toast** - Beautiful toast notifications
- **CSS Modules** - Scoped component styling
- **ESLint** - Code quality and consistency

## Documentation

For comprehensive documentation including:
- CBL progress stages
- Architecture details
- Component hierarchy
- State management patterns
- API integration guide

Please refer to [DOCUMENTATION.md](./docs/DOCUMENTATION.md)

## Backend Integration

This frontend connects to the USOF Backend API. Ensure you have:
1. Backend server running on `http://localhost:8080`
2. Database initialized and populated
3. Environment variables configured in the backend

See `../UsofB/README.md` for backend setup instructions.

## Author

- **Name:** Rostyslav Bryhynets
- **Project:** USOF Frontend - Q&A Platform UI
- **GitHub:** [RofaBR](https://github.com/RofaBR)

## License

This project is part of an educational assignment.