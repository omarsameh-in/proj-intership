# InternWay Platform

## Overview
InternWay is a comprehensive gateway for internships and professional development opportunities. Built with modern web technologies, this platform delivers a seamless, responsive, and intuitive user experience. The project serves as a sophisticated frontend application developed using Next.js 14 and React 18, featuring advanced styling with CSS Modules and Bootstrap 5 integration.

---

## Key Features

### Modern User Interface & Experience
- **Interactive Landing Page**: Features dynamic sections including Home, Features, and How it Works with smooth scrolling navigation.
- **Responsive Design**: Fully adaptable layout ensuring optimal viewing across all devices (Desktop, Tablet, Mobile).
- **Visual Effects**: Implements modern design principles with subtle animations, gradients, and refined micro-interactions.

### Student Dashboard & Services
- **Sessions Management**: A dedicated "My Sessions" area allowing students to manage mentorship appointments.
    - **Status Tracking**: Visual indicators for Confirmed, Waiting, and Completed sessions.
    - **Action Controls**: direct options to Join Meeting, Reschedule, Cancel, or Leave Reviews.
- **Profile Management**: Comprehensive profile section for students to manage personal information, education, and skills.
- **Mentorships & Internships**: Browsing capabilities for finding mentors and internship opportunities (UI integrated).

### Theming System
- **Dark/Light Mode**: Full system-wide theme support with persistent user preference storage.
- **Consistent Styling**: Unified color palettes and component styles across both modes.

### Internationalization (i18n)
- **Bilingual Support**: Complete support for English and Arabic languages.
- **RTL/LTR Layouts**: Automatic layout direction adjustment based on the selected language.

### Authentication & Authorization
- **Secure Login**: Robust form validation and secure token handling.
- **Role-Based Access**: Dedicated workflows and interfaces for different user roles (Student, Company, Mentor).
- **Account Recovery**: Integrated password reset and recovery flow.

---

## Technology Stack

| Technology | Purpose |
| --- | --- |
| **Next.js 14** | Core React framework using App Router architecture. |
| **React 18** | UI library for building interactive component-based interfaces. |
| **TypeScript** | Static typing for enhanced code quality and maintainability. |
| **Bootstrap 5** | Responsive grid system and utility classes. |
| **CSS Modules** | Scoped styling for component isolation. |
| **Lucide React** | Modern, lightweight icon set. |
| **Axios** | HTTP client for backend communication. |

---

## Project Structure

```
app/
├── context/          # Global state management (Theme, Language)
├── student/          # Student-specific protected routes
│   ├── dashboard/    # Student main dashboard
│   ├── sessions/     # Mentorship sessions management
│   ├── profile/      # Student profile settings
│   ├── internships/  # Internship listings
│   └── mentorships/  # Mentor browsing
├── login/            # Authentication pages
├── signup/           # Registration flows
├── lib/              # Utilities and API configuration
├── locales/          # Translation files
└── globalStyles.css  # Global design tokens
```

---

## Getting Started

Follow these steps to set up the project locally:

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/omarsameh-in/proj-intership.git
    cd proj-intership
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **Access the Application**
    Open your browser and navigate to `http://localhost:3000`

---

## Backend Integration

The project is configured to communicate with a RESTful API. The API client is centrally managed in `app/lib/api.ts`.

### Environment Configuration
Create a `.env` file in the root directory to define your API endpoint:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Deployment

The application is deployed and hosted on Vercel. Feature updates are automatically built and deployed upon pushing to the main branch.

**[Live Demo Link](https://ui-one-steel-31.vercel.app/student/sessions)**

---

## Copyright

© 2024 InternWay Platform. All Rights Reserved.
