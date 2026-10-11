// Simple in-memory store for MVP
// Replace with a real database (PostgreSQL, MongoDB, etc.) in production

const store = {
  users: new Map(),
  plannerEvents: new Map(),
  plannerTasks: new Map(),
  pomodoroSessions: new Map(),
  roadmapProgress: new Map(),
  cvData: new Map(),
  applications: new Map(),
  posts: new Map(),
  communityProjects: new Map(),
  votes: new Map(),
};

export default store;
