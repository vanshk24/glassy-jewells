# Lumière - Luxury Jewelry E-Commerce

A modern, full-stack e-commerce application for luxury artificial jewelry built with React Router, TypeScript, and Supabase.

## Features

### Frontend
- 🚀 Server-side rendering with React Router v7
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 CSS Modules for styling
- 💳 Razorpay payment integration
- 🛒 Shopping cart and wishlist functionality
- 📱 Responsive design

### Backend & Database
- 🗄️ **Supabase (PostgreSQL)** - Production-ready database
- 🔐 Row Level Security (RLS) for data protection
- 👤 Admin authentication with sessions
- 📊 Real-time order management
- 🔄 CRUD operations for products, orders, and customers
- 💾 Persistent data storage

### Styling & Theming

- This project uses CSS modules as the styling solution, Radix as the component library, and Open Props for styling tokens and theming
- Project theme is defined in `app/styles/theme.css`, used as a design system for all UI building
- Base design tokens are defined in `app/styles/tokens/<token-type>.css`, used as an immutable base design system for all the theme and all UI

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier available)
- Razorpay account (for payment processing)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <project-folder>
```

2. Install the dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Follow the complete guide in `SUPABASE_SETUP.md`
   - Create your Supabase project
   - Run the database schema
   - Get your API credentials

4. Configure environment variables:
```bash
cp .env.example .env
```

Add your credentials to `.env`:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SESSION_SECRET=generate_a_random_secret
```

5. Seed the database with products and admin user:
```bash
npm run seed:all
```

Or seed products only:
```bash
npm run seed
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

### Admin Panel Access

**Quick Start (3 steps):**

1. Create admin user:
```bash
npm run seed:admin
```

2. Navigate to `http://localhost:5173/admin-login`

3. Login with:
   - Email: `admin@luxecraft.com`
   - Password: `admin123`

**📚 Documentation:**
- **Quick Start**: [ADMIN_QUICKSTART.md](./ADMIN_QUICKSTART.md) - Get started in 3 steps
- **Complete Guide**: [ADMIN_ACCESS_GUIDE.md](./ADMIN_ACCESS_GUIDE.md) - Detailed setup and troubleshooting
- **Security Details**: [ADMIN_SECURITY.md](./ADMIN_SECURITY.md) - Implementation overview

### Tech Stack

**Frontend:**
- React 19
- React Router v7 (framework mode)
- TypeScript
- CSS Modules
- Radix UI components
- Lucide React icons

**Backend:**
- Supabase (PostgreSQL database)
- Supabase Auth
- Row Level Security (RLS)

**Payment:**
- Razorpay integration

**State Management:**
- React hooks (useState, useContext)
- localStorage for cart/wishlist

## Building for Production

Create a production build:

```bash
npm run build
```

## Project Structure

```
app/
├── components/          # React components
│   ├── ui/             # Reusable UI components (Radix-based)
│   └── ...             # Feature components
├── routes/             # React Router routes
├── services/           # Backend service layer
│   ├── products.service.ts
│   ├── orders.service.ts
│   └── auth.service.ts
├── supabase/           # Supabase configuration
│   ├── client.ts       # Supabase client
│   └── schema.sql      # Database schema
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── styles/             # Global styles and tokens
└── data/               # Legacy demo data (deprecated)
```

## Deployment

### Environment Variables for Production

Make sure to set these environment variables in your hosting platform:

```env
SUPABASE_URL=your_production_supabase_url
SUPABASE_ANON_KEY=your_production_anon_key
SESSION_SECRET=generate_new_production_secret
NODE_ENV=production
```

### Build for Production

Create a production build:

```bash
npm run build
```

### Deploy

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`:

```
├── package.json
├── package-lock.json
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

**Recommended Hosting Platforms:**
- Vercel
- Netlify
- Railway
- Render
- Fly.io

## Documentation

### Setup Guides
- **Admin Panel**: 
  - [ADMIN_QUICKSTART.md](./ADMIN_QUICKSTART.md) - Quick 3-step setup
  - [ADMIN_ACCESS_GUIDE.md](./ADMIN_ACCESS_GUIDE.md) - Complete access guide
  - [ADMIN_SECURITY.md](./ADMIN_SECURITY.md) - Security implementation
- **Database**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Complete Supabase configuration
- **Payments**: [RAZORPAY_SETUP.md](./RAZORPAY_SETUP.md) - Razorpay integration
- **Features**: [MULTIPLE_IMAGES_FEATURE.md](./MULTIPLE_IMAGES_FEATURE.md) - Product image gallery

### External Documentation
- **React Router**: [Official docs](https://reactrouter.com/)
- **Supabase**: [Official docs](https://supabase.com/docs)

## Database Schema

The application uses 4 main tables:

- **products** - Product catalog with images, pricing, stock
- **orders** - Customer orders with shipping info
- **order_items** - Line items for each order
- **admin_users** - Admin user authentication

See `app/supabase/schema.sql` for complete schema.

## Features Roadmap

- [x] Product catalog with categories
- [x] Shopping cart and wishlist
- [x] Razorpay payment integration
- [x] Admin panel for product management
- [x] Order management system
- [x] Supabase database integration
- [x] Admin authentication
- [ ] Customer accounts and login
- [ ] Order tracking
- [ ] Product reviews and ratings
- [ ] Email notifications
- [ ] Advanced search and filters
- [ ] Product recommendations
