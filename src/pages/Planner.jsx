import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CalendarDays, Play, Pause, RotateCcw, Coffee, Brain, BarChart3, Plus, X, GripVertical } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8AM to 9PM

const defaultEvents = [
  { id: '1', day: 0, hour: 9, duration: 2, title: 'Data Structures', color: 'bg-blue-500' },
  { id: '2', day: 0, hour: 14, duration: 1, title: 'Linear Algebra', color: 'bg-purple-500' },
  { id: '3', day: 1, hour: 10, duration: 2, title: 'Operating Systems', color: 'bg-emerald-500' },
  { id: '4', day: 2, hour: 9, duration: 2, title: 'Data Structures', color: 'bg-blue-500' },
  { id: '5', day: 2, hour: 13, duration: 1, title: 'ML Lab', color: 'bg-amber-500' },
  { id: '6', day: 3, hour: 11, duration: 1, title: 'Database Systems', color: 'bg-pink-500' },
  { id: '7', day: 4, hour: 9, duration: 2, title: 'Operating Systems', color: 'bg-emerald-500' },
];

const suggestedTasks = [
  { text: 'Review BFS/DFS algorithms', priority: 'high', time: '45min' },
  { text: 'Complete OS assignment #4', priority: 'high', time: '2h' },
  { text: 'Read Chapter 7 — DB Normalization', priority: 'medium', time: '1h' },
  { text: 'Practice LeetCode medium problems', priority: 'medium', time: '1h' },
  { text: 'Organize study notes for midterm', priority: 'low', time: '30min' },
];

const focusStats = [
  { day: 'Mon', minutes: 185 }, { day: 'Tue', minutes: 240 }, { day: 'Wed', minutes: 150 },
  { day: 'Thu', minutes: 310 }, { day: 'Fri', minutes: 200 }, { day: 'Sat', minutes: 120 }, { day: 'Sun', minutes: 90 },
];

