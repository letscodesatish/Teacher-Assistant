"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, LogOut, BookOpen, ClipboardList, Cpu, CheckCircle, Mail, ShieldCheck, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface ProfileData {
    user: {
        id: number;
        email: string;
        name: string;
    };
    stats: {
        syllabus_count: number;
        syllabus_completed: number;
        assignments_count: number;
        question_papers_count: number;
    };
}

export default function ProfilePage() {
    const [data, setData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const resp = await axios.get('http://localhost:8005/profile');
            setData(resp.data);
        } catch (error) {
            console.error('Profile fetch failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (loading) return (
        <div className="h-full flex items-center justify-center p-20">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full" />
                <div className="h-4 w-32 bg-slate-100 rounded" />
            </div>
        </div>
    );

    const stats = [
        { label: 'Courses Coverage', value: `${data?.stats.syllabus_completed}/${data?.stats.syllabus_count}`, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Assignments', value: data?.stats.assignments_count, icon: ClipboardList, color: 'text-purple-500', bg: 'bg-purple-50' },
        { label: 'AI Papers', value: data?.stats.question_papers_count, icon: Cpu, color: 'text-amber-500', bg: 'bg-amber-50' },
        { label: 'Status', value: 'Active', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Profile Hero */}
            <div className="relative mb-8 pt-10 px-10 pb-16 bg-slate-900 rounded-[48px] overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-32 h-32 bg-white rounded-[40px] flex items-center justify-center shadow-2xl overflow-hidden p-1">
                        <div className="w-full h-full bg-slate-50 rounded-[36px] flex items-center justify-center text-slate-800">
                           <User size={64} strokeWidth={1.5} />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">{data?.user.name}</h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10 text-white/80 text-sm font-medium">
                                <Mail size={14} className="text-blue-400" />
                                {data?.user.email}
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10 text-white/80 text-sm font-medium">
                                <ShieldCheck size={14} className="text-emerald-400" />
                                Verified Faculty
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="px-8 py-4 bg-white hover:bg-red-50 text-slate-900 hover:text-red-600 rounded-[28px] font-black uppercase tracking-widest text-sm flex items-center gap-3 transition-all shadow-xl shadow-black/20"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={stat.label}
                        className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                            <stat.icon size={24} />
                        </div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Details & Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm py-10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                <Settings size={20} className="text-blue-600" />
                                Quick Preferences
                            </h3>
                        </div>
                        
                        <div className="space-y-4">
                            {[
                                { label: 'Automatic Attendance Reports', desc: 'Get daily summary via email', active: true },
                                { label: 'AI Suggestion Engine', desc: 'Personalized syllabus recommendations', active: true },
                                { label: 'Dark Mode Dashboard', desc: 'Experimental visual preference', active: false },
                                { label: 'Push Notifications', desc: 'For assignment deadlines', active: false },
                            ].map((pref, i) => (
                                <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                    <div>
                                        <p className="font-bold text-slate-800 leading-tight">{pref.label}</p>
                                        <p className="text-xs font-medium text-slate-400 mt-0.5">{pref.desc}</p>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${pref.active ? 'bg-blue-600' : 'bg-slate-200'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${pref.active ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-blue-600 p-8 rounded-[40px] text-white shadow-xl shadow-blue-500/20">
                        <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-2">Teacher Assistant</p>
                        <h4 className="text-2xl font-black mb-4 leading-tight">Your Digital Classroom, Reimagined.</h4>
                        <p className="text-sm font-medium opacity-80 leading-relaxed mb-6">
                             Utilize AI to generate question papers, track every student's attendance with face recognition, and never lose track of your syllabus.
                        </p>
                        <div className="h-1 bg-white/20 rounded-full w-full mb-2 overflow-hidden">
                             <div className="h-full bg-white w-1/3 rounded-full" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 text-right">Beta v1.2</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
