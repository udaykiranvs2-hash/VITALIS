# Vitalis - AI Health Navigator

A full-stack healthcare SaaS platform designed to help users analyze symptoms, understand medical reports, estimate treatment costs, find doctors, book appointments, and receive AI-powered health guidance.

## Project structure

- `client/` - React frontend powered by Vite.
- `server/` - Express backend with MongoDB models and API routes.

## Installation

1. Install dependencies for the backend:
   ```powershell
   cd server
   npm install
   ```

2. Install dependencies for the frontend:
   ```powershell
   cd ..\client
   npm install
   ```

3. Configure environment variables:
   - Copy `server/.env.example` to `server/.env`.
   - Update `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL`.

## Running the app

### Backend

```powershell
cd server
npm run dev
```

### Frontend

```powershell
cd client
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend runs on `http://localhost:5000` by default.

## API routes

- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Authenticate an existing user.
- `POST /api/auth/forgot-password` - Request a password reset token.
- `POST /api/auth/reset-password` - Reset password using a token.
- `GET /api/user/profile` - Get authenticated user profile.
- `PUT /api/user/profile` - Update profile details.
- `PUT /api/user/password` - Change account password.
- `GET /api/user/notifications` - Retrieve notifications.
- `POST /api/health/symptoms` - Submit symptom details for an AI-supported assessment.
- `POST /api/health/report` - Analyze a medical report upload.
- `GET /api/health/history` - Retrieve health history and records.
- `POST /api/health/appointment` - Book a doctor appointment.
- `DELETE /api/health/appointment/:id` - Cancel an appointment.
- `GET /api/doctors` - Search doctor profiles.
- `POST /api/assistant/chat` - Chat with the AI health assistant.
- `GET /api/medicine/search` - Search medicine information.
- `POST /api/estimate/estimate` - Get a treatment cost estimate.

## Environment variables

- `PORT` - Server port (default 5000).
- `MONGODB_URI` - MongoDB connection string.
- `JWT_SECRET` - JWT signing secret.
- `CLIENT_URL` - Frontend origin for CORS.

## Frontend features

- Landing page with hero, features, testimonials, and FAQ.
- User authentication with registration, login, forgot/reset password.
- Protected dashboard with recent activity and notifications.
- Symptom checker with recommendations and emergency alerts.
- Report analyzer for lab and imaging summaries.
- Health history timeline for reports, checks, and appointments.
- Doctor directory and appointment booking.
- Treatment cost estimator and medicine search.
- AI assistant chatbot with health disclaimers.
- Profile and settings pages with dark mode support.

## Notes

This implementation uses a modular structure to support future expansion into wearable integration, telemedicine, and insurance workflows.
