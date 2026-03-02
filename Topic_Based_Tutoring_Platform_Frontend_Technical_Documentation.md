# **Frontend Technical Design Documentation – Topic-Based Tutoring Platform (MVP)**
1\. Objective\
\
This document describes the frontend architecture and implementation plan for the Topic-Based Tutoring Platform MVP. The frontend is built using Next.js to ensure fast development, SEO friendliness, and seamless deployment on Vercel. It integrates with the FastAPI backend via REST APIs and supports authentication, dashboards, booking flows, and Google Meet session access.

2\. Technology Stack\
\
Framework:\
\- Next.js 14 (App Router)\
\
Language:\
\- TypeScript\
\
Styling:\
\- Tailwind CSS\
\
State & Data Fetching:\
\- TanStack React Query\
\- Axios / Fetch API\
\
Authentication:\
\- JWT via HTTP-only cookies\
\- Session validation via backend\
\
Deployment:\
\- Vercel

3\. Frontend Folder Structure (Production-Ready)\
\
frontend/\
├── app/\
│   ├── layout.tsx\
│   ├── page.tsx\
│   ├── globals.css\
│   ├── auth/\
│   │   ├── login/page.tsx\
│   │   └── signup/page.tsx\
│   ├── dashboard/\
│   │   ├── student/page.tsx\
│   │   └── tutor/page.tsx\
│   ├── subjects/\
│   │   ├── page.tsx\
│   │   └── [subjectId]/topics/page.tsx\
│   ├── topics/\
│   │   └── [topicId]/tutors/page.tsx\
│   ├── booking/\
│   │   └── [bookingId]/confirm/page.tsx\
│   └── api/\
│       └── auth/route.ts\
├── components/\
│   ├── common/\
│   │   ├── Navbar.tsx\
│   │   ├── Footer.tsx\
│   │   └── ProtectedRoute.tsx\
│   ├── auth/\
│   │   └── AuthForm.tsx\
│   ├── booking/\
│   │   ├── SlotPicker.tsx\
│   │   └── BookingSummary.tsx\
│   ├── tutor/\
│   │   └── TutorCard.tsx\
│   └── dashboard/\
│       ├── StudentSessions.tsx\
│       └── TutorSessions.tsx\
├── lib/\
│   ├── api.ts\
│   ├── auth.ts\
│   └── constants.ts\
├── hooks/\
│   ├── useAuth.ts\
│   ├── useStudentBookings.ts\
│   └── useTutorBookings.ts\
├── types/\
│   ├── user.ts\
│   ├── booking.ts\
│   └── tutor.ts\
├── middleware.ts\
├── tailwind.config.ts\
└── next.config.js

4\. Routing Strategy (Next.js App Router)\
\
Public Routes:\
\- /\
\- /subjects\
\- /subjects/[subjectId]/topics\
\- /topics/[topicId]/tutors\
\
Auth Routes:\
\- /auth/login\
\- /auth/signup\
\
Protected Routes:\
\- /dashboard/student\
\- /dashboard/tutor\
\- /booking/[bookingId]/confirm

5\. Authentication Flow (Frontend)\
\
1\. User submits login/signup form\
2\. Frontend calls backend /auth/login or /auth/signup\
3\. Backend sets JWT in HTTP-only cookie\
4\. Frontend validates session via /auth/me\
5\. Role-based redirection to student or tutor dashboard\
6\. Next.js middleware protects routes

6\. API Integration Pattern\
\
\- All API calls centralized in lib/api.ts\
\- Axios configured with baseURL pointing to FastAPI backend\
\- Credentials included for cookie-based auth\
\- React Query handles caching, loading, and error states

7\. Booking Flow (Frontend)\
\
1\. Student selects subject → topic → tutor\
2\. SlotPicker component fetches tutor availability\
3\. Student selects slot and submits booking\
4\. Redirected to booking confirmation page\
5\. Booking confirmation triggers backend calendar creation\
6\. Meet link displayed in dashboard

8\. Dashboard Design\
\
Student Dashboard:\
\- Upcoming sessions with Meet links\
\- Past sessions\
\- Booking history\
\
Tutor Dashboard:\
\- Availability management\
\- Upcoming sessions\
\- Meet links

9\. State Management\
\
\- React Query used for:\
`  `- Auth state\
`  `- Subjects & topics\
`  `- Availability slots\
`  `- Bookings\
\- Local state used only for UI interactions

10\. Middleware & Route Protection\
\
\- Next.js middleware.ts checks session validity\
\- Redirects unauthenticated users to /auth/login\
\- Prevents role mismatch access

11\. Environment Variables\
\
NEXT\_PUBLIC\_API\_BASE\_URL\
NEXT\_PUBLIC\_APP\_NAME\
\
Configured via Vercel environment settings

12\. Deployment on Vercel\
\
\- GitHub repository connected to Vercel\
\- Automatic builds on push\
\- App Router compatible\
\- Environment variables configured in dashboard

13\. Future Extensions\
\
\- Payment UI integration\
\- Notifications\
\- Admin dashboard\
\- Tutor verification badges\
\- Session rescheduling
