# 🍽️ Recipe API - Full Stack Recipe Management Application

A modern, responsive recipe discovery and management platform built with React 19, Redux Toolkit Query, and Tailwind CSS. Features user authentication, recipe CRUD operations, and advanced search/filtering capabilities.

## ✨ Features

### 🔍 **Landing Page**
- **Hero Section** with prominent search functionality
- **Recipe Discovery Section** with pagination and search
- **Category Browse** with visual category cards
- **Recipe Grid** displaying recipes from DummyJSON API
- **Statistics Dashboard** showing total recipes, average prep time, and ratings
- **Responsive Design** optimized for all devices

### 🔐 **Authentication**
- User login via DummyJSON authentication endpoint
- Token-based authentication with secure storage
- Automatic user profile fetching upon login
- Protected routes for authenticated users only
- Session persistence with localStorage
- Logout functionality with state cleanup

### 📋 **Dashboard**
- **Recipe Management** - Complete CRUD operations
  - **Create**: Add new recipes with full details
  - **Read**: View all recipes in a responsive table
  - **Update**: Edit existing recipes with real-time form validation
  - **Delete**: Remove recipes with confirmation dialog
- **Search & Filter** functionality across recipe name and cuisine
- **Sorting** by name, rating, prep time, cook time, or calories
- **Ascending/Descending** order controls
- **Clean Pagination** with modern UI design
- **Validation**: Client-side validation with error messages
- **Visual Feedback**: Toast notifications for all operations

### 🎯 **Search & Discovery**
- **Full-Text Search** across recipe names and cuisines
- **Real-Time Search** with debouncing
- **Sort Options**:
  - Name (A-Z)
  - Rating (highest/lowest)
  - Prep Time (shortest/longest)
  - Cook Time (shortest/longest)
  - Calories (lowest/highest)
- **Advanced Pagination** with page navigation and size controls
- **URL-based Search** - Share search queries via URL parameters

### 💾 **Data Management**
- **Hybrid Data Source**: Combines DummyJSON API with localStorage
- **Create Operations**: Save new recipes to localStorage
- **Update Operations**: Sync changes to localStorage
- **Delete Operations**: Soft delete tracking with restoration support
- **Smart Merging**: Seamlessly blends API data with local data

## 🛠️ Technologies Used

### Frontend Framework
- **React 19.2.0** - Latest React with hooks and concurrent features
- **React Router DOM 7.12.0** - Modern client-side routing
- **React Redux 9.2.0** - State management bindings

### State Management
- **Redux Toolkit 2.11.2** - Modern Redux with RTK Query
- **RTK Query** - Powerful server state management
  - Automatic caching and synchronization
  - Optimistic updates
  - Real-time query invalidation

### UI & Styling
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Tailwind CSS Vite Plugin** - Optimized build integration
- **Lucide React 0.562** - Beautiful SVG icons (20+ used)
- **clsx & tailwind-merge** - Conditional class utilities

### Notifications & UX
- **React Hot Toast 2.6.0** - Non-intrusive toast notifications
- **Custom Components**: Reusable UI components with proper abstractions

### Build Tools
- **Vite 7.2.4** - Lightning-fast build tool
- **TypeScript 5.9.3** - Strong type safety
- **SWC Compiler** - Fast transpilation

### Development Tools
- **ESLint** - Code quality and consistency
- **ESLint Plugin React Hooks** - React hooks best practices
- **ESLint Plugin React Refresh** - Fast refresh support

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/                  # Authentication components
│   │   ├── LoginModal.tsx
│   │   └── ProtectedRoute.tsx
│   ├── common/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── Loader.tsx
│   ├── dashboard/             # Dashboard components
│   │   ├── RecipesManager.tsx
│   │   ├── RecipeForm.tsx
│   │   ├── RecipeModal.tsx
│   │   └── ModernDashboard.tsx
│   ├── landing/               # Landing page components
│   │   ├── Hero.tsx
│   │   ├── RecipeGrid.tsx
│   │   └── Footer.tsx
│   └── layout/                # Layout components
│       └── Header.tsx
├── features/
│   ├── auth/                  # Authentication RTK Query
│   │   ├── authApi.ts
│   │   └── authSlice.ts
│   └── recipes/               # Recipes RTK Query
│       └── recipeApi.ts
├── hooks/
│   └── useAuth.ts            # Custom auth hook
├── pages/
│   ├── LandingPage.tsx       # Public landing page
│   ├── DashboardPage.tsx     # Protected dashboard
│   └── LoginPage.tsx         # Login page
├── store/
│   ├── store.ts              # Redux store configuration
│   └── hooks.ts              # Redux hooks
├── types/
│   └── index.ts              # TypeScript type definitions
├── utils/
│   └── [utility files]       # Helper functions
├── App.tsx                   # Main app component with routing
└── main.tsx                  # React entry point
```

## 🔑 Key Path Aliases

```typescript
@/components    // UI components
@/features      // Redux Toolkit Query features
@/hooks         // Custom React hooks
@/pages         // Page components
@/store         // Redux store
@/types         // TypeScript types
@/utils         // Utility functions
@/assets        // Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Recipe-API
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment (if needed)**
```bash
# Create .env.local file (if using environment variables)
VITE_API_URL=https://dummyjson.com
```

