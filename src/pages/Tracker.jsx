import { useState } from 'react';
import {
  Briefcase, Plus, X, Search, MessageSquare, DollarSign,
  Building2, Calendar, ChevronDown, Send, Bot, MapPin
} from 'lucide-react';

const statusColors = {
  Applied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Phone Screen': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Technical': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Onsite': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Offer: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  Rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const defaultApps = [
  { id: 1, company: 'Google', role: 'SWE Intern', date: '2026-03-15', status: 'Technical', notes: 'LC medium/hard' },
  { id: 2, company: 'Meta', role: 'Frontend Intern', date: '2026-03-10', status: 'Phone Screen', notes: 'React focus' },
  { id: 3, company: 'Stripe', role: 'Backend Intern', date: '2026-03-20', status: 'Applied', notes: '' },
  { id: 4, company: 'Amazon', role: 'SDE Intern', date: '2026-02-28', status: 'Offer', notes: 'Team match pending' },
  { id: 5, company: 'Spotify', role: 'Data Engineer Intern', date: '2026-03-05', status: 'Rejected', notes: '' },
];

const interviewBank = {
  Google: [
    'Design a URL shortener',
    'Implement LRU Cache',
    'Find the longest substring without repeating characters',
    'Design a rate limiter',
  ],
  Meta: [
    'Implement a news feed ranking algorithm',
    'Build a typeahead suggestion system',
    'Merge K sorted linked lists',
    'Design Instagram stories feature',
  ],
  General: [
    'Tell me about a time you dealt with a difficult team member',
    'Why do you want to work here?',
    'What is your biggest strength?',
    'Describe a challenging project and how you handled it',
  ],
};

const salaryData = [
  { role: 'SWE Intern', location: 'San Francisco', min: 7000, max: 12000, avg: 9500 },
  { role: 'SWE Intern', location: 'New York', min: 6500, max: 11000, avg: 8800 },
  { role: 'SWE Intern', location: 'Seattle', min: 7000, max: 11500, avg: 9200 },
  { role: 'SWE Intern', location: 'Austin', min: 5500, max: 9000, avg: 7200 },
  { role: 'Data Science Intern', location: 'San Francisco', min: 7500, max: 13000, avg: 10000 },
  { role: 'Frontend Intern', location: 'Remote', min: 5000, max: 9000, avg: 7000 },
];

