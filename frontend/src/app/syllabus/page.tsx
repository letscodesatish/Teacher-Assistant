"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen, CheckCircle2, Circle, Loader2, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SyllabusItem {
    id: number;
    subject: string;
    topic: string;
    is_completed: boolean;
}

const SyllabusPage = () => {
    const [items, setItems] = useState<SyllabusItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchSyllabus();
    }, []);

    const fetchSyllabus = async () => {
        try {
            const resp = await axios.get('http://localhost:8005/syllabus');
            setItems(resp.data);
        } catch (error) {
            console.error('Fetch failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleItem = async (id: number) => {
        try {
            await axios.post(`http://localhost:8005/syllabus/toggle/${id}`);
            setItems(items.map(item => 
                item.id === id ? { ...item, is_completed: !item.is_completed } : item
            ));
        } catch (error) {
            console.error('Toggle failed:', error);
        }
    };

    const subjects = ['All', ...Array.from(new Set(items.map(i => i.subject)))];
    
    const filteredItems = items.filter(item => {
        const matchesSearch = item.topic.toLowerCase().includes(search.toLowerCase()) || 
                             item.subject.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'All' || item.subject === filter;
        return matchesSearch && matchesFilter;
    });

    const completedCount = items.filter(i => i.is_completed).length;
    const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Syllabus Tracker</h1>
                        <p className="text-slate-500 font-medium">Monitor curriculum progress and coverage</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm min-w-[240px]">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Overall Progress</span>
                        <span className="text-lg font-black text-blue-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="bg-blue-600 h-full rounded-full"
                        />
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Search topics or subjects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all font-medium text-slate-600 shadow-sm"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {subjects.map(sub => (
                        <button
                            key={sub}
                            onClick={() => setFilter(sub)}
                            className={`px-6 py-3.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
                                filter === sub 
                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                                : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50 shadow-sm'
                            }`}
                        >
                            {sub}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Syllabus...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {filteredItems.map((item) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={item.id}
                                onClick={() => toggleItem(item.id)}
                                className={`group p-6 rounded-[32px] border transition-all cursor-pointer relative overflow-hidden ${
                                    item.is_completed 
                                    ? 'bg-emerald-50/50 border-emerald-100' 
                                    : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        item.is_completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {item.subject}
                                    </span>
                                    {item.is_completed ? (
                                        <CheckCircle2 className="text-emerald-500" size={24} />
                                    ) : (
                                        <Circle className="text-slate-200 group-hover:text-blue-400 transition-colors" size={24} />
                                    )}
                                </div>
                                <h3 className={`text-lg font-bold leading-tight relative z-10 ${
                                    item.is_completed ? 'text-emerald-900/50 line-through' : 'text-slate-800'
                                }`}>
                                    {item.topic}
                                </h3>

                                {/* Decorative Background Elements */}
                                <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl transition-opacity ${
                                    item.is_completed ? 'bg-emerald-200/40 opacity-100' : 'bg-blue-100/0 opacity-0 group-hover:bg-blue-100/40 group-hover:opacity-100'
                                }`} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default SyllabusPage;