4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm preview
```

### Linting
```bash
npm run lint
```

## 📖 Usage Guide

### For Users
1. **Browse Recipes**: Visit landing page to explore recipes
2. **Search**: Use the hero search to find specific recipes
3. **Sort & Filter**: Use dashboard sorting controls
4. **Login**: Click "Get Started" or login for full features

### For Authenticated Users
1. **Create Recipe**: Click "Add Recipe" button
2. **Edit Recipe**: Click edit icon on any recipe row
3. **Delete Recipe**: Click delete icon and confirm
4. **View Details**: Click view icon for full recipe details
5. **Search & Sort**: Use search bar and sort controls

## 🔒 Authentication

### Login Credentials (DummyJSON)
Use any of these test credentials or create your own:
- Username: `emilys` / Password: `emilyspass`
- Username: `michaelw` / Password: `michaelwpass`
- Username: `sophiab` / Password: `sophiabpass`

### How Authentication Works
1. User submits login form
2. DummyJSON API returns access token
3. Token stored in Redux state and localStorage
4. User profile fetched automatically via `/auth/me` endpoint
5. Dashboard protected routes enabled
6. Token included in all authenticated requests

## 🌐 API Integration

### DummyJSON Endpoints Used

#### Authentication
- **POST** `/auth/login` - User authentication
- **GET** `/auth/me` - Fetch current user profile (requires token)

#### Recipes
- **GET** `/recipes` - Fetch recipes with pagination
- **GET** `/recipes?sortBy=name&order=asc` - Sorted recipes
- **GET** `/recipes?q=search` - Search recipes
- **GET** `/recipes/:id` - Fetch single recipe

### Custom Implementation
- **CREATE**: Stored in localStorage
- **UPDATE**: Stored in localStorage with merge logic
- **DELETE**: Soft delete tracking in localStorage

## 💡 Advanced Features

### Smart Data Management
- Seamlessly merges DummyJSON recipes with localStorage
- Prevents ID collisions with `api_` prefix for DummyJSON recipes
- Tracks deleted recipes to prevent re-fetching
- Optimistic updates for instant UI feedback

### Form Validation
- Real-time validation with error display
- Required field indicators
- Custom validation rules:
  - Recipe name: 3-100 characters
  - Cuisine: 2+ characters
  - Times: 1-1440 minutes
  - Servings: 1-100
  - Calories: 1-10000

### User Experience
- Professional confirmation dialogs for destructive actions
- Toast notifications for all operations
- Loading states with spinners
- Error boundaries and fallbacks
- Responsive design for mobile/tablet/desktop
- Keyboard shortcuts support

## 📊 Data Flow

```
User Input
    ↓
React Component
    ↓
Redux Action/RTK Query
    ↓
API Call (DummyJSON)
    ↓
LocalStorage (for CRUD)
    ↓
Cache Update
    ↓
UI Re-render
```

## 🎨 Design System

### Color Scheme
- Primary: Orange/Pink gradient
- Neutral: Gray scale for text/backgrounds
- Accent: Blue for interactive elements
- Status: Green (success), Red (error), Yellow (warning)

### Components
- Reusable button, input, select, modal components
- Custom hooks for authentication and forms
- Consistent spacing and typography
- Dark/light mode ready styling

## 🔄 State Management Flow

### Authentication State
```typescript
{
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,
  isLoading: boolean
}
```

### Recipes State
```typescript
{
  recipes: Recipe[],
  total: number,
  skip: number,
  limit: number,
  isLoading: boolean
}
```

## 🚨 Error Handling

- API errors caught and displayed as toast notifications
- Form validation errors shown inline
- Network errors handled gracefully
- Fallback to localStorage on API failure
- Console logging for debugging

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 📞 Support

For issues, questions, or suggestions:
1. Check existing issues
2. Create a new issue with detailed description
3. Include browser/OS information
4. Provide steps to reproduce

## 🎯 Future Enhancements

- [ ] Recipe rating and reviews system
- [ ] Favorite/bookmark recipes
- [ ] Recipe sharing functionality
- [ ] Ingredient availability checker
- [ ] Nutrition calculator
- [ ] Meal planning feature
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Recipe recommendation engine
- [ ] User profile customization

## 📚 Documentation

For more detailed documentation on specific features:
- [Authentication Flow](./docs/AUTHENTICATION.md)
- [API Integration](./docs/API.md)
- [Component Guide](./docs/COMPONENTS.md)
- [Redux Setup](./docs/REDUX.md)

---

**Built with ❤️ using React, Redux Toolkit, and Tailwind CSS**

Last Updated: January 18, 2026
