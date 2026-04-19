import React, { useState, useEffect } from 'react';
import { Book, CheckCircle2, Circle, Flag, ChevronRight } from 'lucide-react';
import axios from 'axios';

const SyllabusTracker = () => {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSyllabus();
    }, []);

    const fetchSyllabus = async () => {
        try {
            const res = await axios.get('http://localhost:8005/syllabus');
            setTopics(res.data);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleTopic = async (id) => {
        try {
            const res = await axios.post(`http://localhost:8005/syllabus/toggle/${id}`);
            setTopics(topics.map(t => t.id === id ? res.data : t));
        } catch (err) {
            console.error("Toggle error:", err);
        }
    };

    const completedCount = topics.filter(t => t.is_completed).length;
    const progress = topics.length > 0 ? (completedCount / topics.length) * 100 : 0;

    return (
        <div className="flex flex-col gap-8 max-w-3xl mx-auto">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black tracking-tight">Curriculum Status</h2>
                    <p className="text-sm text-slate-500 font-medium">Tracking {topics.length} topics across primary subjects</p>
                </div>
                <div className="card py-3 px-6 flex items-center gap-4 border-none shadow-sm">
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase text-slate-400">Total Progress</p>
                        <p className="text-xl font-black">{Math.round(progress)}%</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-active flex items-center justify-center">
                        <Flag size={20} color="white" />
                    </div>
                </div>
            </header>

            <div className="card p-0 overflow-hidden shadow-sm">
                <div className="h-2 bg-slate-100 w-full">
                    <div 
                        className="h-full bg-[#1a1c1a] transition-all duration-1000 ease-out" 
                        style={{ width: `${progress}%` }} 
                    />
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="card h-20 animate-pulse bg-white/50" />)
                ) : (
                    topics.map((topic) => (
                        <div 
                            key={topic.id}
                            onClick={() => toggleTopic(topic.id)}
                            className={`card flex items-center justify-between transition-all cursor-pointer border-2 ${
                                topic.is_completed 
                                ? 'bg-white border-slate-200' 
                                : 'bg-white/40 border-transparent hover:border-slate-200'
                            }`}
                        >
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                                    topic.is_completed ? 'bg-active text-white' : 'bg-slate-100 text-slate-400'
                                }`}>
                                    <Book size={20} />
                                </div>
                                <div>
                                    <p className={`text-sm font-black ${topic.is_completed ? 'text-slate-900' : 'text-slate-500'}`}>
                                        {topic.topic}
                                    </p>
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                        {topic.subject}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                {topic.is_completed ? (
                                    <div className="bg-[#dcfce7] text-[#166534] p-1 rounded-full">
                                        <CheckCircle2 size={24} />
                                    </div>
                                ) : (
                                    <div className="w-6 h-6 rounded-full border-2 border-slate-200" />
                                )}
                                <ChevronRight size={18} className="text-slate-300" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SyllabusTracker;
