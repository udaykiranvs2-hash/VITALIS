# Vitalis Frontend-Backend Integration Specification

This specification document outlines all user-facing pages and components in the Vitalis frontend client that interact with the backend API. It describes the user actions, collected inputs, API client functions, HTTP requests, payload structures, and how responses/errors are handled in the UI.

All API client methods are centralized in [api.js](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/api/api.js).

---

## 1. Authentication & Session Management

### 1.1 Login Page
- **Component File**: [LoginPage.jsx](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/pages/LoginPage.jsx)
- **User Action**: Form submission via the "Sign in" button.
- **Collected Inputs**:
  - `email` (string, required, type="email")
  - `password` (string, required, type="password")
- **API Handler**: [login](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/context/AuthContext.jsx#L75) (via AuthContext), which invokes [loginUser](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/api/api.js#L21).
- **HTTP Request**: `POST /api/auth/login`
- **Request Payload**:
  ```json
  {
    "email": "user@example.com",
    "password": "user_password"
  }
  ```
- **Response Handling**:
  - **Success (200 OK)**: Backend returns `{ token, user }`. The frontend saves the token to local storage and updates the AuthContext state. Redirects the user to `/app`.
  - **Error (4xx/5xx)**: Displays the error message returned from the backend (or "Unable to sign in" by default) under the form.

---

### 1.2 Registration Page
- **Component File**: [RegisterPage.jsx](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/pages/RegisterPage.jsx)
- **User Action**: Form submission via the "Create account" button.
- **Collected Inputs**:
  - `name` (string, required)
  - `email` (string, required, type="email")
  - `password` (string, required, type="password", minLength=8)
- **API Handler**: [register](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/context/AuthContext.jsx#L60) (via AuthContext), which invokes [registerUser](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/api/api.js#L20).
- **HTTP Request**: `POST /api/auth/register`
- **Request Payload**:
  ```json
  {
    "name": "Full Name",
    "email": "user@example.com",
    "password": "user_password"
  }
  ```
- **Response Handling**:
  - **Success (201 Created)**: Backend returns `{ token, user }`. Frontend saves the token/session and redirects to `/app`.
  - **Error (4xx/5xx)**: Displays error feedback (e.g., "Email is already registered" or "Unable to register") at the bottom of the registration form.

---

### 1.3 Forgot Password Page
- **Component File**: [ForgotPasswordPage.jsx](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/pages/ForgotPasswordPage.jsx)
- **User Action**: Form submission via the "Send reset link" button.
- **Collected Inputs**:
  - `email` (string, required, type="email")
- **API Handler**: [forgotPasswordRequest](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/pages/ForgotPasswordPage.jsx#L3) (aliased import from `api.js`'s [forgotPassword](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/api/api.js#L22)).
- **HTTP Request**: `POST /api/auth/forgot-password`
- **Request Payload**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response Handling**:
  - **Success (200 OK)**: Displays the success message returned from the backend (e.g., "If your email exists, you will receive instructions shortly.") in a green banner.
  - **Error (4xx/5xx)**: Displays an error message under the form.

---

### 1.4 Reset Password Page
- **Component File**: [ResetPasswordPage.jsx](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/pages/ResetPasswordPage.jsx)
- **User Action**: Form submission via the "Reset password" button.
- **Collected Inputs**:
  - `password` (string, required, minLength=8)
  - `confirmPassword` (string, required, minLength=8)
  - `token` (string, extracted automatically from the URL query parameter `?token=...`)
- **API Handler**: [resetPasswordRequest](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/pages/ResetPasswordPage.jsx#L3) (aliased import from `api.js`'s [resetPassword](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/api/api.js#L23)).
- **HTTP Request**: `POST /api/auth/reset-password`
- **Request Payload**:
  ```json
  {
    "token": "reset_token_from_url",
    "newPassword": "new_password"
  }
  ```
- **Response Handling**:
  - **Success (200 OK)**: Displays success feedback ("Your password has been reset. Please sign in again.") and redirects the user to `/login` after 1.5 seconds.
  - **Error (4xx/5xx)**: Displays error feedback (e.g., "Invalid or expired reset token" or "Passwords do not match").

---

## 2. Health & Diagnostic Tools

### 2.1 Symptom Checker
- **Component File**: [SymptomCheckerPage.jsx](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/pages/SymptomCheckerPage.jsx)
- **User Action**: Form submission via the "Analyze symptoms" button.
- **Collected Inputs**:
  - `age` (number, required, min=1, max=120)
  - `gender` (string select: "female", "male", "other")
  - `symptoms` (string textarea, entered as comma-separated symptoms, e.g., "fever, cough, headache")
  - `duration` (string select: "Less than 24 hours", "1-3 days", "3-7 days", "More than a week")
  - `severity` (string select: "mild", "moderate", "severe")
  - `medicalHistory` (string, entered as comma-separated conditions)
  - `allergies` (string, entered as comma-separated allergies)
  - `medications` (string, entered as comma-separated medications)
- **API Handler**: [submitSymptomCheck](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/api/api.js#L27)
- **HTTP Request**: `POST /api/health/symptoms`
- **Request Payload**: (Note: Comma-separated strings are parsed into arrays on submission)
  ```json
  {
    "age": 30,
    "gender": "female",
    "symptoms": ["fever", "cough", "headache"],
    "duration": "1-3 days",
    "severity": "mild",
    "medicalHistory": ["hypertension"],
    "allergies": ["penicillin"],
    "medications": ["aspirin"]
  }
  ```
- **Response Handling**:
  - **Success (200 OK)**: The backend returns an assessment result containing:
    - `disclaimer` (string)
    - `emergencyWarning` (optional object with `headline` and `message`)
    - `possibleConditions` (array of strings)
    - `confidence` (string)
    - `severityLevel` (string)
    - `suggestedSpecialist` (string)
    - `nextSteps` (array of strings)
    The client renders the result panel displaying all sections and a success toast.
  - **Error (4xx/5xx)**: Displays a toast message "Unable to complete symptom assessment. Please try again."

---

### 2.2 Medical Report Analyzer
- **Component File**: [ReportAnalyzerPage.jsx](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/pages/ReportAnalyzerPage.jsx)
- **User Action**: Form submission via the "Analyze report" button after selecting a report type and uploading a file.
- **Collected Inputs**:
  - `reportType` (string select: "Blood Test", "CBC", "Thyroid", "Kidney", "Liver", "ECG", "MRI", "CT Scan", "Other lab report")
  - `file` (binary file upload selector, constraints: `.pdf`, `image/png`, `image/jpeg`)
  - `reportName` (string, optional notes/details textarea)
- **API Handler**: [analyzeReport](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/api/api.js#L28)
- **HTTP Request**: `POST /api/health/report`
- **Request Payload**:
  > [!NOTE]
  > The frontend does not currently perform a multi-part file upload. It extracts the name of the file and simulates parsing by passing `fileName: file.name` and `fileText: file.name` in a standard JSON payload.
  ```json
  {
    "reportType": "Blood Test",
    "reportName": "Optional notes or report title",
    "fileName": "blood_panel_july.pdf",
    "fileText": "blood_panel_july.pdf"
  }
  ```
- **Response Handling**:
  - **Success (200 OK)**: Renders the analysis output:
    - `title` (string)
    - `summary` (string)
    - `findings` (array of strings)
    - `abnormalValues` (array of strings)
    - `recommendations` (array of strings)
    - `disclaimer` (string)
    A success toast "Report analysis is ready." is shown.
  - **Error (4xx/5xx)**: Shows a toast message "Unable to analyze the report right now."

---

## 3. Care Coordination & Booking

### 3.1 Doctor Directory & Scheduling
- **Component File**: [DoctorDirectoryPage.jsx](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/pages/DoctorDirectoryPage.jsx)
- **Interactions**:
  1. **Filtering/Searching** (Triggers on filter field changes):
     - **Inputs**:
       - `specialty` (string, filter by doctor specialty)
       - `state` (string, filter by US state / location)
       - `language` (string, filter by languages spoken)
       - `maxFee` (number, filter by consultation fee limit)
     - **API Handler**: [getDoctors](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/api/api.js#L30)
     - **HTTP Request**: `GET /api/doctors`
     - **Query Parameters**: `?specialty=...&state=...&language=...&maxFee=...`
     - **Outcome**: Reloads the matching doctor cards in the grid.
  2. **Booking an Appointment Slot** (Triggers when clicking on a specific time slot button on a doctor's card):
     - **Collected Inputs**: Selected doctor object (`id`, `name`, `specialty`) and slot text (e.g., "2026-07-28 10:00 AM").
     - **API Handler**: [bookAppointment](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/api/api.js#L31)
     - **HTTP Request**: `POST /api/health/appointment`
     - **Request Payload**:
       ```json
       {
         "doctorId": "doc_id_123",
         "doctorName": "Dr. Sarah Jenkins",
         "specialty": "Cardiology",
         "date": "2026-07-28",
         "time": "10:00"
       }
       ```
     - **Response Handling**:
       - **Success (201 Created)**: Shows a toast message indicating booking confirmation: "Booked Dr. Sarah Jenkins for 2026-07-28 10:00 AM."
       - **Error (4xx/5xx)**: Shows a toast message "Unable to book this appointment."

---

### 3.2 Treatment Cost Estimator
- **Component File**: [CostEstimatorPage.jsx](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/pages/CostEstimatorPage.jsx)
- **User Action**: Form submission via the "Estimate cost" button.
- **Collected Inputs**:
  - `country` (string, required, text input)
  - `state` (string, required, text input)
  - `procedure` (string select: "Appendectomy", "Knee Replacement", "Hip Replacement", "Gallbladder Removal", "Cataract Surgery", "Heart Bypass", "General Consultation", "MRI Scan", "CT Scan", "ECG")
  - `hospitalType` (string select: "Standard", "Premium", "Luxury")
- **API Handler**: [estimateCost](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/api/api.js#L33)
- **HTTP Request**: `POST /api/estimate`
- **Request Payload**:
  ```json
  {
    "country": "USA",
    "state": "California",
    "procedure": "Heart Bypass",
    "hospitalType": "Premium"
  }
  ```
- **Response Handling**:
  - **Success (200 OK)**: Renders the cost estimator results:
    - `costRange` (string, e.g., "$26730 - $32670")
    - `hospitalStay` (string, e.g., "2-4 days")
    - `medicationCost` (string, e.g., "$3564")
    - `followUpCost` (string, e.g., "$2376")
    - `insuranceNote` (string)
    - `disclaimer` (string)
  - **Error (4xx/5xx)**: Shows a toast message "Unable to estimate cost right now."

---

### 3.3 AI Health Assistant
- **Component File**: [AssistantPage.jsx](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/pages/AssistantPage.jsx)
- **User Action**: Submitting a question via the "Send question" button.
- **Collected Inputs**:
  - `query` (string textarea, required, text input containing the message)
- **API Handler**: [sendAssistantMessage](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/api/api.js#L34)
- **HTTP Request**: `POST /api/assistant/chat`
- **Request Payload**:
  ```json
  {
    "message": "What is the typical recovery time for an appendectomy?"
  }
  ```
- **Response Handling**:
  - **Success (200 OK)**: Returns `{ reply, disclaimer }`. The client appends the user message and the assistant reply to the `chatHistory` state array, which renders as a dialogue thread.
  - **Error (4xx/5xx)**: Displays a toast message "Unable to process your request at the moment."

---

### 3.4 Medicine Information Search
- **Component File**: [MedicineInfoPage.jsx](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/pages/MedicineInfoPage.jsx)
- **User Action**: Form submission via the "Search" button.
- **Collected Inputs**:
  - `query` (string, required, text input containing the drug name, e.g., "Paracetamol")
- **API Handler**: [searchMedicine](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/api/api.js#L32)
- **HTTP Request**: `GET /api/medicine/search`
- **Query Parameters**: `?query=Paracetamol`
- **Response Handling**:
  - **Success (200 OK)**: Returns an array of matching medicine objects, each containing:
    - `id` (string)
    - `name` (string)
    - `uses` (string)
    - `dosage` (string)
    - `warnings` (string)
    - `sideEffects` (string)
    - `interactions` (string)
    - `storage` (string)
    The client maps over the results and displays a card for each matching medicine.
  - **Error (4xx/5xx)**: Displays an error message: "Unable to find medicine information at the moment."

---

## 4. User Profiles & User Settings

### 4.1 Profile Settings
- **Component File**: [ProfilePage.jsx](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/pages/ProfilePage.jsx)
- **User Action**: Form submission via the "Save profile" button.
- **Collected Inputs**:
  - `fullName` (string, required)
  - `phone` (string)
  - `birthDate` (string, date picker format `YYYY-MM-DD`)
  - `gender` (string select: "female", "male", "other")
  - `bloodGroup` (string)
  - `emergencyContact` (string)
  - `insuranceProvider` (string)
  - `insuranceNumber` (string)
  - `preferredHospital` (string)
  - `medicalConditions` (string, comma-separated list)
  - `allergies` (string, comma-separated list)
  - `medications` (string, comma-separated list)
  - `familyHistory` (string, comma-separated list)
- **API Handler**: [updateProfile](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/context/AuthContext.jsx#L90) (via AuthContext), which invokes [updateProfileRequest](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/api/api.js#L25).
- **HTTP Request**: `PUT /api/user/profile`
- **Request Payload**: (Note: Comma-separated strings are parsed into clean arrays of strings)
  ```json
  {
    "fullName": "Jane Doe",
    "phone": "+1-555-0199",
    "birthDate": "1994-06-15",
    "gender": "female",
    "bloodGroup": "O+",
    "emergencyContact": "John Doe (+1-555-0100)",
    "insuranceProvider": "Blue Cross Blue Shield",
    "insuranceNumber": "BCBS-987654321",
    "preferredHospital": "St. Mary Medical Center",
    "medicalConditions": ["asthma"],
    "allergies": ["peanuts"],
    "medications": ["albuterol inhaler"],
    "familyHistory": ["diabetes"]
  }
  ```
- **Response Handling**:
  - **Success (200 OK)**: Updates user state in AuthContext and localStorage. Displays a toast "Profile updated successfully."
  - **Error (4xx/5xx)**: Displays a toast "Unable to update profile."

---

### 4.2 Security Preferences (Change Password)
- **Component File**: [SettingsPage.jsx](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/pages/SettingsPage.jsx)
- **User Action**: Form submission via the "Update password" button.
- **Collected Inputs**:
  - `currentPassword` (string, required, type="password")
  - `newPassword` (string, required, type="password", minLength=8)
  - `confirmPassword` (string, required, type="password", minLength=8)
- **API Handler**: [changePassword](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/context/AuthContext.jsx#L108) (via AuthContext), which invokes [changePasswordRequest](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/api/api.js#L26).
- **HTTP Request**: `PUT /api/user/password`
- **Request Payload**:
  ```json
  {
    "currentPassword": "old_password",
    "newPassword": "new_password"
  }
  ```
- **Response Handling**:
  - **Success (200 OK)**: Resets the form state and displays a success toast: "Password updated successfully."
  - **Error (4xx/5xx)**: Displays a toast: "Unable to update password."

---

## 5. Automated/Background API Operations

### 5.1 Profile Initialization
- **Component File**: [AuthContext.jsx](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/context/AuthContext.jsx)
- **Trigger**: Triggered automatically on application start/mount if a token is stored in the browser's local storage.
- **API Handler**: [fetchProfile](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/api/api.js#L24)
- **HTTP Request**: `GET /api/user/profile`
- **Headers**: Include `Authorization: Bearer <token>`
- **Response Handling**:
  - **Success (200 OK)**: Returns `{ user: { ... } }`. Restores the user session state in the application context.
  - **Error (401 Unauthorized / token expired)**: Automatically clears local session storage and logs the user out.

---

### 5.2 Dashboard Notifications
- **Component File**: [DashboardPage.jsx](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/pages/DashboardPage.jsx)
- **Trigger**: Automatically requested on component mount.
- **API Handler**: [fetchNotifications](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/api/api.js#L35)
- **HTTP Request**: `GET /api/user/notifications`
- **Response Handling**:
  - **Success (200 OK)**: Returns `{ notifications: [...] }`. Renders notifications in the list at the bottom of the dashboard page.
  - **Error (4xx/5xx)**: Silently handles failure, setting the notifications list state to empty.

---

### 5.3 Health History Fetching
- **Component File**: [HistoryPage.jsx](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/pages/HistoryPage.jsx)
- **Trigger**: Automatically requested on component mount.
- **API Handler**: [fetchHistory](file:///c:/Users/Uday/Code/webapp/vitalis/client/src/api/api.js#L29)
- **HTTP Request**: `GET /api/health/history`
- **Response Handling**:
  - **Success (200 OK)**: Returns `{ reports, appointments, history }`. Updates the component state to render recent reports list, appointment summaries, and historical symptom checks.
  - **Error (4xx/5xx)**: Renders error text: "Unable to load health history."
