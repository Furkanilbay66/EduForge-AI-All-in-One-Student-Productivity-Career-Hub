import { useState } from 'react';
import { Users, ThumbsUp, MessageSquare, Code2, FileText, Search, Send, Star, ExternalLink, UserPlus } from 'lucide-react';

const showcaseProjects = [
  { id: 1, title: 'AI Study Planner', author: 'Alex Chen', description: 'A smart planner that uses GPT to prioritize tasks based on deadlines and difficulty.',
    tech: ['React', 'OpenAI', 'Firebase'], upvotes: 47, comments: 12, avatar: 'A' },
  { id: 2, title: 'CodeReview Bot', author: 'Sarah Kim', description: 'GitHub bot that automatically reviews PRs and suggests improvements using AST analysis.',
    tech: ['Python', 'GitHub API', 'AST'], upvotes: 35, comments: 8, avatar: 'S' },
  { id: 3, title: 'Campus Connect', author: 'James Lee', description: 'Social platform for university students to find study groups and share resources.',
    tech: ['Next.js', 'Prisma', 'PostgreSQL'], upvotes: 29, comments: 15, avatar: 'J' },
  { id: 4, title: 'ML Pipeline Builder', author: 'Priya Patel', description: 'Visual drag-and-drop tool for building and deploying machine learning pipelines.',
    tech: ['Python', 'React Flow', 'Docker'], upvotes: 52, comments: 20, avatar: 'P' },
  { id: 5, title: 'Budget Buddy', author: 'Mike Ross', description: 'Personal finance tracker with spending insights and savings goals for students.',
    tech: ['Flutter', 'Dart', 'SQLite'], upvotes: 22, comments: 5, avatar: 'M' },
];

const peerReviews = [
  { id: 1, type: 'code', title: 'React Hook for API caching', author: 'David Wu', status: 'open', responses: 3 },
  { id: 2, type: 'cv', title: 'SWE Intern Resume Review', author: 'Emma Zhang', status: 'open', responses: 7 },
  { id: 3, type: 'code', title: 'Binary tree serialization', author: 'Raj Mehta', status: 'resolved', responses: 5 },
  { id: 4, type: 'cv', title: 'Data Science CV Feedback', author: 'Lisa Park', status: 'open', responses: 2 },
];

const mentors = [
  { name: 'Dr. Sarah Johnson', role: 'Senior SWE @ Google', expertise: ['System Design', 'Algorithms', 'Career Advice'], available: true, rating: 4.9 },
  { name: 'Michael Torres', role: 'Staff Engineer @ Meta', expertise: ['Frontend', 'React', 'Performance'], available: true, rating: 4.8 },
  { name: 'Aisha Rahman', role: 'ML Engineer @ DeepMind', expertise: ['Machine Learning', 'Python', 'Research'], available: false, rating: 4.9 },
  { name: 'Chris Lee', role: 'DevOps Lead @ AWS', expertise: ['Cloud', 'Docker', 'CI/CD'], available: true, rating: 4.7 },
];

export default function Community() {
  const [tab, setTab] = useState('showcase');
  const [votes, setVotes] = useState({});
  const [search, setSearch] = useState('');
  const [showSubmit, setShowSubmit] = useState(false);

  const toggleVote = (id) => {
    setVotes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProjects = showcaseProjects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.tech.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const tabs = [
    { id: 'showcase', label: 'Project Showcase', icon: Star },
    { id: 'reviews', label: 'Peer Reviews', icon: Code2 },
    { id: 'mentors', label: 'Mentor Matching', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <Users className="w-7 h-7 text-primary-500" /> Community & Mentorship
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Showcase projects, get peer reviews, and connect with mentors</p>
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

      {/* Project Showcase */}
      {tab === 'showcase' && (
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="input-field pl-10" placeholder="Search projects or technologies..." />
            </div>
            <button onClick={() => setShowSubmit(!showSubmit)} className="btn-primary flex items-center gap-1">
              <Send className="w-4 h-4" /> Submit Project
            </button>
          </div>

          {showSubmit && (
            <div className="glass-card space-y-3 animate-slide-up">
              <h3 className="font-medium dark:text-white">Submit Your Project</h3>
              <input className="input-field" placeholder="Project Title" />
              <textarea className="input-field min-h-[80px]" placeholder="Description..." />
              <input className="input-field" placeholder="Tech Stack (comma separated)" />
              <input className="input-field" placeholder="GitHub/Demo URL" />
              <button className="btn-primary text-sm">Submit for Review</button>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {filteredProjects.map(project => (
              <div key={project.id} className="glass-card">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                    {project.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold dark:text-white">{project.title}</h3>
                    <p className="text-xs text-gray-400">by {project.author}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.tech.map(t => (
                    <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={() => toggleVote(project.id)}
                    className={`flex items-center gap-1.5 text-sm font-medium transition ${
                      votes[project.id] ? 'text-primary-500' : 'text-gray-400 hover:text-primary-500'
                    }`}>
                    <ThumbsUp className={`w-4 h-4 ${votes[project.id] ? 'fill-current' : ''}`} />
                    {project.upvotes + (votes[project.id] ? 1 : 0)}
                  </button>
                  <span className="flex items-center gap-1.5 text-sm text-gray-400">
                    <MessageSquare className="w-4 h-4" /> {project.comments}
                  </span>
                  <a href="#" className="ml-auto text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
                    View <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Peer Reviews */}
      {tab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <button className="btn-primary flex items-center gap-1 text-sm">
              <Code2 className="w-4 h-4" /> Request Code Review
            </button>
            <button className="btn-secondary flex items-center gap-1 text-sm">
              <FileText className="w-4 h-4" /> Request CV Review
            </button>
          </div>

          <div className="space-y-3">
            {peerReviews.map(review => (
              <div key={review.id} className="glass-card flex items-center gap-4 flex-wrap">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  review.type === 'code' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
                }`}>
                  {review.type === 'code'
                    ? <Code2 className="w-5 h-5 text-blue-500" />
                    : <FileText className="w-5 h-5 text-amber-500" />
                  }
                </div>
                <div className="flex-1 min-w-[150px]">
                  <h3 className="font-medium dark:text-white">{review.title}</h3>
                  <p className="text-xs text-gray-400">by {review.author}</p>
                </div>
                <span className={`badge ${review.status === 'open' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                  {review.status}
                </span>
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> {review.responses}
                </span>
                <button className="btn-secondary text-xs px-3 py-1.5">Review</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mentor Matching */}
      {tab === 'mentors' && (
        <div className="grid md:grid-cols-2 gap-4">
          {mentors.map((mentor, i) => (
            <div key={i} className="glass-card">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl">
                  {mentor.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold dark:text-white">{mentor.name}</h3>
                    <div className={`w-2 h-2 rounded-full ${mentor.available ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{mentor.role}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{mentor.rating}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {mentor.expertise.map(e => (
                  <span key={e} className="text-[11px] px-2 py-0.5 rounded-md bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                    {e}
                  </span>
                ))}
              </div>
              <button disabled={!mentor.available}
                className={`mt-4 w-full flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-xl transition ${
                  mentor.available
                    ? 'btn-primary'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                }`}>
                <UserPlus className="w-4 h-4" />
                {mentor.available ? 'Request Mentorship' : 'Currently Unavailable'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
