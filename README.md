# Assignment Portal

## Project Title and Short Description
**Assignment Portal** is a responsive, role-based web application built with React for managing academic assignments. Students can view, upload PDF submissions, and track deadlines, while admins can create, edit, and monitor submissions with real-time visibility across browser tabs. It supports overdue alerts, file validation, and dynamic syncing without a backend server.

## Links
- **GitHub Project Repository**: [github.com/yourusername/assignment-portal](https://github.com/yourusername/assignment-portal) (replace with your repo)
- **Deployment Link**: [assignment-portal.vercel.app](https://assignment-portal.vercel.app) (deployed on Vercel; replace with your live URL)

## All Details of the Project
This project simulates a university assignment management system using client-side storage for a single-user/multi-tab experience. Key workflows:
- **Student Role**: Log in to view assignments, check deadlines (with overdue warnings), open a modal to read details/resources, upload PDFs (max 2MB), and submit. Submissions are marked as complete and persist across sessions.
- **Admin Role**: Log in to create new assignments (with optional Google Drive links), edit deadlines, delete assignments (cascades to submissions), and view submission stats/progress bars. A modal lists students' submissions with file details and download links.
- **Syncing**: Uses localStorage + BroadcastChannel for real-time updates across open tabs (e.g., admin adds task → student tab refreshes instantly).
- **Data Persistence**: All data (assignments, submissions) stored in browser localStorage as JSON. PDFs converted to base64 for storage.
- **Limitations**: Client-side only—no multi-device sync (use Firebase for that). Demo credentials provided for testing.

The app emphasizes UX with modals for detailed views, responsive grids (2 cards/row on desktop), and validation to prevent errors.

## Tech Stack
- **Frontend**: React (18+), Tailwind CSS (for styling/responsiveness)
- **Icons**: Lucide React
- **Storage & Sync**: localStorage, BroadcastChannel (for cross-tab updates)
- **File Handling**: FileReader API (base64 encoding for PDFs)
- **Build Tools**: Create React App (CRA)
- **Deployment**: Vercel/Netlify (static hosting)

No backend/database—pure client-side for simplicity.

## Features
- **Role-Based Authentication**: Demo login for students/admins (mock credentials).
- **Assignment Management (Admin)**: Create/edit/delete assignments, deadline postponement, submission progress bars (e.g., 2/3 submitted).
- **Student Dashboard**: Pending/submitted counters, card/table views (toggle), overdue alerts.
- **View & Submit Flow**: Modal for assignment details/resources; PDF upload with validation (type/size).
- **Real-Time Sync**: Changes (add/submit) propagate across tabs via BroadcastChannel.
- **File Downloads (Admin)**: View submissions with timestamps; download PDFs as blobs.
- **Responsive Design**: Mobile-first; 2-column cards on desktop, scrollable tables.
- **Error Handling**: Alerts for invalid files/storage errors; graceful fallbacks.

## Relevant Database Schema
Since this uses localStorage (JSON objects), the "schema" is structured as follows:

### Assignments (localStorage key: `'assignments'`)
Array of objects:
```json
[
  {
    "id": "a1234567890",
    "title": "React Fundamentals Project",
    "description": "Build a todo app using React hooks",
    "deadline": "2025-11-05",
    "driveLink": "https://drive.google.com/example1",
    "createdBy": "a1"
  }
]
```
- **Versioning**: Wrapped in `{ version: "v1", data: [...], timestamp: 1234567890 }` for migration.

### Submissions (localStorage key: `'submissions'`)
Array of objects:
```json
[
  {
    "id": "s1234567890",
    "assignmentId": "a1234567890",
    "studentId": "s1",
    "submittedAt": "2025-11-01T10:00:00Z",
    "fileName": "my-assignment.pdf",
    "fileSize": 1024000,
    "fileType": "application/pdf",
    "fileData": "data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEK..." // Base64 PDF
  }
]
```
- **Versioning**: Same as assignments.

Queries (in code): Filter by `assignmentId`/`studentId` for counts/views.

## Validation Rules
- **Assignment Creation (Admin)**: Title and deadline required; deadline must be a valid date.
- **File Upload (Student)**: PDF only (`application/pdf`); max 2MB; required for submission.
- **Login**: Matches mock credentials; alerts on invalid.
- **Deadlines**: Overdue if `< current date`; warnings shown in red.
- **Storage**: Errors (e.g., quota) alert user; auto-clear corrupted data.

## Searching
Basic client-side filtering is not implemented (focus on core flows). To add:
- Use `Array.filter` on assignments/submissions by title/description.
- Example: Search bar in dashboards querying `assignments.filter(a => a.title.includes(query))`.

## Toast Notifications
Not implemented (uses simple `alert()` for feedback). To add:
- Integrate `react-toastify`: `npm install react-toastify`.
- Example: `toast.success('Assignment submitted!')` on upload; `toast.error('File too large')` on validation fail.

## Folder Structure
```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx          # Shared header with logout
│   │   ├── LoginForm.jsx       # Login UI
│   │   └── ViewToggle.jsx      # Card/table toggle
│   ├── student/
│   │   └── StudentDashboard.jsx # Student views (counters, modals, uploads)
│   └── admin/
│       └── AdminDashboard.jsx  # Admin views (add/edit, submissions modal)
├── data/
│   └── mocks.jsx               # Mock users/assignments
├── App.jsx                     # Core logic (state, handlers, sync)
└── index.jsx                   # Entry point
```

## Quick Start
### Installation
1. Clone the repo: `git clone https://github.com/yourusername/assignment-portal.git`
2. Navigate: `cd assignment-portal`
3. Install deps: `npm install` (includes React, Tailwind via CDN, Lucide).
4. Add Tailwind: Include `<script src="https://cdn.tailwindcss.com"></script>` in `public/index.html`.

### Setup
- No env vars needed (localStorage only).
- Demo Credentials:
  - Student: `alice@student.com` / `student123`
  - Admin: `admin@prof.com` / `admin123`

### Run
- Dev: `npm start` (runs on http://localhost:3000).
- Build: `npm run build` (for production deploy to Vercel/Netlify).

### Testing
- Open two tabs: Admin adds assignment → Student refreshes/sees it instantly.
- Submit PDF as student → Admin modal shows downloadable file.

For issues: Check console for storage errors. Contribute via PRs!