# 🐾 Pawsitive - Pet Adoption Platform

A modern, responsive web application for pet adoption built with Next.js, TypeScript, and Tailwind CSS. This platform connects loving families with pets in need of homes through an intuitive and beautiful interface.

## 🌟 Features

### Current Features (Phase 1-5 Complete ✅)
- ✅ **Beautiful Landing Page**: Modern, responsive design with animations
- ✅ **Pet Browsing**: Comprehensive grid view of available pets with search and filtering
- ✅ **Pet Details**: Individual pet pages with detailed information and adoption calls-to-action
- ✅ **Advanced Search**: Real-time search by name, breed, or description
- ✅ **Smart Filtering**: Filter pets by size, age, and type with collapsible interface
- ✅ **Pagination**: Navigate through multiple pages of pet results
- ✅ **Favorites System**: Heart button to favorite pets (client-side)
- ✅ **API Integration**: Connected to Noroff API v2 for pet data
- ✅ **TypeScript**: Full type safety throughout the application
- ✅ **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ✅ **Modern UI**: Built with Tailwind CSS and Lucide React icons
- ✅ **Accessibility**: WCAG 2.1 AA compliant with screen reader support
- ✅ **Admin Authentication**: Secure login and registration system with Noroff API
- ✅ **Protected Routes**: Middleware-based route protection for admin areas
- ✅ **Session Management**: Secure session handling with encrypted cookies **[WORKING ✅]**
- ✅ **Admin Dashboard**: Statistics overview and pet management interface
- ✅ **Pet Management**: Full CRUD operations for creating, editing, and deleting pets
- ✅ **Form Validation**: Comprehensive form validation with error handling
- ✅ **Image Upload**: Pet image management with preview functionality
- ✅ **Share Functionality**: Share specific pets with potential adopters via clipboard API
- ✅ **Advanced Filtering**: Filter pets by location and special needs

### Documentation & Testing Completed
- ✅ **Comprehensive Testing**: W3C validation, Lighthouse audits, WAVE accessibility testing
- ✅ **Project Planning**: Detailed Kanban and Gantt chart documentation
- ✅ **Deployment Ready**: Static hosting configuration for Vercel, Netlify, GitHub Pages

### 🔧 Recent Fixes & Improvements
- ✅ **Session Error Resolution**: Fixed session secret key mismatch issues
- ✅ **Environment Configuration**: Properly configured `.env.local` with secure session secrets
- ✅ **Authentication Flow**: Verified complete login/registration workflow functionality
- ✅ **Session Persistence**: Confirmed 7-day session persistence with proper encryption/decryption

