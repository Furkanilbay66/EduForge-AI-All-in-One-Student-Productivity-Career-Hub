const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const userId = localStorage.getItem("eduforge_user")
    ? JSON.parse(localStorage.getItem("eduforge_user")).id
    : "default";

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

const api = {
  // Auth
  login: (data) => request("/auth/login", { method: "POST", body: data }),
  me: () => request("/auth/me"),

  // Study
  summarize: (data) =>
    request("/study/summarize", { method: "POST", body: data }),
  quiz: (data) => request("/study/quiz", { method: "POST", body: data }),
  chat: (message, context, fileData) =>
    request("/study/chat", {
      method: "POST",
      body: { message, context, fileData },
    }),

  // Planner
  getEvents: () => request("/planner/events"),
  addEvent: (data) =>
    request("/planner/events", { method: "POST", body: data }),
  deleteEvent: (id) => request(`/planner/events/${id}`, { method: "DELETE" }),
  recordPomodoro: (data) =>
    request("/planner/pomodoro", { method: "POST", body: data }),
  getSuggestedTasks: () => request("/planner/suggested-tasks"),
  getFocusStats: () => request("/planner/focus-stats"),

  // Roadmap
  getRoles: () => request("/roadmap/roles"),
  getRoadmap: (role) => request(`/roadmap/${encodeURIComponent(role)}`),
  getRoadmapProgress: (role) =>
    request(`/roadmap/progress/${encodeURIComponent(role)}`),
  updateRoadmapProgress: (role, progress) =>
    request(`/roadmap/progress/${encodeURIComponent(role)}`, {
      method: "PUT",
      body: { progress },
    }),

  // CV
  saveCv: (data) => request("/cv/save", { method: "POST", body: data }),
  loadCv: () => request("/cv/load"),
  suggestBullets: (text) =>
    request("/cv/suggest-bullets", { method: "POST", body: { text } }),
  linkedinSuggestions: () => request("/cv/linkedin-suggestions"),

  // Projects
  generateIdeas: (data) =>
    request("/projects/generate", { method: "POST", body: data }),
  analyzeCode: (data) =>
    request("/projects/analyze", { method: "POST", body: data }),

  // Tracker
  getApplications: () => request("/tracker/applications"),
  addApplication: (data) =>
    request("/tracker/applications", { method: "POST", body: data }),
  updateApplication: (id, data) =>
    request(`/tracker/applications/${id}`, { method: "PUT", body: data }),
  deleteApplication: (id) =>
    request(`/tracker/applications/${id}`, { method: "DELETE" }),
  getInternships: () => request("/tracker/internships"),

  // Community
  getPosts: () => request("/community/posts"),
  createPost: (data) =>
    request("/community/posts", { method: "POST", body: data }),
  likePost: (id) => request(`/community/posts/${id}/like`, { method: "POST" }),
  addComment: (id, data) =>
    request(`/community/posts/${id}/comments`, { method: "POST", body: data }),
  getMentors: () => request("/community/mentors"),
};

export default api;
