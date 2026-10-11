# EduForge AI

**AI-powered productivity and career hub for university students.**

A modern full-stack web application that combines study tools, career planning, and community features into a single platform.

## Features

- **AI Study Assistant** — Upload notes and get AI-generated summaries, quizzes, and Q&A chatbot
- **Smart Planner & Pomodoro** — Weekly schedule builder with integrated Pomodoro timer and focus analytics
- **Career Roadmap Generator** — Personalized learning paths for 12+ tech career roles
- **CV Builder & LinkedIn Optimizer** — ATS-friendly resume builder with PDF export and LinkedIn profile tips
- **Project Idea Generator & Code Analyzer** — Get project ideas by keyword and analyze code quality
- **Career & Internship Tracker** — Track applications, prep for interviews with a mock interview simulator
- **Community & Mentorship** — Project showcase, peer code/CV reviews, and mentor matching

## Tech Stack

### Frontend

- React 19 + Vite 8
- Tailwind CSS v4 (glassmorphism design)
- React Router v7
- Recharts (data visualization)
- Lucide React (icons)
- jsPDF (PDF export)

### Backend

- Node.js + Express 5
- In-memory data store (MVP)
- RESTful API with CORS

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone and install all dependencies
npm install
cd frontend && npm install
cd ../backend && npm install
```

### Development

```bash
# Run both frontend and backend concurrently
npm run dev
```

Or run them separately:

```bash
# Backend (port 3001)
cd backend && npm run dev

# Frontend (port 5173)
cd frontend && npm run dev
```

### Access

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- Health check: http://localhost:3001/api/health

## Project Structure

```
eduforge-ai/
├── package.json              # Root scripts (concurrent dev)
├── frontend/
│   ├── src/
│   │   ├── components/       # Layout, Sidebar
│   │   ├── contexts/         # Auth, Theme (dark/light)
│   │   ├── pages/            # All 8 feature pages
│   │   ├── services/         # API client
│   │   └── index.css         # Tailwind + glassmorphism
│   └── vite.config.js        # Vite + API proxy
└── backend/
    └── src/
        ├── server.js          # Express app entry
        ├── store.js           # In-memory data store
        └── routes/            # auth, study, planner, roadmap, cv, projects, tracker, community
```

## API Endpoints

| Method | Endpoint                    | Description                 |
| ------ | --------------------------- | --------------------------- |
| POST   | `/api/auth/login`           | User login                  |
| GET    | `/api/auth/me`              | Get current user            |
| POST   | `/api/study/summarize`      | Generate study summary      |
| POST   | `/api/study/quiz`           | Generate quiz               |
| POST   | `/api/study/chat`           | AI chatbot Q&A              |
| GET    | `/api/planner/events`       | Get schedule events         |
| POST   | `/api/planner/pomodoro`     | Record pomodoro session     |
| GET    | `/api/roadmap/roles`        | List available career roles |
| GET    | `/api/roadmap/:role`        | Get roadmap for a role      |
| POST   | `/api/cv/save`              | Save CV data                |
| POST   | `/api/cv/suggest-bullets`   | AI bullet suggestions       |
| POST   | `/api/projects/generate`    | Generate project ideas      |
| POST   | `/api/projects/analyze`     | Analyze code quality        |
| GET    | `/api/tracker/applications` | Get job applications        |
| GET    | `/api/community/posts`      | Get community posts         |
| GET    | `/api/community/mentors`    | Get mentor listings         |

## Design

- Glassmorphism UI with frosted glass cards
- Dark/light mode with system preference detection
- Responsive mobile-first layout
- Inter font family
- Smooth animations and micro-interactions
- Indigo/emerald accent color palette
