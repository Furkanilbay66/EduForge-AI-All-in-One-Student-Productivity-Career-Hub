import { useAuth } from '../contexts/AuthContext';
import {
  BookOpen, CalendarDays, Map, FileText, Lightbulb, Briefcase,
  TrendingUp, Clock, Target, Zap, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const focusData = [
  { day: 'Mon', hours: 3.2 }, { day: 'Tue', hours: 4.5 }, { day: 'Wed', hours: 2.8 },
  { day: 'Thu', hours: 5.1 }, { day: 'Fri', hours: 3.9 }, { day: 'Sat', hours: 6.2 }, { day: 'Sun', hours: 4.0 },
];

const quickLinks = [
  { to: '/study', label: 'Study Assistant', icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
  { to: '/planner', label: 'Planner', icon: CalendarDays, color: 'from-emerald-500 to-teal-600' },
  { to: '/roadmap', label: 'Career Roadmap', icon: Map, color: 'from-purple-500 to-violet-600' },
  { to: '/cv', label: 'CV Builder', icon: FileText, color: 'from-orange-500 to-red-500' },
  { to: '/projects', label: 'Projects', icon: Lightbulb, color: 'from-yellow-500 to-amber-600' },
  { to: '/tracker', label: 'Job Tracker', icon: Briefcase, color: 'from-pink-500 to-rose-600' },
];

const stats = [
  { label: 'Focus Hours', value: '29.7h', icon: Clock, change: '+12%', color: 'text-blue-500' },
  { label: 'Tasks Done', value: '47', icon: Target, change: '+8%', color: 'text-emerald-500' },
  { label: 'Streak', value: '12 days', icon: Zap, change: '+3', color: 'text-amber-500' },
  { label: 'Career Progress', value: '68%', icon: TrendingUp, change: '+5%', color: 'text-purple-500' },
];

const tasks = [
  { text: 'Review Data Structures lecture notes', done: true },
  { text: 'Complete ML assignment (due tomorrow)', done: false },
  { text: 'Update resume with new project', done: false },
  { text: 'Practice LeetCode — 2 problems', done: false },
  { text: 'Attend career fair prep workshop', done: true },
];

export default function Dashboard() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
          {greeting}, {user?.name || 'Student'} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's your academic overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, change, color }) => (
          <div key={label} className="glass-card">
            <div className="flex items-start justify-between">
              <Icon className={`w-5 h-5 ${color}`} />
              <span className="text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                {change}
              </span>
            </div>
            <p className="text-2xl font-bold mt-3 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Focus Chart */}
        <div className="lg:col-span-2 glass-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg dark:text-white">Focus Hours This Week</h2>
            <span className="text-xs text-gray-400">Total: 29.7h</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={focusData}>
                <defs>
                  <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f030" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(30,30,50,0.9)', border: 'none',
                    borderRadius: '0.75rem', color: '#fff', fontSize: '0.8rem',
                  }}
                />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={2}
                  fill="url(#focusGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="glass-card">
          <h2 className="font-semibold text-lg mb-4 dark:text-white">Today's Tasks</h2>
          <div className="space-y-3">
            {tasks.map((task, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked={task.done}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                <span className={`text-sm ${task.done ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  {task.text}
                </span>
              </label>
            ))}
          </div>
          <Link to="/planner" className="mt-4 text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1">
            View full planner <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="font-semibold text-lg mb-4 dark:text-white">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickLinks.map(({ to, label, icon: Icon, color }) => (
            <Link key={to} to={to} className="glass-card text-center group cursor-pointer">
              <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium dark:text-gray-200">{label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
