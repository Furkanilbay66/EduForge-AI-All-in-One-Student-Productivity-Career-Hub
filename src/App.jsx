import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Study from './pages/Study';
import Planner from './pages/Planner';
import Roadmap from './pages/Roadmap';
import CVBuilder from './pages/CVBuilder';
import Projects from './pages/Projects';
import Tracker from './pages/Tracker';
import Community from './pages/Community';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/study" element={<Study />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/cv" element={<CVBuilder />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/community" element={<Community />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}