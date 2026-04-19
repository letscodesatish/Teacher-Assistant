"use client";

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
    due_date?: string;
}

const AssignmentsPage: React.FC = () => {
    const [assignments, setAssignments] = useState<AssignmentRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [topic, setTopic] = useState('');
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const resp = await axios.get('http://localhost:8999/assignments');
            setAssignments(resp.data);
        } catch (error) {
            console.error('Fetch failed:', error);
            // Fallback for demo
            setAssignments([
                { id: 1, title: 'Introduction to AI', description: 'Basics of Neural Networks', subject: 'AI', is_ai_generated: true },
                { id: 2, title: 'Python Basics', description: 'Control structures and syntax', subject: 'CS', is_ai_generated: false }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const generateAIAsn = async () => {
        setGenerating(true);
        try {
            await axios.post('http://localhost:8999/assignments/generate', { topic });
            setTopic('');
            fetchAssignments();
        } catch (error) {
            console.error('Generation failed:', error);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-active text-white rounded-xl flex items-center justify-center shadow-lg">
                    <BookMarked size={20} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assignment Manager</h1>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Syllabus-Aligned Material Deployment</p>
                </div>
            </div>

            {/* AI Generator Hero */}
            <div className="relative mb-16 group">
                <div className="absolute inset-0 bg-slate-900 rounded-[40px] shadow-2xl transition-all duration-500 group-hover:scale-[1.01]" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-active/20 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <div className="relative z-10 p-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 text-white">
                            <Sparkles className="text-amber-400" size={24} />
                        </div>
                        <div>
                             <h2 className="text-white font-black text-2xl tracking-tight">Generate with AI</h2>
                             <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.2em] mt-0.5">Powered by Gemini Pro</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <input 
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Enter a topic (e.g., 'Photosynthesis and Energy Flow')"
                                className="w-full bg-white/5 border border-white/10 rounded-[32px] px-8 py-6 text-white placeholder:text-white/30 focus:outline-none focus:ring-4 focus:ring-active/30 transition-all font-medium text-lg leading-relaxed shadow-inner"
                            />
                        </div>
                        <button 
                            onClick={generateAIAsn}
                            disabled={generating || !topic}
                            className="bg-white hover:opacity-90 disabled:opacity-30 text-slate-900 px-12 py-6 rounded-[32px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl shadow-active/30"
                        >
                            {generating ? <Loader2 className="animate-spin" size={24} /> : <Wand2 size={24} />}
                            <span className="text-sm">{generating ? 'generating...' : 'Generate'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-active" size={48} />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronizing Assignments...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {assignments.map(a => (
                        <AssignmentCard 
                            key={a.id}
                            id={a.id}
                            title={a.title}
                            description={a.description}
                            subject={a.subject}
                        />
                    ))}
                    
                    <button className="border-2 border-dashed border-slate-200 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 hover:border-active hover:bg-slate-50 transition-all group">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-active group-hover:text-white transition-all">
                            <Plus size={24} />
                        </div>
                        <span className="font-black text-slate-400 uppercase tracking-widest text-xs group-hover:text-active">Create Manual</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default AssignmentsPage;
