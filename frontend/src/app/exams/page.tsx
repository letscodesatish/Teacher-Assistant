'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Filter, Plus, Search } from 'lucide-react';
import ExamCard from '@/components/ExamCard';

interface ExamRecord {
    id: number;
    title: string;
    date_time: string;
    subject: string;
}

export default function ExamSchedule() {
    const [exams, setExams] = useState<ExamRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const res = await axios.get('http://localhost:8005/exams');
                setExams(res.data);
            } catch (err) {
                console.error("Error fetching exams:", err);
                // Fallback mock data for demo if backend is empty
                setExams([
                    { id: 1, title: "Mid-Term Mathematics", date_time: "2024-05-15T09:00:00", subject: "Mathematics" },
                    { id: 2, title: "Physics Practical", date_time: "2024-05-18T14:00:00", subject: "Physics" },
                    { id: 3, title: "Computer Science Quiz", date_time: "2024-05-20T10:30:00", subject: "Applied Computing" }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    const formatDate = (isoStr: string) => {
        const date = new Date(isoStr);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatTime = (isoStr: string) => {
        const date = new Date(isoStr);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const handleSendNotice = async (examId: number) => {
        const exam = exams.find(e => e.id === examId);
        if (!exam) return;

        try {
            // 1. Get the linked group for this subject
            const linksRes = await axios.get('http://localhost:8005/whatsapp/links');
            const link = linksRes.data.find((l: any) => l.subjectCode === exam.subject);

            if (!link || !link.whatsappGroupId) {
                alert(`No WhatsApp group linked for ${exam.subject}. Please go to "WhatsApp Links" first.`);
                return;
            }

            if (!confirm(`Are you sure you want to send the official exam notice for ${exam.title} to the WhatsApp group?`)) {
                return;
            }

            // 2. Trigger the notice sending
            const noticeData = {
                noticeRef: `CSJMU/EXAM/${new Date().getFullYear()}/${exam.id.toString().padStart(3, '0')}`,
                issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                exams: [
                    {
                        code: "PY101",
                        subject: "Python Programming",
                        date: formatDate(exam.date_time),
                        time: formatTime(exam.date_time),
                        venue: "Main Campus Hall",
                        department: "Computer Science & Engineering"
                    }
                ]
            };

            const res = await axios.post(`http://localhost:8005/send-python-exam-notice`, {
                section: "Python Section A", // Defaulting to A for now
                exam_date: exam.date_time,
                group_id: link.whatsappGroupId,
                notice_data: noticeData
            });
            
            if (res.data.status === 'success') {
                alert("Notice sent successfully to WhatsApp group!");
            }
        } catch (err: any) {
            console.error("Error sending notice:", err);
            const errorMessage = err.response?.data?.detail || err.message || "Unknown error";
            alert(`Failed to send notice: ${errorMessage}`);
        }
    };

    const handlePrintNotice = async (examId: number) => {
        const exam = exams.find(e => e.id === examId);
        if (!exam) return;

        try {
            const noticeData = {
                noticeRef: `CSJMU/EXAM/${new Date().getFullYear()}/${exam.id.toString().padStart(3, '0')}`,
                issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                exams: [
                    {
                        code: "PY101",
                        subject: "Python Programming",
                        date: formatDate(exam.date_time),
                        time: formatTime(exam.date_time),
                        venue: "Main Campus Hall",
                        department: "Computer Science & Engineering"
                    }
                ]
            };

            // Call the frontend API directly to just generate the PDF
            const res = await axios.post('/api/pdf/generate', noticeData);
            
            if (res.data.success && res.data.url) {
                // Open the generated PDF in a new tab for printing
                window.open(res.data.url, '_blank');
            } else {
                alert("Failed to generate PDF for printing.");
            }
        } catch (err: any) {
            console.error("Error generating print notice:", err);
            alert("Error generating notice for print. Check console.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-10 flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar size={14} className="text-blue-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Academic Calendar</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Exam Schedule</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage and track upcoming assessments</p>
                </div>
                
                <button className="bg-active text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-black/10">
                    <Plus size={16} /> Schedule New
                </button>
            </header>

            <div className="flex items-center justify-between mb-8">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search exams, subjects..." 
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        <Filter size={14} /> Filter
                    </button>
                    <div className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-lg">
                        {exams.length} Scheduled
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">
                        Loading Schedule...
                    </div>
                ) : exams.length > 0 ? (
                    exams.map((exam, index) => (
                        <ExamCard 
                            key={exam.id}
                            id={exam.id}
                            title={exam.title}
                            date={formatDate(exam.date_time)}
                            time={formatTime(exam.date_time)}
                            subject={exam.subject}
                            status={index === 0 ? 'Upcoming' : 'Upcoming'}
                            onSendNotice={handleSendNotice}
                            onPrintNotice={handlePrintNotice}
                        />
                    ))
                ) : (
                    <div className="card p-12 text-center border-dashed border-2 border-slate-200">
                        <p className="text-slate-400 font-bold italic">No exams found in the database.</p>
                    </div>
                )}
            </div>

            <footer className="mt-12 pt-8 border-t border-slate-200 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Institutional Curriculum Control • v1.0.2</p>
            </footer>
        </div>
    );
}
