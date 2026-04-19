import React, { useState } from 'react';
import { Sparkles, FileText, Download, Wand2, Loader2, ListPlus, GraduationCap, ChevronRight } from 'lucide-react';
import axios from 'axios';

const AIContent = () => {
    const [topic, setTopic] = useState('');
    const [type, setType] = useState('assignment'); // assignment, paper
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const generateContent = async () => {
        if (!topic) return;
        setLoading(true);
        try {
            const endpoint = type === 'assignment' ? '/ai/generate-assignment' : '/ai/generate-paper';
            const res = await axios.post(`http://localhost:8005${endpoint}?topic=${topic}`);
            setContent(res.data.content);
        } catch (err) {
            console.error("Gen error:", err);
            setContent("Failed to generate content. Check API key.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        AI Content Lab <Sparkles size={24} className="text-[#a3a891]" />
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">Generate high-fidelity academic materials in seconds</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Configuration Card */}
                <div className="md:col-span-5 flex flex-col gap-4">
                    <div className="card shadow-sm border-none bg-white">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Select Output Type</p>
                        <div className="flex flex-col gap-2">
                            <TypeOption 
                                active={type === 'assignment'} 
                                onClick={() => setType('assignment')} 
                                label="Assignment" 
                                icon={<ListPlus size={18} />} 
                            />
                            <TypeOption 
                                active={type === 'paper'} 
                                onClick={() => setType('paper')} 
                                label="Question Paper" 
                                icon={<GraduationCap size={18} />} 
                            />
                        </div>
                    </div>

                    <div className="card shadow-sm border-none bg-white">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Topic Details</p>
                        <input 
                            type="text" 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. Modern Architecture, Python Loops..."
                            className="w-full bg-[#fbfbf4] border-2 border-slate-100 rounded-[12px] p-4 text-sm font-bold focus:outline-none focus:border-slate-300 transition-all placeholder:text-slate-300"
                        />
                        <button 
                            onClick={generateContent}
                            disabled={loading || !topic}
                            className="w-full mt-4 bg-active hover:opacity-90 disabled:opacity-30 text-white font-black py-4 rounded-[16px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-md"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
                            GENERATE
                        </button>
                    </div>
                </div>

                {/* Display Area */}
                <div className="md:col-span-7">
                    {content ? (
                        <div className="card shadow-md border-none bg-white min-h-[400px] flex flex-col animate-in slide-in-from-right duration-500">
                             <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                                        <FileText size={20} color="white" />
                                    </div>
                                    <h3 className="font-black text-sm uppercase tracking-tight">Generated Material</h3>
                                </div>
                                <button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-500 transition-all">
                                    <Download size={20} />
                                </button>
                            </div>
                            <div className="bg-[#fbfbf4] p-6 rounded-[20px] border border-slate-100 flex-1">
                                <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed tracking-tight">
                                    {content}
                                </pre>
                            </div>
                        </div>
                    ) : (
                        <div className="card shadow-sm border-none bg-slate-100/50 border-dashed border-2 border-slate-200 min-h-[400px] flex items-center justify-center">
                            <div className="text-center flex flex-col items-center gap-4 opacity-30">
                                <Sparkles size={48} />
                                <p className="font-black text-xs uppercase tracking-[4px]">Awaiting Instructions</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const TypeOption = ({ active, onClick, label, icon }) => (
    <button 
        onClick={onClick}
        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
            active 
            ? 'border-active bg-active text-white' 
            : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
        }`}
    >
        <div className="flex items-center gap-3">
            {icon}
            <span className="text-xs font-black uppercase tracking-tight">{label}</span>
        </div>
        <ChevronRight size={16} className={active ? 'text-white/50' : 'text-slate-200'} />
    </button>
);

export default AIContent;
