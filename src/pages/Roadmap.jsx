import { useState } from 'react';
import { Map, ChevronRight, CheckCircle2, Circle, Clock, ExternalLink, Sparkles } from 'lucide-react';

const roles = [
  'Frontend Engineer', 'Backend Engineer', 'Full-Stack Developer', 'Java Developer',
  'DevOps Engineer', 'AI/ML Engineer', 'Data Scientist', 'iOS Developer',
  'Android Developer', 'Cloud Architect', 'Cybersecurity Analyst', 'Blockchain Developer'
];

const roadmaps = {
  'Frontend Engineer': [
    { stage: 'HTML & CSS Fundamentals', time: '2-3 weeks', skills: ['HTML5 Semantics', 'CSS3', 'Flexbox', 'Grid', 'Responsive Design'],
      resources: [{ name: 'MDN Web Docs', url: '#', free: true }, { name: 'freeCodeCamp', url: '#', free: true }], done: true },
    { stage: 'JavaScript Core', time: '4-6 weeks', skills: ['ES6+', 'DOM Manipulation', 'Async/Await', 'Fetch API', 'Closures'],
      resources: [{ name: 'JavaScript.info', url: '#', free: true }, { name: 'Eloquent JavaScript', url: '#', free: true }], done: true },
    { stage: 'React Ecosystem', time: '6-8 weeks', skills: ['JSX', 'Hooks', 'State Management', 'React Router', 'Context API'],
      resources: [{ name: 'React Docs', url: '#', free: true }, { name: 'Udemy React Course', url: '#', free: false }], done: false },
    { stage: 'TypeScript', time: '2-3 weeks', skills: ['Types', 'Interfaces', 'Generics', 'Enums', 'Type Guards'],
      resources: [{ name: 'TypeScript Handbook', url: '#', free: true }, { name: 'Total TypeScript', url: '#', free: false }], done: false },
    { stage: 'Testing & Tooling', time: '2-3 weeks', skills: ['Jest', 'React Testing Library', 'Cypress', 'Webpack', 'Vite'],
      resources: [{ name: 'Testing Library Docs', url: '#', free: true }], done: false },
    { stage: 'Advanced Topics', time: '4-6 weeks', skills: ['Next.js', 'Performance', 'Accessibility', 'SSR/SSG', 'PWA'],
      resources: [{ name: 'Next.js Docs', url: '#', free: true }, { name: 'Web.dev', url: '#', free: true }], done: false },
  ],
  'AI/ML Engineer': [
    { stage: 'Python & Math Foundations', time: '4-6 weeks', skills: ['Python', 'NumPy', 'Linear Algebra', 'Calculus', 'Statistics'],
      resources: [{ name: 'Khan Academy', url: '#', free: true }, { name: '3Blue1Brown', url: '#', free: true }], done: true },
    { stage: 'Data Analysis & Visualization', time: '3-4 weeks', skills: ['Pandas', 'Matplotlib', 'Seaborn', 'Data Cleaning', 'EDA'],
      resources: [{ name: 'Kaggle Learn', url: '#', free: true }], done: true },
    { stage: 'Machine Learning', time: '6-8 weeks', skills: ['Scikit-learn', 'Regression', 'Classification', 'Clustering', 'Model Evaluation'],
      resources: [{ name: 'Andrew Ng ML Course', url: '#', free: true }, { name: 'Hands-On ML Book', url: '#', free: false }], done: false },
    { stage: 'Deep Learning', time: '6-8 weeks', skills: ['PyTorch', 'Neural Networks', 'CNNs', 'RNNs', 'Transformers'],
      resources: [{ name: 'fast.ai', url: '#', free: true }, { name: 'Deep Learning Book', url: '#', free: true }], done: false },
    { stage: 'NLP & Computer Vision', time: '4-6 weeks', skills: ['Hugging Face', 'BERT', 'GPT', 'OpenCV', 'YOLO'],
      resources: [{ name: 'Hugging Face Course', url: '#', free: true }], done: false },
    { stage: 'MLOps & Deployment', time: '3-4 weeks', skills: ['Docker', 'MLflow', 'FastAPI', 'AWS SageMaker', 'Model Monitoring'],
      resources: [{ name: 'Made With ML', url: '#', free: true }], done: false },
  ],
};

