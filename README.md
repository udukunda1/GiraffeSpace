# GiraffeSpace Frontend

This is the frontend for the GiraffeSpace event management platform. It is built with Next.js, React, and TypeScript, and uses Tailwind CSS for styling.

## Project Structure

- **app/**: Main application directory, following Next.js app directory structure.
  - **admin/**: Admin dashboard and management pages for events, users, venues, tickets, invoices, payments, registrations, resources, organizations, and more.
  - **dashboard/**: User and admin dashboards.
  - **login/**, **register/**: Authentication pages.
  - **manage/**: Management interfaces for events and venues.
  - **my-organizations/**: User's organizations management.
  - **profile/**, **settings/**: User profile and settings pages.
  - **venues/**, **events/**: Public and admin event/venue pages.
- **components/**: Reusable UI components (cards, buttons, forms, dialogs, etc.), including a UI library under `components/ui/`.
- **contexts/**: React context providers for authentication and other global state.
- **data/**: Static data for events, users, and venues (for development/demo purposes).
- **hooks/**: Custom React hooks.
- **lib/**: Utility functions.
- **public/**: Static assets (images, logos, etc.).
- **styles/**: Global and component styles.

## Main Features

- Event management (CRUD for events, venues, tickets, etc.)
- Multi-step event creation form with venue and organization selection
- Admin dashboard with statistics and filtering
- User authentication and organization management
- Responsive UI with modern design

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack
- Next.js
- React
- TypeScript
- Tailwind CSS

---
For more details, see the code in each directory and the comments in the source files. 