# 🐾 Pawsitive - Pet Adoption Platform

A modern, responsive web application for pet adoption built with Next.js, TypeScript, and Tailwind CSS. This platform connects loving families with pets in need of homes through an intuitive and beautiful interface.

## 🌟 Features

### Current Features (Phase 1)
- ✅ **Beautiful Landing Page**: Modern, responsive design with animations
- ✅ **API Integration**: Connected to Noroff API v2 for pet data
- ✅ **TypeScript**: Full type safety throughout the application
- ✅ **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ✅ **Modern UI**: Built with Tailwind CSS and Lucide React icons

### Planned Features (Future Phases)
- 🔄 **Pet Browsing**: Grid view of available pets with search and filtering
- 🔄 **Pet Details**: Individual pet pages with comprehensive information
- 🔄 **Admin Dashboard**: Pet management for authorized users
- 🔄 **Authentication**: Secure login and registration system
- 🔄 **Pet Management**: Create, edit, and delete pet listings
- 🔄 **Search & Filter**: Find pets by breed, age, size, and more
- 🔄 **Share Functionality**: Share specific pets with potential adopters

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
│   │   └── globals.css         # Global styles
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
```

## 🏗️ Development Roadmap

### Phase 1: Foundation ✅
- [x] Project setup with Next.js and TypeScript
- [x] Tailwind CSS configuration
- [x] API utilities and types
- [x] Landing page design
- [x] Navigation and layout structure

### Phase 2: Core Features (Next)
- [ ] Pet listing page with grid layout
- [ ] Search and filtering functionality
- [ ] Individual pet detail pages
- [ ] Share functionality with clipboard API

### Phase 3: Authentication & Admin
- [ ] User authentication system
- [ ] Admin login and registration pages
- [ ] Protected routes for admin features

### Phase 4: Pet Management
- [ ] Admin dashboard
- [ ] Create pet form
- [ ] Edit pet functionality
- [ ] Delete pet with confirmation

### Phase 5: Polish & Deploy
- [ ] Error handling and loading states
- [ ] Accessibility improvements
- [ ] Performance optimizations
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

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Screen reader friendly

## 🎯 User Stories

### Public Users
- ✅ As a user, I want to view an attractive landing page that explains the service
- 🔄 As a user, I want to browse available pets in a grid layout
- 🔄 As a user, I want to search for pets by name or characteristics
- 🔄 As a user, I want to view detailed information about a specific pet
- 🔄 As a user, I want to share a pet's page with others

### Admin Users
- 🔄 As an admin, I want to log in securely to manage pets
- 🔄 As an admin, I want to add new pets to the system
- 🔄 As an admin, I want to edit existing pet information
- 🔄 As an admin, I want to remove pets that have been adopted

## 📄 License

This project is part of a course assignment and is for educational purposes.