// Generate generic roadmap for roles not explicitly defined
const genericRoadmap = (role) => [
  { stage: 'Core Fundamentals', time: '4-6 weeks', skills: ['Programming Basics', 'Data Structures', 'Algorithms', 'Git', 'Linux'],
    resources: [{ name: 'freeCodeCamp', url: '#', free: true }], done: false },
  { stage: `${role} Basics`, time: '6-8 weeks', skills: ['Core Technologies', 'Frameworks', 'Best Practices', 'Design Patterns'],
    resources: [{ name: 'Official Docs', url: '#', free: true }], done: false },
  { stage: 'Intermediate Skills', time: '6-8 weeks', skills: ['Advanced Concepts', 'Testing', 'Debugging', 'Performance'],
    resources: [{ name: 'Udemy', url: '#', free: false }], done: false },
  { stage: 'Projects & Portfolio', time: '4-6 weeks', skills: ['Personal Projects', 'Open Source', 'Portfolio', 'Blog'],
    resources: [{ name: 'GitHub', url: '#', free: true }], done: false },
  { stage: 'Job Preparation', time: '3-4 weeks', skills: ['Resume', 'Interview Prep', 'System Design', 'Behavioral'],
    resources: [{ name: 'LeetCode', url: '#', free: true }], done: false },
];

export default function Roadmap() {
  const [selected, setSelected] = useState('');
  const [progress, setProgress] = useState({});

  const stages = selected ? (roadmaps[selected] || genericRoadmap(selected)) : [];
  const completed = stages.filter((s, i) => progress[`${selected}-${i}`] ?? s.done).length;
  const pct = stages.length ? Math.round((completed / stages.length) * 100) : 0;

  const toggleStage = (i) => {
    const key = `${selected}-${i}`;
    setProgress(prev => ({ ...prev, [key]: !(prev[key] ?? stages[i].done) }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <Map className="w-7 h-7 text-primary-500" /> Career Roadmap Generator
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Select a role and get a personalized learning path</p>
      </div>

      {/* Role Selection */}
      <div className="glass-card">
        <h2 className="font-semibold mb-4 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary-500" /> Choose Your Target Role
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {roles.map(role => (
            <button key={role} onClick={() => setSelected(role)}
              className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition border ${
                selected === role
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300'
              }`}>
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      {selected && (
        <div className="space-y-4 animate-slide-up">
          {/* Progress Bar */}
          <div className="glass-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold dark:text-white">{selected} — Progress</h3>
              <span className="text-sm font-bold text-primary-500">{pct}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-2">{completed} of {stages.length} stages completed</p>
          </div>

          {/* Stages */}
          <div className="space-y-4">
            {stages.map((stage, i) => {
              const isDone = progress[`${selected}-${i}`] ?? stage.done;
              return (
                <div key={i} className={`glass-card ${isDone ? 'border-emerald-200 dark:border-emerald-800' : ''}`}>
                  <div className="flex items-start gap-4">
                    <button onClick={() => toggleStage(i)} className="mt-1">
                      {isDone
                        ? <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        : <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                      }
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className={`font-semibold ${isDone ? 'text-emerald-600 dark:text-emerald-400 line-through' : 'dark:text-white'}`}>
                          Stage {i + 1}: {stage.stage}
                        </h3>
                        <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {stage.time}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {stage.skills.map(skill => (
                          <span key={skill} className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {stage.resources.map(r => (
                          <a key={r.name} href={r.url}
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary-500 hover:text-primary-600 transition">
                            <ExternalLink className="w-3 h-3" /> {r.name}
                            {!r.free && <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full ml-1">Paid</span>}
                          </a>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 mt-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
