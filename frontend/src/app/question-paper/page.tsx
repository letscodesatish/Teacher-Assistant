"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, Sparkles, ChevronRight, CheckCircle, 
  Settings, Download, Trash2, Edit3, Loader2, 
  ArrowLeft, BookOpen, AlertCircle
} from 'lucide-react';

interface Topic {
  id: number;
  topic: string;
}

interface QuestionPaper {
  id: number;
  title: string;
  subject: string;
  difficulty: string;
  content: string;
  created_at: string;
}

export default function QuestionPaperStudio() {
  const [step, setStep] = useState(1);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState('Medium');
  const [generatedContent, setGeneratedContent] = useState('');
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [paperId, setPaperId] = useState<number | null>(null);

  useEffect(() => {
    fetchSubjects();
    fetchPapers();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get('http://localhost:8005/syllabus/subjects');
      setSubjects(res.data);
    } catch (err) {
      console.error("Failed to fetch subjects");
      setSubjects(['Science', 'Mathematics', 'Computer Science']);
    }
  };

  const fetchTopics = async (subj: string) => {
    try {
      const res = await axios.get(`http://localhost:8005/syllabus/topics?subject=${subj}`);
      setTopics(res.data);
    } catch (err) {
      console.error("Failed to fetch topics");
    }
  };

  const fetchPapers = async () => {
    try {
      const res = await axios.get('http://localhost:8005/question-papers');
      setPapers(res.data);
    } catch (err) {
      console.error("Failed to fetch papers");
    }
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const s = e.target.value;
    setSelectedSubject(s);
    setSelectedTopics([]);
    if (s) fetchTopics(s);
  };

  const toggleTopic = (t: string) => {
    setSelectedTopics(prev => 
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  const generatePaper = async () => {
    setIsGenerating(true);
    setStep(2);
    try {
      const topicString = selectedTopics.join(", ");
      const res = await axios.post(`http://localhost:8005/ai/generate-paper?topic=${topicString}&difficulty=${difficulty}`);
      setGeneratedContent(res.data.content);
      setPaperId(res.data.paper_id);
      setStep(3);
      fetchPapers();
    } catch (err) {
      console.error("Generation failed");
      setStep(1);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportPDF = (id: number | null) => {
    if (!id) return;
    window.open(`http://localhost:8005/question-papers/export/${id}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-active text-white rounded-2xl shadow-xl">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight" id="unique-question-paper-studio-marker">Question Paper Studio</h1>
            <p className="text-slate-500 font-medium">AI-driven assessment generation system</p>
          </div>
        </div>
        
        {/* Stepper */}
        <div className="flex items-center gap-4 mt-8">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${step >= s ? 'text-active' : 'text-slate-300'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= s ? 'border-active bg-active text-white' : 'border-slate-200'}`}>
                  {s}
                </div>
                <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">
                  {s === 1 ? 'Configure' : s === 2 ? 'Generate' : 'Studio'}
                </span>
              </div>
              {s < 3 && <div className="h-0.5 w-12 bg-slate-100" />}
            </React.Fragment>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Interface */}
        <div className="lg:col-span-8">
          {step === 1 && (
            <div className="card-premium space-y-8 animate-in fade-in duration-500">
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Step 1: Select Subject</label>
                <select 
                  className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none ring-2 ring-transparent focus:ring-active/5 transition-all appearance-none"
                  value={selectedSubject}
                  onChange={handleSubjectChange}
                >
                  <option value="">Select a subject...</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {selectedSubject && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Step 2: Select Topics</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {topics.map(t => (
                      <button
                        key={t.id}
                        onClick={() => toggleTopic(t.topic)}
                        className={`p-4 rounded-2xl text-left border-2 transition-all ${
                          selectedTopics.includes(t.topic) 
                            ? 'border-active bg-active/5 text-active' 
                            : 'border-slate-100 hover:border-slate-200 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm">{t.topic}</span>
                          {selectedTopics.includes(t.topic) && <CheckCircle size={16} />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedTopics.length > 0 && (
                <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                   <div className="flex items-center justify-between border-t border-slate-50 pt-8">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Step 3: Difficulty</label>
                        <div className="flex gap-2">
                          {['Easy', 'Medium', 'Hard'].map(d => (
                            <button
                              key={d}
                              onClick={() => setDifficulty(d)}
                              className={`px-6 py-2 rounded-xl border-2 font-bold text-xs transition-all ${
                                difficulty === d ? 'border-active bg-active text-white' : 'border-slate-100 text-slate-400'
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <button 
                        onClick={generatePaper}
                        className="bg-active text-white px-10 py-5 rounded-[32px] font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-active/20"
                      >
                        Compose Exam <ChevronRight size={18} />
                      </button>
                   </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="card-premium flex flex-col items-center justify-center py-32 text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-active animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-active" size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">AI is Composing...</h2>
              <p className="text-slate-400 font-medium max-w-xs">Our neural engine is structuring a unique set of questions based on your syllabus.</p>
            </div>
          )}

          {step === 3 && (
            <div className="card-premium p-0 overflow-hidden animate-in zoom-in-95 duration-500">
               <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Edit3 size={18} className="text-active" />
                    <span className="font-black uppercase tracking-widest text-xs text-slate-500">Studio Editor</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => exportPDF(paperId)}
                      className="bg-active text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                      <Download size={14} /> Export PDF
                    </button>
                  </div>
               </div>
               <div className="p-12">
                  <textarea 
                    className="w-full min-h-[600px] bg-transparent border-none outline-none font-mono text-slate-700 leading-relaxed text-sm resize-none"
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                  />
               </div>
            </div>
          )}
        </div>

        {/* Sidebar Status / History */}
        <div className="lg:col-span-4 space-y-8">
           <div className="card p-8 border-none shadow-sm bg-slate-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-active/20 blur-2xl -mr-16 -mt-16" />
              <div className="relative z-10">
                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-active mb-4">System Insights</h3>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                      <span>Curriculum Aligned</span>
                      <CheckCircle size={14} className="text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                      <span>Bloom's Taxonomy</span>
                      <CheckCircle size={14} className="text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                      <span>Plagiarism Shield</span>
                      <CheckCircle size={14} className="text-emerald-500" />
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Studio History</h3>
              <div className="space-y-3">
                 {papers.length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-slate-100 rounded-[32px] text-center">
                       <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No papers yet</p>
                    </div>
                 ) : papers.slice(0, 5).map(p => (
                    <div key={p.id} className="p-4 bg-white rounded-2xl border border-slate-50 shadow-sm hover:border-active/20 transition-all group">
                       <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-active group-hover:text-white transition-all">
                                <FileText size={16} />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-slate-800 line-clamp-1">{p.title}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{new Date(p.created_at).toLocaleDateString()}</p>
                             </div>
                          </div>
                          <button onClick={() => exportPDF(p.id)} className="text-slate-300 hover:text-active transition-colors">
                             <Download size={14} />
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
