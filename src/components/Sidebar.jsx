import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, BookOpen, CalendarDays, Map, FileText,
  Lightbulb, Briefcase, Users, Sun, Moon, Menu, X, LogOut, GraduationCap
} from 'lucide-react';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/study', label: 'Study Assistant', icon: BookOpen },
  { to: '/planner', label: 'Planner', icon: CalendarDays },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
  { to: '/cv', label: 'CV Builder', icon: FileText },
  { to: '/projects', label: 'Projects', icon: Lightbulb },
  { to: '/tracker', label: 'Tracker', icon: Briefcase },
  { to: '/community', label: 'Community', icon: Users },
];

export default function Sidebar() {
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-primary-500" />
          <span className="font-bold text-lg bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
            EduForge AI
          </span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-50 w-64 glass flex flex-col transition-transform duration-300
        lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent leading-tight">
              EduForge AI
            </h1>
            <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Student Hub</p>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 space-y-3 border-t border-gray-200/50 dark:border-gray-700/50">
          <button
            onClick={toggle}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>

          {user && (
            <div className="flex items-center gap-3 px-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate dark:text-gray-200">{user.name}</p>
                <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
              </div>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
