import { useState, useRef } from 'react';
import { Upload, FileText, Brain, MessageSquare, HelpCircle, Send, Sparkles, X, ChevronDown, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function Study() {
  const [file, setFile] = useState(null);
  const [fileText, setFileText] = useState('');
  const [fileData, setFileData] = useState(null); // for binary files like PDF
  const [tab, setTab] = useState('summary');
  const [hasContent, setHasContent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'Hi! Upload your study materials and ask me anything about them. I can explain concepts, create examples, and help you prepare for exams.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const fileRef = useRef();

  const readFileAsText = (f) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(f);
  });

  const readFileAsBase64 = (f) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Strip the "data:...;base64," prefix
      const base64 = e.target.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(f);
  });

  const handleFileChange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setFileText('');
    setFileData(null);
    // PDFs and other binary formats must be sent as base64 for Gemini multimodal
    const isBinary = f.type === 'application/pdf' || f.name.endsWith('.pdf') || f.name.endsWith('.pptx');
    if (isBinary) {
      try {
        const base64 = await readFileAsBase64(f);
        setFileData({ data: base64, mimeType: f.type || 'application/pdf' });
      } catch {
        setFileData(null);
      }
    } else {
      try {
        const text = await readFileAsText(f);
        setFileText(text);
      } catch {
        setFileText(f.name);
      }
    }
  };

  const handleUpload = async () => {
    if (!fileText && !fileData && !file) return;
    setLoading(true);
    setError('');
    setHasContent(false);
    setShowResults(false);
    setQuizAnswers({});
    try {
      const payload = fileData
        ? { filename: file?.name, fileData }
        : { content: fileText || file.name, filename: file?.name };
      const [summaryData, quizData] = await Promise.all([
        api.summarize(payload),
        api.quiz(payload),
      ]);
      setSummary(summaryData);
      setQuiz(quizData.questions || []);
      setHasContent(true);
    } catch (err) {
      setError(err.message || 'Failed to process file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);
    try {
      const { reply } = await api.chat(userMsg, fileText || null, fileData);
      setChatMessages(prev => [...prev, { role: 'ai', text: reply }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I could not respond. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const tabs = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'chat', label: 'Q&A Chat', icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <Brain className="w-7 h-7 text-primary-500" /> AI Study Assistant
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Upload your notes and let AI help you study smarter</p>
      </div>

      {/* Upload Area */}
      <div
        className="glass-card border-2 border-dashed border-primary-200 dark:border-primary-800 cursor-pointer hover:border-primary-400 transition-colors text-center"
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept=".pdf,.pptx,.txt,.md" className="hidden"
          onChange={handleFileChange} />
        <Upload className="w-10 h-10 mx-auto text-primary-400 mb-3" />
        {file ? (
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-5 h-5 text-primary-500" />
            <span className="font-medium text-primary-600 dark:text-primary-400">{file.name}</span>
            <button onClick={e => { e.stopPropagation(); setFile(null); setFileText(''); setFileData(null); setHasContent(false); }} className="text-gray-400 hover:text-red-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <p className="font-medium dark:text-gray-300">Drop your PDF, slides, or notes here</p>
            <p className="text-sm text-gray-400 mt-1">or click to browse â€” supports PDF, PPTX, TXT, MD</p>
          </>
        )}
      </div>

      {error && (
        <div className="glass-card bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {file && !hasContent && (
        <button onClick={handleUpload} disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? 'Generating with Gemini AI...' : 'Generate Study Materials'}
        </button>
      )}

      {/* Content Tabs */}
      {hasContent && summary && (
        <div className="space-y-4 animate-slide-up">
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

          {/* Summary Tab */}
          {tab === 'summary' && (
            <div className="glass-card space-y-6">
              <div>
                <h2 className="text-xl font-bold dark:text-white">{summary.title}</h2>
                <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">{summary.summary}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-3 dark:text-white">Key Terms</h3>
                <div className="flex flex-wrap gap-2">
                  {summary.keyTerms?.map(term => (
                    <span key={term} className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                      {term}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3 dark:text-white">Study Guide</h3>
                <ul className="space-y-2">
                  {summary.studyGuide?.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <ChevronDown className="w-4 h-4 text-primary-500 mt-0.5 rotate-[-90deg]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Quiz Tab */}
          {tab === 'quiz' && (
            <div className="space-y-4">
              {quiz.map((q, qi) => (
                <div key={qi} className="glass-card">
                  <p className="font-medium mb-3 dark:text-white">{qi + 1}. {q.q}</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oi) => {
                      const selected = quizAnswers[qi] === oi;
                      const isCorrect = showResults && oi === q.answer;
                      const isWrong = showResults && selected && oi !== q.answer;
                      return (
                        <button key={oi} onClick={() => setQuizAnswers(p => ({ ...p, [qi]: oi }))}
                          className={`text-left px-4 py-2.5 rounded-xl text-sm border transition ${
                            isCorrect ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                            isWrong ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                            selected ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' :
                            'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 text-gray-600 dark:text-gray-300'
                          }`}>
                          <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <button onClick={() => setShowResults(true)} className="btn-primary">
                Check Answers
              </button>
              {showResults && (
                <div className="glass-card bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                  <p className="font-semibold text-emerald-700 dark:text-emerald-300">
                    Score: {Object.entries(quizAnswers).filter(([qi, a]) => Number(a) === quiz[qi].answer).length} / {quiz.length}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Chat Tab */}
          {tab === 'chat' && (
            <div className="glass-card flex flex-col h-[500px]">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {chatMessages.map((msg, i) => (
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
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-md">
                      <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                    </div>
                  </div>
                )}
              </div>
              <form onSubmit={handleChat} className="flex gap-2">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                  className="input-field flex-1" placeholder="Ask about your study materials..." disabled={chatLoading} />
                <button type="submit" disabled={chatLoading} className="btn-primary px-3 disabled:opacity-60">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