export default function Planner() {
  const [events, setEvents] = useState(defaultEvents);
  const [mode, setMode] = useState('focus'); // focus | short | long
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [tab, setTab] = useState('schedule');
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', day: 0, hour: 9, duration: 1 });
  const intervalRef = useRef(null);

  const durations = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(intervalRef.current);
    }
    if (timeLeft === 0 && running) {
      setRunning(false);
      if (mode === 'focus') setSessions(s => s + 1);
      new Audio('data:audio/wav;base64,UklGRl9vT19teleVmF0YQBAAAAWQAAABAABAAQABAAAA').play().catch(() => {});
    }
  }, [running, timeLeft, mode]);

  const reset = useCallback((m) => {
    setMode(m || mode);
    setTimeLeft(durations[m || mode]);
    setRunning(false);
  }, [mode]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const addEvent = () => {
    if (!newEvent.title) return;
    setEvents(prev => [...prev, {
      ...newEvent, id: Date.now().toString(),
      color: ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-pink-500'][Math.floor(Math.random() * 5)]
    }]);
    setShowAdd(false);
    setNewEvent({ title: '', day: 0, hour: 9, duration: 1 });
  };

  const removeEvent = (id) => setEvents(prev => prev.filter(e => e.id !== id));

  const priorityColor = { high: 'text-red-500 bg-red-50 dark:bg-red-900/20', medium: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20', low: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' };

  const tabs = [
    { id: 'schedule', label: 'Weekly Schedule', icon: CalendarDays },
    { id: 'pomodoro', label: 'Pomodoro Timer', icon: Brain },
    { id: 'stats', label: 'Focus Stats', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <CalendarDays className="w-7 h-7 text-primary-500" /> Smart Planner
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your schedule, focus sessions, and daily tasks</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              tab === id
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                : 'bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800'
            }`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Weekly Schedule */}
      {tab === 'schedule' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold dark:text-white">Weekly Schedule</h2>
            <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-1 text-sm">
              <Plus className="w-4 h-4" /> Add Event
            </button>
          </div>

          {showAdd && (
            <div className="glass-card space-y-3 animate-slide-up">
              <div className="flex items-center justify-between">
                <h3 className="font-medium dark:text-white">New Event</h3>
                <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
              </div>
              <input value={newEvent.title} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))}
                className="input-field" placeholder="Event name..." />
              <div className="grid grid-cols-3 gap-3">
                <select value={newEvent.day} onChange={e => setNewEvent(p => ({ ...p, day: +e.target.value }))}
                  className="input-field">
                  {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                </select>
                <select value={newEvent.hour} onChange={e => setNewEvent(p => ({ ...p, hour: +e.target.value }))}
                  className="input-field">
                  {HOURS.map(h => <option key={h} value={h}>{h}:00</option>)}
                </select>
                <select value={newEvent.duration} onChange={e => setNewEvent(p => ({ ...p, duration: +e.target.value }))}
                  className="input-field">
                  {[1, 2, 3].map(d => <option key={d} value={d}>{d}h</option>)}
                </select>
              </div>
              <button onClick={addEvent} className="btn-primary text-sm">Add to Schedule</button>
            </div>
          )}

          <div className="glass-card overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-8 gap-px bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 p-2" />
                {DAYS.map(d => (
                  <div key={d} className="bg-gray-50 dark:bg-gray-800 p-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {d.slice(0, 3)}
                  </div>
                ))}
                {HOURS.map(h => (
                  <React.Fragment key={`row-${h}`}>
                    <div className="bg-white dark:bg-gray-900 p-2 text-xs text-gray-400 text-right pr-3">
                      {h}:00
                    </div>
                    {DAYS.map((_, di) => {
                      const evt = events.find(e => e.day === di && e.hour === h);
                      return (
                        <div key={`${h}-${di}`} className="bg-white dark:bg-gray-900 p-1 min-h-[40px] relative">
                          {evt && (
                            <div className={`${evt.color} text-white text-[10px] font-medium px-2 py-1 rounded-lg leading-tight group relative`}
                              style={{ minHeight: `${evt.duration * 40 - 8}px` }}>
                              {evt.title}
                              <button onClick={() => removeEvent(evt.id)}
                                className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* AI Suggested Tasks */}
          <div className="glass-card">
            <h3 className="font-semibold mb-3 dark:text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary-500" /> AI-Suggested Daily Tasks
            </h3>
            <div className="space-y-2">
              {suggestedTasks.map((task, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <GripVertical className="w-4 h-4 text-gray-300 dark:text-gray-600 cursor-grab" />
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-500" />
                  <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{task.text}</span>
                  <span className={`badge text-xs ${priorityColor[task.priority]}`}>{task.priority}</span>
                  <span className="text-xs text-gray-400">{task.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pomodoro Timer */}
      {tab === 'pomodoro' && (
        <div className="flex flex-col items-center space-y-8 py-8">
          <div className="flex gap-3">
            {[{ m: 'focus', l: 'Focus', icon: Brain }, { m: 'short', l: 'Short Break', icon: Coffee }, { m: 'long', l: 'Long Break', icon: Coffee }].map(({ m, l, icon: Icon }) => (
              <button key={m} onClick={() => reset(m)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                  mode === m ? 'bg-primary-500 text-white' : 'bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400'
                }`}>
                <Icon className="w-4 h-4" /> {l}
              </button>
            ))}
          </div>

          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"
                className="text-gray-200 dark:text-gray-700" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="url(#timerGrad)" strokeWidth="3"
                strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - timeLeft / durations[mode])}`}
                className="transition-all duration-1000" />
              <defs>
                <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="text-center z-10">
              <p className="text-5xl font-bold tracking-tight dark:text-white">{formatTime(timeLeft)}</p>
              <p className="text-sm text-gray-400 mt-2 capitalize">{mode === 'focus' ? 'Focus Time' : mode === 'short' ? 'Short Break' : 'Long Break'}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setRunning(!running)}
              className="btn-primary flex items-center gap-2 px-8 py-3 text-lg">
              {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {running ? 'Pause' : 'Start'}
            </button>
            <button onClick={() => reset()} className="btn-secondary flex items-center gap-2 px-6 py-3">
              <RotateCcw className="w-5 h-5" /> Reset
            </button>
          </div>

          <div className="glass-card text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Sessions completed today</p>
            <p className="text-3xl font-bold text-primary-500 mt-1">{sessions}</p>
            <div className="flex justify-center gap-1 mt-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i < sessions ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Focus Stats */}
      {tab === 'stats' && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="glass-card text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">This Week</p>
              <p className="text-3xl font-bold text-primary-500 mt-1">21.6h</p>
              <p className="text-xs text-emerald-500 mt-1">+15% from last week</p>
            </div>
            <div className="glass-card text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Today</p>
              <p className="text-3xl font-bold text-emerald-500 mt-1">3.1h</p>
              <p className="text-xs text-gray-400 mt-1">Goal: 4h</p>
            </div>
            <div className="glass-card text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg / Day</p>
              <p className="text-3xl font-bold text-amber-500 mt-1">3.1h</p>
              <p className="text-xs text-gray-400 mt-1">Best: 5.2h (Thu)</p>
            </div>
          </div>

          <div className="glass-card">
            <h3 className="font-semibold mb-4 dark:text-white">Daily Focus Minutes</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={focusStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f030" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ background: 'rgba(30,30,50,0.9)', border: 'none', borderRadius: '0.75rem', color: '#fff', fontSize: '0.8rem' }}
                    formatter={(v) => [`${v} min`, 'Focus']}
                  />
                  <Bar dataKey="minutes" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
