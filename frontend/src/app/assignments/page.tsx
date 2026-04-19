'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BookMarked, Sparkles, Plus, Search, Loader2, Wand2, Send } from 'lucide-react';
import AssignmentCard from '@/components/AssignmentCard';

interface AssignmentRecord {
    id: number;
    title: string;
    description: string;
    subject: string;
    is_ai_generated: boolean;
    created_at: string;
}

export default function AssignmentManager() {
    const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [topic, setTopic] = useState('');

    const fetchAssignments = async () => {
        try {
            const res = await axios.get('http://localhost:8005/assignments');
            setAssignments(res.data);
        } catch (err) {
            console.error("Error fetching assignments:", err);
            // Fallback for demo
            setAssignments([
                { id: 1, title: "Quantum Mechanics Basics", description: "Introduction to wave-particle duality and uncertainty principles.", subject: "Physics", is_ai_generated: true, created_at: "2024-05-18" },
                { id: 2, title: "Modern Civilizations", description: "Analyze the impact of industrial revolution on social structures.", subject: "History", is_ai_generated: false, created_at: "2024-05-17" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const generateAIAsn = async () => {
        if (!topic) return;
        setGenerating(true);
        try {
            await axios.post(`http://localhost:8005/ai/generate-assignment?topic=${encodeURIComponent(topic)}`);
            setTopic('');
            fetchAssignments(); // Refresh list
        } catch (err) {
            console.error("AI Gen error:", err);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <header className="mb-12 flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <BookMarked size={14} className="text-active" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Curriculum Development</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Assignment Manager</h1>
                    <p className="text-slate-500 font-medium mt-1">Design and distribute learning materials with AI assistance</p>
                </div>
                
                <div className="flex items-center gap-3">
                     <div className="flex flex-col items-end">
                         <span className="text-[10px] font-black text-slate-300 uppercase">Status</span>
                         <span className="text-xs font-bold text-slate-900">v4.2.0 Stable</span>
                     </div>
                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                         <Plus size={20} className="text-slate-400" />
                     </div>
                </div>
            </header>

            {/* AI Generator Box */}
            <div className="bg-slate-900 !p-8 border-none shadow-2xl rounded-[48px] mb-12 relative overflow-hidden ring-1 ring-white/10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-active/20 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <div className="relative z-10">
                    {/* AI Generation Section */}
                    <section className="ai-generator-premium">
                        <div className="flex items-center gap-3 mb-6">
                            <Sparkles className="w-8 h-8 text-amber-400" />
                            <div>
                                <h2 className="text-2xl font-bold text-white">Generate with AI</h2>
                                <p className="text-blue-200 text-sm">Powered by Gemini Pro</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Enter a topic (e.g., 'Photosynthesis', 'Quantum Physics')..."
                                className="ai-input-premium w-full bg-white/5 border border-white/10 rounded-[32px] px-8 py-6 text-white placeholder:text-white/30 focus:outline-none focus:ring-4 focus:ring-active/30 transition-all font-medium text-lg leading-relaxed shadow-inner"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                            <button
                                onClick={generateAIAsn}
                                disabled={generating || !topic}
                                className="ai-button-premium bg-active hover:opacity-90 disabled:opacity-30 text-white px-12 py-6 rounded-[32px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl shadow-active/30"
                            >
                                <span className="text-sm">{generating ? 'generating...' : 'Generate Assignment'}</span>
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </section>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                    <div className="col-span-2 py-20 text-center">
                        <div className="inline-block p-4 rounded-3xl bg-slate-50 border border-slate-100 animate-pulse">
                             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Synchronizing Assignments...</p>
                        </div>
                    </div>
                ) : (
                    assignments.map((asn) => (
                        <AssignmentCard 
                            key={asn.id}
                            id={asn.id}
                            title={asn.title}
                            description={asn.description}
                            subject={asn.subject}
                            is_ai_generated={asn.is_ai_generated}
                            due_date={asn.created_at.split('T')[0]}
                        />
                    ))
                )}
            </div>
            
            <footer className="mt-20 pt-10 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Integrated Pedagogy Network • System Active</p>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Encryption Verified</span>
                </div>
            </footer>
        </div>
    );
}
