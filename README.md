# 🐾 Pawsitive - Pet Adoption Platform

A modern, responsive web application for pet adoption built with Next.js, TypeScript, and Tailwind CSS. This platform connects loving families with pets in need of homes through an intuitive and beautiful interface.

## 🌟 Features

### Current Features (Phase 1 & 2)
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

### Planned Features (Future Phases)
- 🔄 **Admin Dashboard**: Pet management for authorized users
- 🔄 **Authentication**: Secure login and registration system
- 🔄 **Pet Management**: Create, edit, and delete pet listings
- 🔄 **Share Functionality**: Share specific pets with potential adopters
- 🔄 **User Accounts**: Save favorites and adoption history

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API**: [Noroff API v2](https://docs.noroff.dev/docs/v2/basic/pets)
- **Deployment**: [Vercel](https://vercel.com/) (planned)

## 📁 Project Structure

```
pawsitive/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with navigation
│   │   ├── page.tsx            # Landing page
│   │   ├── globals.css         # Global styles with custom utilities
│   │   └── pets/
│   │       ├── page.tsx        # Pet browsing page with search & filters
│   │       └── [id]/
│   │           └── page.tsx    # Individual pet detail page
│   └── lib/
│       └── api.ts              # API utilities and types
├── public/                     # Static assets
├── package.json               # Dependencies and scripts
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
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
   
   # Edit .env.local and add your Noroff API credentials
   # You need to replace the placeholder values with your actual:
   # - API_BEARER_TOKEN (from your Noroff API account)
   # - API_KEY (from your Noroff API account)
   ```

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
- **Endpoints**: 
  - `/pets` - Get all pets, create new pet
  - `/pets/:id` - Get, update, or delete specific pet
  - `/auth/login` - Admin authentication
  - `/auth/register` - Admin registration

### 🔒 Security

- API credentials are stored in environment variables (`.env.local`)
- The `.env.local` file is ignored by git and never committed
- Use `env.example` as a template for required environment variables
- All API calls include proper authentication headers

### API Types

```typescript
interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  size: string;
  color: string;
  description: string;
  image?: {
    url: string;
    alt: string;
  };
  created: string;
  updated: string;
}

interface ApiResponse<T> {
  data: T;
  meta?: {
    isFirstPage: boolean;
    isLastPage: boolean;
    currentPage: number;
    previousPage: number | null;
    nextPage: number | null;
    pageCount: number;
    totalCount: number;
  };
}
```

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

### Phase 3: Authentication & Admin (Next)
- [ ] User authentication system
- [ ] Admin login and registration pages
- [ ] Protected routes for admin features

### Phase 4: Pet Management
- [ ] Admin dashboard
- [ ] Create pet form
- [ ] Edit pet functionality
- [ ] Delete pet with confirmation

### Phase 5: Advanced Features
- [ ] Share functionality with clipboard API
- [ ] User accounts with saved favorites
- [ ] Email notifications for new pets
- [ ] Advanced filtering (location, special needs)

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
- 🔄 As a user, I want to share a pet's page with others

### Admin Users
- 🔄 As an admin, I want to log in securely to manage pets
- 🔄 As an admin, I want to add new pets to the system
- 🔄 As an admin, I want to edit existing pet information
- 🔄 As an admin, I want to remove pets that have been adopted

## 📄 License

This project is part of a course assignment and is for educational purposes.