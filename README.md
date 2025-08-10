# GL2 - Dating App

A modern, full-stack dating application built with Next.js, featuring user authentication, profile management, photo sharing, and matching functionality.

## 🚀 Features

- **User Authentication** - Secure registration and login system with NextAuth.js
- **Profile Management** - Comprehensive user profiles with photos, bio, job title, and location
- **Photo Gallery** - Multi-photo profile support with main photo selection
- **Matching System** - Like, dislike, and super-like interactions with mutual matching
- **User Discovery** - Browse and interact with other users
- **Blocking System** - User safety features with blocking capability
- **Responsive Design** - Mobile-first design with beautiful UI
- **Real-time Updates** - Optimistic updates with React Query
- **Type Safety** - Full TypeScript implementation

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with custom design tokens
- **Framer Motion** - Smooth animations and page transitions
- **React Query** - Server state management and caching
- **React Hook Form** - Form handling and validation

### Backend

- **Next.js API Routes** - Server-side API endpoints
- **NextAuth.js** - Authentication and session management
- **Prisma** - Database ORM and migrations
- **SQLite** - Development database (easily switchable to PostgreSQL)
- **bcrypt** - Password hashing
- **Nodemailer** - Email functionality

### Testing & Development

- **Cypress** - End-to-end testing
- **ESLint** - Code linting
- **Faker.js** - Test data generation

## 🏗️ Database Schema

The application uses a comprehensive database schema supporting:

- **Users** - Profile information, preferences, and authentication
- **Photos** - Multiple photos per user with ordering and main photo selection
- **Interactions** - Like/dislike/superlike system between users
- **Matches** - Mutual connections between users
- **Messages** - Chat functionality between matched users
- **Blocks** - User safety and blocking system
- **Locations** - Geographic data for location-based features

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Blake-Pfaff/gl2.git
   cd gl2
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure the following variables in `.env.local`:

   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"

   # Email (optional for development)
   EMAIL_SERVER_HOST="smtp.ethereal.email"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your-email"
   EMAIL_SERVER_PASSWORD="your-password"
   EMAIL_FROM="noreply@yourapp.com"
   ```

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Application Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── users/         # User management endpoints
│   ├── components/        # Reusable React components
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── users/            # User discovery page
├── hooks/                 # Custom React hooks
├── lib/                  # Utility functions and configurations
└── types/                # TypeScript type definitions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run generate-colors` - Generate color palette and design tokens
- `npm run cypress:open` - Open Cypress test runner
- `npm run cypress:run` - Run Cypress tests headlessly

## 🧪 Testing

The application includes Cypress for end-to-end testing:

```bash
# Open Cypress test runner
npm run cypress:open

# Run tests headlessly
npm run cypress:run
```

## 📊 Database Management

### Reset Database

```bash
npx prisma db push --force-reset
npx prisma db seed
```

### View Database

```bash
npx prisma studio
```

### Create Migration

```bash
npx prisma migrate dev --name your-migration-name
```

## 🎨 Design System

The app features a modern, mobile-first design with:

- **Design Tokens** - Centralized colors, spacing, typography, and border radius
- **Animation Library** - Consistent motion design with Framer Motion
- **Responsive Layout** - Optimized for mobile and desktop
- **Bottom Navigation** - Easy mobile navigation with smooth transitions
- **Loading States** - Smooth UX with loading spinners and page transitions
- **Form Components** - Reusable form inputs with validation and animations
- **Card-based Design** - Clean, modern UI components with hover effects

### Design Token System

Change your entire app's design from one place:

```bash
# Generate new color palette
npm run generate-colors

# Customize in src/app/globals.css and src/lib/animations.ts
```

## 🔐 Authentication Flow

1. **Registration** - Email/password signup with email verification
2. **Login** - Secure authentication with session management
3. **Profile Setup** - Complete profile information and photo upload
4. **Protected Routes** - Automatic redirects for unauthenticated users

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy automatically on push

### Manual Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Prisma](https://prisma.io/) - Database toolkit
- [NextAuth.js](https://next-auth.js.org/) - Authentication library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [React Query](https://tanstack.com/query) - Data fetching library

---

**Built with ❤️ by [Blake Pfaff](https://github.com/Blake-Pfaff)**
