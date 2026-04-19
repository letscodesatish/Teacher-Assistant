'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Award, Search, TrendingUp, Users, Download, Filter } from 'lucide-react';
import PerformanceBadge from '@/components/PerformanceBadge';

interface GradeSummary {
    student_name: string;
    roll_number: string;
    exam_title: string;
    marks_obtained: number;
    total_marks: number;
    percentage: number;
}

export default function MarksGradeBook() {
    const [grades, setGrades] = useState<GradeSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const res = await axios.get('http://localhost:8005/grades/summary');
                setGrades(res.data);
            } catch (err) {
                console.error("Error fetching grades:", err);
                // Fallback mock data
                setGrades([
                    { student_name: "Satish Kumar", roll_number: "CS001", exam_title: "Final Term", marks_obtained: 88, total_marks: 100, percentage: 88 },
                    { student_name: "Aditya Sharma", roll_number: "CS002", exam_title: "Final Term", marks_obtained: 94, total_marks: 100, percentage: 94 },
                    { student_name: "Rohan V", roll_number: "CS003", exam_title: "Mid Term", marks_obtained: 72, total_marks: 100, percentage: 72 },
                    { student_name: "Sneha G", roll_number: "CS004", exam_title: "Mid Term", marks_obtained: 65, total_marks: 100, percentage: 65 },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchGrades();
    }, []);

    const classAverage = grades.length > 0 
        ? (grades.reduce((acc, curr) => acc + curr.percentage, 0) / grades.length).toFixed(1)
        : "0";

    return (
        <div className="max-w-5xl mx-auto">
            <header className="mb-10 flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Award size={14} className="text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Academic Analytics</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Marks & Grade Book</h1>
                    <p className="text-slate-500 font-medium mt-1">Track classroom performance and student growth</p>
                </div>
                
                <button className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                    <Download size={16} /> Export Report
                </button>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="card p-6 border-none shadow-sm bg-indigo-50/50 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">Class Average</p>
                        <p className="text-3xl font-black text-indigo-900">{classAverage}%</p>
                    </div>
                </div>

                <div className="card p-6 border-none shadow-sm bg-emerald-50/50 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                        <Award size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Top Score</p>
                        <p className="text-3xl font-black text-emerald-900">
                            {grades.length > 0 ? Math.max(...grades.map(g => g.percentage)) : 0}%
                        </p>
                    </div>
                </div>

                <div className="card p-6 border-none shadow-sm bg-blue-50/50 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                        <Users size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Total Graded</p>
                        <p className="text-3xl font-black text-blue-900">{grades.length}</p>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="card p-0 border-none shadow-xl bg-white overflow-hidden rounded-[40px]">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Find student or exam..." 
                            className="w-full pl-12 pr-6 py-4 bg-white border-none rounded-2xl text-sm font-medium shadow-sm focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-300"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-4 bg-white rounded-2xl text-slate-400 hover:text-slate-600 shadow-sm border border-slate-50 transition-all">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Student Details</th>
                                <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Examination</th>
                                <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Marks</th>
                                <th className="px-8 py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center text-slate-300 font-bold uppercase tracking-widest text-xs animate-pulse">
                                        Calculating metrics...
                                    </td>
                                </tr>
                            ) : grades.map((g, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-active group-hover:text-white transition-all">
                                                {g.student_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 leading-tight">{g.student_name}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{g.roll_number}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-xs font-bold text-slate-600">{g.exam_title}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-slate-900">{g.marks_obtained}</span>
                                            <span className="text-[10px] font-bold text-slate-300">/ {g.total_marks}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <PerformanceBadge percentage={g.percentage} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <footer className="mt-12 pt-8 border-t border-slate-200 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Centralized Academic Registrar • v3.8.1</p>
            </footer>
        </div>
    );
}