export default function Tracker() {
  const [apps, setApps] = useState(defaultApps);
  const [tab, setTab] = useState('applications');
  const [showAdd, setShowAdd] = useState(false);
  const [newApp, setNewApp] = useState({ company: '', role: '', date: '', status: 'Applied', notes: '' });
  const [search, setSearch] = useState('');
  const [mockMessages, setMockMessages] = useState([
    { role: 'ai', text: "Welcome to the Mock Interview Simulator! I'll ask you technical and behavioral questions. Ready to begin?\n\nLet's start: Tell me about yourself and why you're interested in software engineering." }
  ]);
  const [mockInput, setMockInput] = useState('');

  const addApp = () => {
    if (!newApp.company || !newApp.role) return;
    setApps(prev => [...prev, { ...newApp, id: Date.now() }]);
    setNewApp({ company: '', role: '', date: '', status: 'Applied', notes: '' });
    setShowAdd(false);
  };

  const updateStatus = (id, status) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const removeApp = (id) => setApps(prev => prev.filter(a => a.id !== id));

  const filtered = apps.filter(a =>
    a.company.toLowerCase().includes(search.toLowerCase()) ||
    a.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleMock = (e) => {
    e.preventDefault();
    if (!mockInput.trim()) return;
    const userMsg = mockInput;
    setMockInput('');
    setMockMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setTimeout(() => {
      const followUps = [
        "Good answer! Now, can you walk me through a time when you had to debug a particularly challenging issue? What was your approach?",
        "Interesting perspective. Let's move to a technical question: Can you explain the difference between REST and GraphQL? When would you choose one over the other?",
        "Great! Here's a system design question: How would you design a notification system that handles millions of users? Think about scalability and reliability.",
        "Nice! Final question: Where do you see yourself in 5 years, and how does this role fit into your career goals?",
      ];
      setMockMessages(prev => [...prev, {
        role: 'ai',
        text: followUps[Math.min(prev.filter(m => m.role === 'ai').length, followUps.length - 1)]
      }]);
    }, 1000);
  };

  const tabs = [
    { id: 'applications', label: 'Applications', icon: Briefcase },
    { id: 'interview', label: 'Interview Prep', icon: MessageSquare },
    { id: 'mock', label: 'Mock Interview', icon: Bot },
    { id: 'salary', label: 'Salary Data', icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <Briefcase className="w-7 h-7 text-primary-500" /> Career & Internship Tracker
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track applications, prep for interviews, and compare offers</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              tab === t.id ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                : 'bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400'
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Applications */}
      {tab === 'applications' && (
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="input-field pl-10" placeholder="Search applications..." />
            </div>
            <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Application
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(statusColors).slice(0, 4).map(([status, color]) => (
              <div key={status} className="glass-card text-center py-3">
                <p className="text-2xl font-bold dark:text-white">{apps.filter(a => a.status === status).length}</p>
                <p className="text-xs text-gray-400 mt-1">{status}</p>
              </div>
            ))}
          </div>

          {showAdd && (
            <div className="glass-card space-y-3 animate-slide-up">
              <div className="flex items-center justify-between">
                <h3 className="font-medium dark:text-white">New Application</h3>
                <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                <input className="input-field" placeholder="Company" value={newApp.company} onChange={e => setNewApp(p => ({ ...p, company: e.target.value }))} />
                <input className="input-field" placeholder="Role" value={newApp.role} onChange={e => setNewApp(p => ({ ...p, role: e.target.value }))} />
                <input type="date" className="input-field" value={newApp.date} onChange={e => setNewApp(p => ({ ...p, date: e.target.value }))} />
              </div>
              <input className="input-field" placeholder="Notes" value={newApp.notes} onChange={e => setNewApp(p => ({ ...p, notes: e.target.value }))} />
              <button onClick={addApp} className="btn-primary text-sm">Add Application</button>
            </div>
          )}

          {/* Application List */}
          <div className="space-y-3">
            {filtered.map(app => (
              <div key={app.id} className="glass-card flex items-center gap-4 flex-wrap">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary-500" />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <h3 className="font-semibold dark:text-white">{app.company}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{app.role}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {app.date}
                </div>
                <select value={app.status} onChange={e => updateStatus(app.id, e.target.value)}
                  className={`badge cursor-pointer border-0 ${statusColors[app.status]}`}>
                  {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => removeApp(app.id)} className="text-gray-400 hover:text-red-500 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interview Bank */}
      {tab === 'interview' && (
        <div className="space-y-4">
          {Object.entries(interviewBank).map(([company, questions]) => (
            <div key={company} className="glass-card">
              <h3 className="font-semibold mb-3 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary-500" /> {company}
              </h3>
              <div className="space-y-2">
                {questions.map((q, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <span className="text-xs font-bold text-gray-400 mt-0.5">Q{i + 1}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{q}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mock Interview */}
      {tab === 'mock' && (
        <div className="glass-card flex flex-col h-[500px]">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
            <Bot className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold dark:text-white">AI Mock Interview</h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {mockMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-primary-500 text-white rounded-br-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-bl-md'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleMock} className="flex gap-2">
            <input value={mockInput} onChange={e => setMockInput(e.target.value)}
              className="input-field flex-1" placeholder="Type your answer..." />
            <button type="submit" className="btn-primary px-3">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Salary */}
      {tab === 'salary' && (
        <div className="glass-card">
          <h3 className="font-semibold mb-4 dark:text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary-500" /> Internship Salary Comparison (Monthly)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-500 dark:text-gray-400">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-500 dark:text-gray-400">Location</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-500 dark:text-gray-400">Min</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-500 dark:text-gray-400">Avg</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-500 dark:text-gray-400">Max</th>
                </tr>
              </thead>
              <tbody>
                {salaryData.map((s, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4 font-medium dark:text-gray-300">{s.role}</td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {s.location}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-500 dark:text-gray-400">${s.min.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-semibold text-primary-500">${s.avg.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-gray-500 dark:text-gray-400">${s.max.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
