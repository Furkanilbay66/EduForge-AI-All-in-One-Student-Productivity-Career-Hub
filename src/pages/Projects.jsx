import { useState } from 'react';
import { Lightbulb, Code2, Sparkles, Send, FolderTree, GitBranch, Star, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function Projects() {
  const [keywords, setKeywords] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [feedback, setFeedback] = useState(null);
  const [codeLoading, setCodeLoading] = useState(false);
  const [tab, setTab] = useState('ideas');
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [error, setError] = useState('');

  const generateIdeas = async () => {
    if (!keywords.trim()) return;
    setIdeasLoading(true);
    setError('');
    setIdeas([]);
    try {
      const data = await api.generateIdeas({ keywords, interests: keywords, level: 'intermediate' });
      setIdeas(data.ideas || []);
    } catch (err) {
      setError(err.message || 'Failed to generate ideas');
    } finally {
      setIdeasLoading(false);
    }
  };

  const analyzeCode = async () => {
    if (!code.trim()) return;
    setCodeLoading(true);
    setError('');
    setFeedback(null);
    try {
      const data = await api.analyzeCode({ code, language });
      setFeedback(data.analysis);
    } catch (err) {
      setError(err.message || 'Failed to analyze code');
    } finally {
      setCodeLoading(false);
    }
  };

  const severityColor = { high: 'text-red-500 bg-red-50 dark:bg-red-900/20', medium: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20', low: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' };
  const typeIcon = { bug: 'ğŸ›', style: 'ğŸ¨', optimization: 'âš¡', warning: 'âš ï¸', suggestion: 'ğŸ’¡', error: 'ğŸ”´' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <Lightbulb className="w-7 h-7 text-primary-500" /> Project Ideas & Code Analyzer
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Generate project ideas and get AI feedback on your code</p>
      </div>

      <div className="flex gap-2">
        {[{ id: 'ideas', label: 'Project Ideas', icon: Sparkles }, { id: 'code', label: 'Code Analyzer', icon: Code2 }].map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setError(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              tab === t.id ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                : 'bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400'
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="glass-card bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Project Ideas */}
      {tab === 'ideas' && (
        <div className="space-y-4">
          <div className="glass-card">
            <h2 className="font-semibold mb-3 dark:text-white">Enter Your Interests & Keywords</h2>
            <div className="flex gap-3">
              <input value={keywords} onChange={e => setKeywords(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && generateIdeas()}
                className="input-field flex-1" placeholder='e.g., "Python, machine learning, finance"' />
              <button onClick={generateIdeas} disabled={ideasLoading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
                {ideasLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {ideasLoading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>

          {ideas.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4 animate-slide-up">
              {ideas.map((idea, i) => (
                <div key={idea.id || i} className="glass-card cursor-pointer group" onClick={() => setSelectedIdea(selectedIdea === i ? null : i)}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-400" />
                      <span className="text-xs text-gray-400">{idea.estimatedTime}</span>
                    </div>
                    <span className={`badge text-xs ${idea.difficulty === 'Advanced' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : idea.difficulty === 'Beginner' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                      {idea.difficulty}
                    </span>
                  </div>
                  <h3 className="font-semibold dark:text-white mb-2">{idea.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{idea.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(idea.techStack || idea.tech || []).map(t => (
                      <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                        {t}
                      </span>
                    ))}
                  </div>
                  {idea.category && (
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">{idea.category}</span>
                  )}

                  {selectedIdea === i && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
                      <h4 className="text-sm font-medium mb-2 dark:text-gray-300">Features:</h4>
                      <ul className="space-y-1">
                        {idea.features?.map((f, fi) => (
                          <li key={fi} className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <ArrowRight className="w-3 h-3 text-primary-500" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Code Analyzer */}
      {tab === 'code' && (
        <div className="space-y-4">
          <div className="glass-card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold dark:text-white">Paste Your Code</h2>
              <select value={language} onChange={e => setLanguage(e.target.value)} className="input-field w-auto text-sm">
                {['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'PHP'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <textarea value={code} onChange={e => setCode(e.target.value)}
              className="input-field min-h-[200px] font-mono text-sm"
              placeholder="Paste your code snippet here for AI analysis..." />
            <button onClick={analyzeCode} disabled={codeLoading} className="btn-primary mt-3 flex items-center gap-2 disabled:opacity-60">
              {codeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {codeLoading ? 'Analyzing with Gemini AI...' : 'Analyze Code'}
            </button>
          </div>

          {feedback && (
            <div className="space-y-4 animate-slide-up">
              <div className="glass-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold dark:text-white">Code Quality Score</h3>
                  <div className={`text-3xl font-bold ${feedback.quality >= 80 ? 'text-emerald-500' : feedback.quality >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                    {feedback.quality}/100
                  </div>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${
                    feedback.quality >= 80 ? 'bg-emerald-500' : feedback.quality >= 60 ? 'bg-amber-500' : 'bg-red-500'
                  }`} style={{ width: `${feedback.quality}%` }} />
                </div>
                {feedback.summary && <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">{feedback.summary}</p>}
                {feedback.metrics && (
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    {Object.entries(feedback.metrics).map(([k, v]) => (
                      <div key={k} className="text-center p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                        <p className="text-lg font-bold dark:text-white">{v}</p>
                        <p className="text-xs text-gray-400 capitalize">{k}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {feedback.issues?.length > 0 && (
                <div className="glass-card">
                  <h3 className="font-semibold mb-3 dark:text-white">Issues Found</h3>
                  <div className="space-y-3">
                    {feedback.issues.map((issue, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                        <span className="text-lg">{typeIcon[issue.type] || 'âš ï¸'}</span>
                        <div className="flex-1">
                          {issue.line && <span className="text-xs text-gray-400 mr-2">Line {issue.line}</span>}
                          <p className="text-sm text-gray-700 dark:text-gray-300">{issue.message}</p>
                        </div>
                        <span className={`badge text-xs ${severityColor[issue.severity] || ''}`}>{issue.severity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {feedback.improvements?.length > 0 && (
                <div className="glass-card">
                  <h3 className="font-semibold mb-3 dark:text-white flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-primary-500" /> Improvement Suggestions
                  </h3>
                  <ul className="space-y-2">
                    {feedback.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <GitBranch className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" /> {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
