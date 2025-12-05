# Recipito Angular Frontend

This is the Angular version of the Recipito recipe sharing application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. The app is configured to run **WITHOUT a backend** using mock data by default.

3. Run the development server:
```bash
npm start
```

The app will be available at `http://localhost:4200`.

## Running Without Backend

The app is configured to use **mock data** by default. This means:
- ✅ No backend connection required
- ✅ Mock authentication (auto-logged in as demo user)
- ✅ Mock recipe data
- ✅ Mock user data
- ✅ All features work offline

### To Switch to Real Backend:

1. Edit `src/app/services/api.service.ts` and set `USE_MOCK_DATA = false`
2. Edit `src/app/services/auth.service.ts` and set `USE_MOCK_AUTH = false`
3. Update `src/environments/environment.ts` with your API URL
4. Make sure your backend is running

## Project Structure

- `src/app/components/` - All page components
- `src/app/services/` - Services for API calls and authentication
  - `api.service.ts` - Main API service (with mock data option)
  - `auth.service.ts` - Authentication service (with mock auth option)
  - `mock-data.service.ts` - Mock data for offline development
- `src/app/components/layout/` - Layout components (Navbar, Sidebar, MainLayout)

## Pages Converted

- ✅ Home - Recipe feed with search and tabs
- ✅ Recipe Detail - Individual recipe view
- ✅ Create Recipe - Recipe creation form
- ✅ Explore Users - User exploration page
- ✅ User Profile - User profile with recipes
- ✅ Login - Authentication page (works with mock auth)
- ✅ Register - Registration page (works with mock auth)
- ✅ Not Found - 404 page

## Mock Data

The app includes mock data for:
- 3 sample recipes
- 3 sample users
- Mock authentication (auto-login)

## Development

- Run `ng serve` for a dev server
- Navigate to `http://localhost:4200/`
- The app will automatically reload if you change any source files

## Note

This is a basic conversion from React to Angular. You may need to:
1. Create child components (RecipeCard, RecipeDetailHeader, etc.) - currently simplified in templates
2. Add proper error handling
3. Implement proper loading states
4. Add form validation messages
5. Style components to match the original design