### Future Enhancements (Optional)
- 💡 **User Accounts**: Save favorites and adoption history
- 💡 **Advanced Analytics**: User behavior tracking and insights

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API**: [Noroff API v2](https://docs.noroff.dev/docs/v2/basic/pets)
- **Authentication**: Custom session management with encrypted cookies
- **Deployment**: [Vercel](https://vercel.com/) ready

## 📁 Project Structure

```
pawsitive/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with navigation
│   │   ├── page.tsx                # Landing page
│   │   ├── globals.css             # Global styles with custom utilities
│   │   ├── admin/                  # Admin-only pages (protected)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx        # Admin dashboard with statistics
│   │   │   └── pets/
│   │   │       ├── page.tsx        # Pet management overview
│   │   │       ├── new/
│   │   │       │   └── page.tsx    # Create new pet form
│   │   │       └── [id]/
│   │   │           └── page.tsx    # Edit pet form
│   │   ├── api/                    # API routes
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts    # Login endpoint
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.ts    # Logout endpoint
│   │   │   │   └── register/
│   │   │   │       └── route.ts    # Registration endpoint
│   │   │   └── pets/
│   │   │       ├── route.ts        # Pet CRUD operations
│   │   │       └── [id]/
│   │   │           └── route.ts    # Individual pet operations
│   │   ├── auth/                   # Authentication pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx        # Admin login form
│   │   │   ├── register/
│   │   │   │   └── page.tsx        # Admin registration form
│   │   │   └── unauthorized/
│   │   │       └── page.tsx        # Access denied page
│   │   └── pets/
│   │       ├── page.tsx            # Pet browsing page with search & filters
│   │       └── [id]/
│   │           └── page.tsx        # Individual pet detail page
│   ├── components/                 # Reusable React components
│   │   ├── DeletePetButton.tsx     # Pet deletion with confirmation
│   │   ├── LogoutButton.tsx        # Secure logout functionality
│   │   ├── PetForm.tsx             # Create/edit pet form
│   │   └── index.ts                # Component exports
│   └── lib/
│       ├── api.ts                  # API utilities and types
│       ├── auth.ts                 # Authentication helpers
│       ├── session.ts              # Session management
│       └── styles.ts               # Shared styling utilities
├── middleware.ts                   # Route protection middleware
├── public/                         # Static assets
├── package.json                   # Dependencies and scripts
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
├── .env.example                   # Environment variables template
├── README.md                      # Project documentation
├── TESTING.md                     # Comprehensive testing documentation
├── PROJECT-PLANNING.md            # Kanban board and Gantt chart documentation
└── DEPLOYMENT.md                  # Static hosting deployment guide
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hallotre/pawsitive
   cd pawsitive
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   ```
   
   **Edit `.env.local` and add the required values:**
   ```env
   # Noroff API Configuration
   NEXT_PUBLIC_API_BASE_URL=https://v2.api.noroff.dev
   API_BEARER_TOKEN=your_bearer_token_here
   API_KEY=your_api_key_here
   
   # Session Management (CRITICAL - create your own secure random string)
   SESSION_SECRET=your_super_secret_session_key_here_change_in_production
   ```
   
   **🔑 How to get Noroff API credentials:**
   - Register at [Noroff API](https://docs.noroff.dev/)
   - Get your `API_BEARER_TOKEN` and `API_KEY` from your account dashboard
   
   **🔒 How to create SESSION_SECRET:**
   - **IMPORTANT**: Create a unique, secure random string (32+ characters)
   - Example format: `your-app-name-secret-key-random-string-xyz789`
   - **Never share this secret** - it encrypts all user sessions
   - Change it in production for maximum security

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### 🚨 Troubleshooting

**Session Issues:**
If you encounter "Invalid session: secret key mismatch" errors:
1. Ensure your `.env.local` file has the correct `SESSION_SECRET`
2. Clear browser cookies for localhost:3000
3. Restart the development server: `npm run dev`

**Environment Issues:**
- Verify `.env.local` is in the project root directory
- Check that all environment variables are set correctly
- Restart the server after changing environment variables

**Testing Admin vs User Access:**
1. **Create Regular User**: Register with `venueManager: false` (checkbox unchecked)
   - Can access: `/`, `/pets`, `/pets/[id]`
   - Cannot access: `/admin/*` routes (redirects to `/auth/unauthorized`)

2. **Create Admin User**: Register with `venueManager: true` (checkbox checked)
   - Can access: All public routes + `/admin/dashboard`, `/admin/pets/*`
   - Has full pet management capabilities

3. **Test Route Protection**: Try accessing `/admin/dashboard` without admin role to see protection in action

## 🎨 Design System

### Color Palette
- **Primary**: Orange (#F97316) - Warm and friendly
- **Secondary**: Pink (#EC4899) - Playful and caring
- **Accent**: Yellow (#EAB308) - Cheerful and optimistic
- **Neutral**: Gray shades for text and backgrounds

### Typography
- **Headings**: Geist Sans (bold weights)
- **Body**: Geist Sans (regular weights)
- **Code**: Geist Mono

### Components
- Rounded corners for friendly feel
- Hover animations for interactivity
- Consistent spacing using Tailwind's scale
- Accessible color contrasts (WCAG compliant)

## 🔌 API Integration

The application integrates with the Noroff API v2 for pet data management:

- **Base URL**: `https://v2.api.noroff.dev`
- **Authentication**: Bearer token and API key (stored in environment variables)
- **Public Endpoints**: 
  - `GET /pets` - Browse all pets (no auth required)
  - `GET /pets/:id` - View individual pet details
- **Protected Endpoints**:
  - `POST /pets` - Create new pet (admin only)
  - `PUT /pets/:id` - Update pet information (admin only)
  - `DELETE /pets/:id` - Remove pet (admin only)
  - `POST /auth/login` - Admin authentication
  - `POST /auth/register` - Admin registration

### 🔒 Security & Session Management

- **API Authentication**: Noroff API credentials stored securely in environment variables
- **Session Management**: Custom encrypted session system using `SESSION_SECRET`
- **Route Protection**: Middleware-based protection for admin routes
- **Environment Security**: All sensitive data in `.env.local` (never committed to git)
- **Session Encryption**: User sessions encrypted with your own secret key
- **Automatic Logout**: Sessions expire after 7 days for security

### 👥 Admin/User Role System Workaround

Since the Noroff API uses `venueManager` boolean field but our application needs `admin`/`user` roles, we implemented a mapping system:

**How it works:**
1. **Registration**: Users can register with `venueManager: true` or `venueManager: false`
2. **Role Mapping**: 
   - `venueManager: true` → `role: 'admin'` (can access `/admin/*` routes)
   - `venueManager: false` → `role: 'user'` (regular user, no admin access)
3. **Session Storage**: The mapped role is stored in the encrypted session cookie
4. **Route Protection**: Middleware checks the `role` field to protect admin routes

**Code Implementation:**
```typescript
// In session.ts - Role mapping during session creation
const role = venueManager ? 'admin' : 'user'
const sessionPayload = { userId, email, role, expiresAt }

// In middleware.ts - Route protection
if (path.startsWith('/admin') && session?.role !== 'admin') {
  return NextResponse.redirect(new URL('/auth/unauthorized', req.nextUrl))
}
```

**User Registration Options:**
- **Regular User**: Register with `venueManager: false` → Can browse pets, use public features
- **Admin User**: Register with `venueManager: true` → Full admin access to pet management

**Admin Features (venueManager: true only):**
- `/admin/dashboard` - Statistics and overview
- `/admin/pets` - Pet management (create, edit, delete)
- `/admin/pets/new` - Add new pets
- `/admin/pets/[id]` - Edit existing pets


## 🐾 Pet Browsing Features

### Main Pet Listing Page (`/pets`)
- **Responsive Grid**: Displays pets in a 1-4 column grid based on screen size
- **Search Functionality**: Real-time search with debounced API calls
- **Advanced Filtering**: 
  - Size: Small, Medium, Large
  - Age: Young (0-2), Adult (3-7), Senior (8+)
  - Type: Dogs, Cats, Rabbits, Birds
- **Pagination**: Navigate through multiple pages with smooth scrolling
- **Loading States**: Skeleton animations while data loads
- **Error Handling**: User-friendly error messages with retry options
- **Favorites**: Heart button to mark pets as favorites (client-side)

### Individual Pet Pages (`/pets/[id]`)
- **Detailed Information**: Comprehensive pet profiles with images
- **Care Requirements**: Exercise needs, living space, experience level
- **Adoption Call-to-Action**: Clear contact information and adoption process
- **Related Pets**: Suggestions for similar pets
- **Accessibility**: Full keyboard navigation and screen reader support

### Custom React Hooks
- **`usePets()`**: Data fetching with search, pagination, and error handling
- **`usePet()`**: Individual pet data fetching with loading states
- Both hooks include proper cleanup to prevent race conditions

## 🔐 Admin Authentication & Management

### Authentication System
- **Hybrid Authentication**: Combines Noroff API validation with local session management
- **Secure Login**: Admin credentials validated against Noroff API
- **Session Persistence**: Users stay logged in across browser sessions (7-day expiry)
- **Route Protection**: Middleware automatically protects admin routes
- **Unauthorized Handling**: Clear feedback and redirects for access attempts

### Admin Dashboard (`/admin/dashboard`)
- **Statistics Overview**: Real-time pet counts and adoption metrics
- **Quick Actions**: Direct access to pet management functions
- **Recent Activity**: Display of recently added or updated pets
- **Responsive Layout**: Works seamlessly on all device sizes

### Pet Management System (`/admin/pets`)
- **Complete CRUD Operations**: Create, read, update, and delete pets
- **Form Validation**: Comprehensive validation with helpful error messages
- **Image Management**: Upload and preview pet images
- **Bulk Operations**: Manage multiple pets efficiently
- **Confirmation Dialogs**: Prevent accidental deletions with confirmation modals

### Security Features
- **Encrypted Sessions**: All session data encrypted with `SESSION_SECRET`
- **Protected API Routes**: Admin-only endpoints secured with authentication checks
- **Secure Logout**: Complete session cleanup on logout
- **CSRF Protection**: Built-in protection against cross-site request forgery

## 🏗️ Development Roadmap

### Phase 1: Foundation ✅
- [x] Project setup with Next.js and TypeScript
- [x] Tailwind CSS configuration
- [x] API utilities and types
- [x] Landing page design
- [x] Navigation and layout structure

### Phase 2: Pet Browsing ✅
- [x] Pet listing page with responsive grid layout
- [x] Advanced search functionality with real-time filtering
- [x] Filter system (size, age, type) with collapsible interface
- [x] Individual pet detail pages with comprehensive information
- [x] Pagination with smooth navigation
- [x] Loading states with skeleton animations
- [x] Error handling with user-friendly messages
- [x] Favorites system with heart button interactions
- [x] Accessibility improvements (WCAG 2.1 AA compliant)

### Phase 3: Authentication & Admin ✅
- [x] User authentication system with Noroff API integration
- [x] Admin login and registration pages
- [x] Protected routes for admin features

### Phase 4: Pet Management ✅
- [x] Admin dashboard with statistics and overview
- [x] Create pet form with validation
- [x] Edit pet functionality with pre-populated data
- [x] Delete pet with confirmation modal

### Phase 5: Advanced Features ✅
- [x] Share functionality with clipboard API
- [x] User accounts with saved favorites
- [x] Advanced filtering (location, special needs)

### Phase 6: Polish & Deploy
- [ ] Performance optimizations
- [ ] SEO improvements
- [ ] Analytics integration
- [ ] Deployment to Vercel

## 🧪 Testing Strategy

- **HTML Validation**: W3C Markup Validator
- **Accessibility**: WAVE accessibility checker
- **Performance**: Lighthouse audits
- **Manual Testing**: Cross-browser and device testing

## 📱 Responsive Design

The application is designed mobile-first with breakpoints:
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px and above

## ♿ Accessibility

The application is built with accessibility as a priority, meeting WCAG 2.1 AA standards:

- **Semantic HTML**: Proper heading hierarchy and landmark elements
- **ARIA Labels**: Descriptive labels for all interactive elements
- **Keyboard Navigation**: Full keyboard support with visible focus indicators
- **Color Contrast**: High contrast ratios for all text and interactive elements
- **Screen Reader Support**: Comprehensive screen reader compatibility
- **Focus Management**: Logical tab order and focus states
- **Interactive Elements**: Proper button and link accessibility
- **Form Controls**: Accessible form labels and error messages
- **Image Alt Text**: Descriptive alternative text for all images
- **State Announcements**: Clear communication of dynamic content changes

## 🎯 User Stories

### Public Users
- ✅ As a user, I want to view an attractive landing page that explains the service
- ✅ As a user, I want to browse available pets in a responsive grid layout
- ✅ As a user, I want to search for pets by name, breed, or description in real-time
- ✅ As a user, I want to filter pets by size, age, and type to find my perfect match
- ✅ As a user, I want to view detailed information about a specific pet including care requirements
- ✅ As a user, I want to favorite pets I'm interested in for easy reference
- ✅ As a user, I want to navigate through multiple pages of pet results
- ✅ As a user, I want to easily contact the shelter about adopting a specific pet
- ✅ As a user, I want to share a pet's page with others

### Admin Users
- ✅ As an admin, I want to log in securely to manage pets
- ✅ As an admin, I want to add new pets to the system with comprehensive forms
- ✅ As an admin, I want to edit existing pet information easily
- ✅ As an admin, I want to remove pets with confirmation to prevent accidents
- ✅ As an admin, I want to see dashboard statistics and overview of all pets
- ✅ As an admin, I want my session to remain secure and expire appropriately

## 📄 License

This project is part of a course assignment and is for educational purposes. 