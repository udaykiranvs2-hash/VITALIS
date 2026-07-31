# Vitalis - Project Analysis & Development Report

## Executive Summary
Vitalis is a full-stack AI-powered healthcare SaaS platform. It enables users to perform symptom assessments, analyze medical reports, estimate treatment costs, and manage appointments using an intuitive web interface. The core value proposition is the integration of Google's Gemini AI to parse unstructured medical data (symptoms, reports) and provide structured, human-readable insights.

## Architecture & Technology Stack
The project follows a standard MERN-like architecture, but substitutes MongoDB with Supabase (PostgreSQL) while maintaining a hybrid local-fallback data access layer.

**Frontend (Client):**
- **Framework:** React 19 powered by Vite.
- **Routing:** React Router v7.
- **Styling:** Vanilla CSS (`index.css`), utilizing CSS variables for consistent theming and dark mode.
- **UI/UX:** Framer Motion for animations, Lucide React for iconography.
- **Network:** Axios for API requests to the Express backend.

**Backend (Server):**
- **Framework:** Node.js with Express v5.
- **Database:** Supabase (PostgreSQL) with a custom in-memory/JSON fallback store (`fallbackStore.js`).
- **AI Integration:** `@google/genai` (Gemini API) for health assessments and report analysis.
- **Authentication:** Custom JWT-based authentication using `bcryptjs` and `jsonwebtoken`, alongside `nodemailer` for email notifications. 

## Feature Analysis

### 1. Authentication & Security
- **Current State:** Implements custom registration, login, and password reset flows. It stores hashed passwords directly in the `users` table. Email notifications are dispatched on login and password reset.
- **Observation:** While functional, this bypasses the built-in, highly secure Supabase Auth which offers out-of-the-box OAuth, rate limiting, and session management.

### 2. Health & Diagnostic Tools (AI-Powered)
- **Symptom Checker:** Collects user demographics and symptoms, passing them to Gemini to receive possible conditions, severity levels, and next steps.
- **Report Analyzer:** Intended for users to upload medical documents (PDFs/Images).
- **Observation:** The frontend currently simulates file parsing by sending the `fileName` and `fileText` in a JSON payload. Real multipart file uploads and OCR/parsing (if images/PDFs are used) need to be implemented.

### 3. Care Coordination & Booking
- **Doctor Directory:** Allows filtering and searching for doctors.
- **Appointments:** Users can book appointments which are appended to their profile.
- **Cost Estimator & Medicine Info:** Provides estimates and information, though it appears to rely on static rules or AI queries rather than a real-time medical pricing API.

### 4. Data Storage Model
- **Current State:** The database uses a single `users` table. Sub-entities such as `reports`, `appointments`, `notifications`, and `history` are stored as **JSONB arrays** within the user record.
- **Observation:** This NoSQL-like approach within a relational database (PostgreSQL) is an anti-pattern for scalable systems. It works well for rapid prototyping and the current `fallbackStore` implementation, but will cause performance bottlenecks and data integrity issues as the application scales.

---

## Recommendations for Further Development

To take Vitalis from an MVP/prototype to a production-ready application, the following areas should be prioritized:

### 1. Database Normalization (High Priority)
The current JSONB array approach for user data will not scale. You cannot easily query "All appointments for Doctor X" or "Paginate user reports".
- **Action:** Break the single `users` table into normalized PostgreSQL tables in Supabase:
  - `users` (id, email, profile_data)
  - `appointments` (id, user_id, doctor_id, date, time, status)
  - `reports` (id, user_id, title, type, file_url, analysis_results)
  - `symptom_history` (id, user_id, symptoms, ai_assessment)
  - `notifications` (id, user_id, message, read_status)

### 2. Migrate to Supabase Auth (High Priority)
Relying on a custom JWT implementation means you miss out on Supabase's ecosystem.
- **Action:** Refactor `auth.controller.js` to use `@supabase/supabase-js` native auth (`supabase.auth.signUp`, `supabase.auth.signInWithPassword`). This will allow you to leverage Row Level Security (RLS) properly on the database side, securing user data natively.

### 3. Implement Real File Uploads & Storage (Medium Priority)
The report analyzer currently fakes file reading.
- **Action:** 
  - Update the frontend to use `FormData` for multipart file uploads.
  - Setup a Supabase Storage bucket (`medical_reports`).
  - Update the backend to accept the file using `multer`, upload the raw file to the Supabase bucket, and extract text (using a library like `pdf-parse` or an OCR API) before sending it to Gemini for analysis.

### 4. Enhance AI Context with RAG (Medium Priority)
Currently, Gemini relies entirely on its pre-trained knowledge.
- **Action:** Implement Retrieval-Augmented Generation (RAG). Store verified medical guidelines or doctor schedules in Supabase vector embeddings (`pgvector`). When a user asks the AI Assistant a question, fetch relevant local context so the AI provides highly accurate, clinic-specific answers.

### 5. Frontend Polish & State Management (Low Priority)
- **Action:** Implement a robust form validation library like React Hook Form + Zod for the authentication and symptom checker forms to provide better client-side error handling.
- **Action:** Consider moving complex state (like health history and loaded reports) into a lightweight global store (like Zustand) to reduce prop-drilling or context bloat.

### 6. Testing Infrastructure (Low Priority)
- **Action:** Introduce `Vitest` or `Jest` for backend API route testing and frontend component testing, ensuring AI endpoints and authentication flows remain stable during refactoring.
