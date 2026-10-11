import { useState } from 'react';
import { FileText, Plus, X, Download, Sparkles, Copy, Check, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import api from '../services/api';

const defaultCV = {
  name: '', title: '', email: '', phone: '', location: '', linkedin: '', github: '',
  summary: '',
  experience: [{ company: '', role: '', dates: '', bullets: [''] }],
  education: [{ school: '', degree: '', dates: '', gpa: '' }],
  skills: '',
  projects: [{ name: '', description: '', tech: '' }],
};

const aiSuggestions = null; // replaced by real Gemini AI

export default function CVBuilder() {
  const [cv, setCv] = useState(defaultCV);
  const [tab, setTab] = useState('editor');
  const [copied, setCopied] = useState('');
  const [linkedinData, setLinkedinData] = useState(null);
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  const [bulletText, setBulletText] = useState('');
  const [bulletSuggestions, setBulletSuggestions] = useState([]);
  const [bulletLoading, setBulletLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const update = (field, value) => setCv(prev => ({ ...prev, [field]: value }));

  const updateExp = (i, field, value) => {
    const exp = [...cv.experience];
    exp[i] = { ...exp[i], [field]: value };
    setCv(prev => ({ ...prev, experience: exp }));
  };

  const updateExpBullet = (ei, bi, value) => {
    const exp = [...cv.experience];
    exp[ei].bullets[bi] = value;
    setCv(prev => ({ ...prev, experience: exp }));
  };

  const addExpBullet = (ei) => {
    const exp = [...cv.experience];
    exp[ei].bullets.push('');
    setCv(prev => ({ ...prev, experience: exp }));
  };

  const addExperience = () => setCv(prev => ({
    ...prev, experience: [...prev.experience, { company: '', role: '', dates: '', bullets: [''] }]
  }));

  const removeExperience = (i) => setCv(prev => ({
    ...prev, experience: prev.experience.filter((_, idx) => idx !== i)
  }));

  const updateEdu = (i, field, value) => {
    const edu = [...cv.education];
    edu[i] = { ...edu[i], [field]: value };
    setCv(prev => ({ ...prev, education: edu }));
  };

  const updateProject = (i, field, value) => {
    const projects = [...cv.projects];
    projects[i] = { ...projects[i], [field]: value };
    setCv(prev => ({ ...prev, projects }));
  };

  const addProject = () => setCv(prev => ({
    ...prev, projects: [...prev.projects, { name: '', description: '', tech: '' }]
  }));

  const exportPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    const lm = 20;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(cv.name || 'Your Name', lm, y);
    y += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text([cv.email, cv.phone, cv.location, cv.linkedin].filter(Boolean).join(' | '), lm, y);
    y += 5;
    doc.setTextColor(0);

    if (cv.summary) {
      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('SUMMARY', lm, y);
      y += 1;
      doc.setDrawColor(99, 102, 241);
      doc.line(lm, y, 190, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(cv.summary, 170);
      doc.text(lines, lm, y);
      y += lines.length * 5;
    }

    if (cv.experience.some(e => e.company)) {
      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('EXPERIENCE', lm, y);
      y += 1;
      doc.line(lm, y, 190, y);
      y += 5;
      cv.experience.forEach(exp => {
        if (!exp.company) return;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(`${exp.role} — ${exp.company}`, lm, y);
        doc.setFont('helvetica', 'normal');
        doc.text(exp.dates, 190, y, { align: 'right' });
        y += 5;
        exp.bullets.forEach(b => {
          if (!b) return;
          const bLines = doc.splitTextToSize(`• ${b}`, 165);
          doc.text(bLines, lm + 5, y);
          y += bLines.length * 5;
        });
        y += 3;
      });
    }

    if (cv.education.some(e => e.school)) {
      y += 2;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('EDUCATION', lm, y);
      y += 1;
      doc.line(lm, y, 190, y);
      y += 5;
      cv.education.forEach(edu => {
        if (!edu.school) return;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(`${edu.degree} — ${edu.school}`, lm, y);
        doc.setFont('helvetica', 'normal');
        doc.text(edu.dates, 190, y, { align: 'right' });
        y += 5;
        if (edu.gpa) { doc.text(`GPA: ${edu.gpa}`, lm + 5, y); y += 5; }
      });
    }

    if (cv.skills) {
      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('SKILLS', lm, y);
      y += 1;
      doc.line(lm, y, 190, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const sLines = doc.splitTextToSize(cv.skills, 170);
      doc.text(sLines, lm, y);
    }

    doc.save(`${cv.name || 'resume'}.pdf`);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(cv, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cv.name || 'resume'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const tabs = [
    { id: 'editor', label: 'CV Editor' },
    { id: 'linkedin', label: 'LinkedIn Optimizer' },
    { id: 'suggestions', label: 'AI Suggestions' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <FileText className="w-7 h-7 text-primary-500" /> CV Builder & LinkedIn Optimizer
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Build an ATS-friendly resume and optimize your LinkedIn</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              tab === t.id ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                : 'bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* CV Editor */}
      {tab === 'editor' && (
        <div className="space-y-4">
          <div className="glass-card space-y-4">
            <h2 className="font-semibold dark:text-white">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <input className="input-field" placeholder="Full Name" value={cv.name} onChange={e => update('name', e.target.value)} />
              <input className="input-field" placeholder="Professional Title" value={cv.title} onChange={e => update('title', e.target.value)} />
              <input className="input-field" placeholder="Email" value={cv.email} onChange={e => update('email', e.target.value)} />
              <input className="input-field" placeholder="Phone" value={cv.phone} onChange={e => update('phone', e.target.value)} />
              <input className="input-field" placeholder="Location" value={cv.location} onChange={e => update('location', e.target.value)} />
              <input className="input-field" placeholder="LinkedIn URL" value={cv.linkedin} onChange={e => update('linkedin', e.target.value)} />
              <input className="input-field md:col-span-2" placeholder="GitHub URL" value={cv.github} onChange={e => update('github', e.target.value)} />
            </div>
            <textarea className="input-field min-h-[80px]" placeholder="Professional Summary..." value={cv.summary} onChange={e => update('summary', e.target.value)} />
          </div>

          {/* Experience */}
          <div className="glass-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold dark:text-white">Experience</h2>
              <button onClick={addExperience} className="btn-secondary text-sm flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {cv.experience.map((exp, ei) => (
              <div key={ei} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 space-y-3 relative">
                {cv.experience.length > 1 && (
                  <button onClick={() => removeExperience(ei)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="grid md:grid-cols-3 gap-3">
                  <input className="input-field" placeholder="Company" value={exp.company} onChange={e => updateExp(ei, 'company', e.target.value)} />
                  <input className="input-field" placeholder="Role" value={exp.role} onChange={e => updateExp(ei, 'role', e.target.value)} />
                  <input className="input-field" placeholder="Dates (e.g., Jun 2024 - Aug 2024)" value={exp.dates} onChange={e => updateExp(ei, 'dates', e.target.value)} />
                </div>
                {exp.bullets.map((b, bi) => (
                  <input key={bi} className="input-field" placeholder="• Achievement or responsibility..."
                    value={b} onChange={e => updateExpBullet(ei, bi, e.target.value)} />
                ))}
                <button onClick={() => addExpBullet(ei)} className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add bullet point
                </button>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="glass-card space-y-4">
            <h2 className="font-semibold dark:text-white">Education</h2>
            {cv.education.map((edu, i) => (
              <div key={i} className="grid md:grid-cols-4 gap-3">
                <input className="input-field" placeholder="School" value={edu.school} onChange={e => updateEdu(i, 'school', e.target.value)} />
                <input className="input-field" placeholder="Degree" value={edu.degree} onChange={e => updateEdu(i, 'degree', e.target.value)} />
                <input className="input-field" placeholder="Dates" value={edu.dates} onChange={e => updateEdu(i, 'dates', e.target.value)} />
                <input className="input-field" placeholder="GPA" value={edu.gpa} onChange={e => updateEdu(i, 'gpa', e.target.value)} />
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="glass-card space-y-3">
            <h2 className="font-semibold dark:text-white">Skills</h2>
            <textarea className="input-field min-h-[60px]" placeholder="JavaScript, React, Node.js, Python, SQL, Git..."
              value={cv.skills} onChange={e => update('skills', e.target.value)} />
          </div>

          {/* Projects */}
          <div className="glass-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold dark:text-white">Projects</h2>
              <button onClick={addProject} className="btn-secondary text-sm flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {cv.projects.map((proj, i) => (
              <div key={i} className="grid md:grid-cols-3 gap-3">
                <input className="input-field" placeholder="Project Name" value={proj.name} onChange={e => updateProject(i, 'name', e.target.value)} />
                <input className="input-field" placeholder="Description" value={proj.description} onChange={e => updateProject(i, 'description', e.target.value)} />
                <input className="input-field" placeholder="Tech Stack" value={proj.tech} onChange={e => updateProject(i, 'tech', e.target.value)} />
              </div>
            ))}
          </div>

          {/* Export */}
          <div className="flex gap-3 flex-wrap">
            <button onClick={exportPDF} className="btn-primary flex items-center gap-2">
              <Download className="w-4 h-4" /> Export as PDF
            </button>
            <button onClick={exportJSON} className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" /> Export as JSON
            </button>
          </div>
        </div>
      )}

      {/* LinkedIn Optimizer */}
      {tab === 'linkedin' && (
        <div className="space-y-4">
          <div className="glass-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> LinkedIn Profile Review
              </h2>
              {!linkedinData && (
                <button onClick={async () => {
                  setLinkedinLoading(true);
                  setAiError('');
                  try {
                    const data = await api.linkedinSuggestions();
                    setLinkedinData(data);
                  } catch (err) {
                    setAiError(err.message || 'Failed to load suggestions');
                  } finally {
                    setLinkedinLoading(false);
                  }
                }} disabled={linkedinLoading} className="btn-primary text-sm flex items-center gap-2 disabled:opacity-60">
                  {linkedinLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {linkedinLoading ? 'Generating...' : 'Generate with AI'}
                </button>
              )}
            </div>

            {aiError && <p className="text-sm text-red-500">{aiError}</p>}

            {linkedinData && (
              <>
                <div>
                  <h3 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Suggested Headlines</h3>
                  <div className="space-y-2">
                    {linkedinData.headlines?.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                        <span className="flex-1 text-sm dark:text-gray-300">{h}</span>
                        <button onClick={() => copyText(h, `headline-${i}`)}
                          className="text-gray-400 hover:text-primary-500 transition">
                          {copied === `headline-${i}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Suggested About Section</h3>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 relative">
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pr-8">{linkedinData.about}</p>
                    <button onClick={() => copyText(linkedinData.about, 'about')}
                      className="absolute top-3 right-3 text-gray-400 hover:text-primary-500 transition">
                      {copied === 'about' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Profile Checklist</h3>
                  <div className="space-y-2">
                    {linkedinData.checklist?.map((item, i) => (
                      <label key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button onClick={() => { setLinkedinData(null); }} className="text-xs text-gray-400 hover:text-primary-500">
                  ↺ Regenerate
                </button>
              </>
            )}

            {!linkedinData && !linkedinLoading && (
              <p className="text-sm text-gray-400 text-center py-4">Click "Generate with AI" to get personalized LinkedIn suggestions powered by Gemini.</p>
            )}
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      {tab === 'suggestions' && (
        <div className="glass-card space-y-4">
          <h2 className="font-semibold dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-500" /> AI Bullet Point Suggestions
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Paste a weak work description and Gemini will rewrite it with strong action verbs and metrics</p>
          <textarea value={bulletText} onChange={e => setBulletText(e.target.value)}
            className="input-field min-h-[80px]"
            placeholder="e.g., 'Helped with the website, wrote some code, fixed bugs in the backend...'" />
          <button onClick={async () => {
            if (!bulletText.trim()) return;
            setBulletLoading(true);
            setAiError('');
            setBulletSuggestions([]);
            try {
              const data = await api.suggestBullets(bulletText);
              setBulletSuggestions(data.suggestions || []);
            } catch (err) {
              setAiError(err.message || 'Failed to generate suggestions');
            } finally {
              setBulletLoading(false);
            }
          }} disabled={bulletLoading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
            {bulletLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {bulletLoading ? 'Generating with Gemini AI...' : 'Improve with AI'}
          </button>

          {aiError && <p className="text-sm text-red-500">{aiError}</p>}

          {bulletSuggestions.length > 0 && (
            <div className="space-y-3 animate-slide-up">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Improved Bullet Points — click to copy</h3>
              {bulletSuggestions.map((b, i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-start gap-3"
                  onClick={() => copyText(b, `bullet-${i}`)}>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">{b}</p>
                  {copied === `bullet-${i}` ? <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> : <Copy className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
