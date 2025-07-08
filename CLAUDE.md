# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a fintech application for consigned loans (empréstimo consignado) built for the Credifit technical challenge. The system allows employees from partner companies to request loans with automatic approval based on predefined business rules.

**Architecture**: Full-stack application with separate backend and frontend
- **Backend**: NestJS REST API with SQLite database (Prisma ORM)
- **Frontend**: React application with React Router v7 and TailwindCSS

## Common Commands

### Backend (NestJS)
```bash
cd backend
npm install                # Install dependencies
npm run start:dev          # Start development server (port 3000)
npm run build              # Build for production
npm run start:prod         # Start production server
npm run test               # Run unit tests
npm run test:e2e           # Run e2e tests
npm run test:cov           # Run tests with coverage
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

### Frontend (React Router v7)
```bash
cd frontend
npm install                # Install dependencies
npm run dev                # Start development server
npm run build              # Build for production
npm run start              # Start production server
npm run typecheck          # Run TypeScript type checking
```

## Database

- **Database**: SQLite with Prisma ORM
- **Location**: `backend/databese/dev.db`
- **Schema**: `backend/prisma/schema.prisma`
- **Migration commands**: Run from backend directory
  ```bash
  npx prisma migrate dev     # Create and apply migration
  npx prisma generate        # Generate Prisma client
  npx prisma studio          # Open Prisma Studio
  ```

## Core Business Logic

### Data Models
- **Company**: Partner companies with employees
- **Employee**: Users who can request loans
- **Loan**: Loan requests with automatic approval system

### Key Business Rules
- Maximum consignable margin: 35% of employee salary
- Loan approval based on credit score and salary
- Installment options: 1 to 4 times
- Loan statuses: PENDING, PROCESSING, PAID, REJECTED

## Authentication System

- **JWT-based authentication** for both companies and employees
- **Dual user types**: "employee" and "company"
- **Auth context**: `frontend/app/context/auth/AuthContext.tsx`
- **Protected routes**: Authentication required for main application areas
- **API service**: Centralized in `frontend/app/api/index.ts`

## API Structure

Backend follows NestJS modular architecture:
- **Auth Module**: Login/logout for companies and employees
- **Company Module**: Company management
- **Employee Module**: Employee management  
- **Loan Module**: Loan requests and management
- **Analysis Module**: Loan approval analysis
- **Prisma Module**: Database service

## Frontend Architecture

React Router v7 application with:
- **Route configuration**: `frontend/app/routes.ts`
- **Layout system**: Main layout with header/navigation
- **Context providers**: Auth context for state management
- **API integration**: Axios-based API client
- **Form handling**: React Hook Form with Zod validation
- **Styling**: TailwindCSS with custom CSS

### Key Components
- **AuthContext**: Global authentication state management
- **ProtectedRoute/PublicRoute**: Route guards
- **Home components**: Company and Employee dashboards
- **Loan components**: Credit request flow in `frontend/app/component/credito/`

## Development Workflow

1. **Backend first**: Start backend server before frontend
2. **Database**: Ensure SQLite database exists and migrations are applied
3. **Testing**: Run tests before committing changes
4. **Linting**: Both backend and frontend have ESLint configured
5. **Type checking**: Frontend has TypeScript strict mode enabled

## Key Files to Understand

- `backend/src/app.module.ts` - Main app module configuration
- `backend/prisma/schema.prisma` - Database schema
- `frontend/app/routes.ts` - Route configuration
- `frontend/app/context/auth/AuthContext.tsx` - Authentication logic
- `frontend/app/api/index.ts` - API client configuration