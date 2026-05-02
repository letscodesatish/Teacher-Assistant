import React from 'react';
import { Calendar, Clock, BookOpen, ChevronRight } from 'lucide-react';

interface ExamCardProps {
    id: number;
    title: string;
    date: string;
    time: string;
    subject: string;
    status: 'Upcoming' | 'Ongoing' | 'Completed';
    onSendNotice?: (id: number) => void;
    onPrintNotice?: (id: number) => void;
}

const ExamCard: React.FC<ExamCardProps> = ({ id, title, date, time, subject, status, onSendNotice, onPrintNotice }) => {
    const statusColors = {
        Upcoming: 'bg-blue-50 text-blue-600 border-blue-100',
        Ongoing: 'bg-green-50 text-green-600 border-green-100 animate-pulse',
        Completed: 'bg-slate-50 text-slate-400 border-slate-100',
    };

    return (
        <div className="card p-5 flex items-center justify-between border-none shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${statusColors[status]} border shadow-inner`}>
                    <Calendar size={24} />
                </div>
                
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h4 className="font-black text-slate-900 leading-none">{title}</h4>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${statusColors[status]}`}>
                            {status}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 capitalize">
                        <BookOpen size={12} className="text-slate-400" /> {subject}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-600">{date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-600">{time}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {onPrintNotice && (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onPrintNotice(id);
                        }}
                        className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
                        title="Print Notice"
                    >
                        <span className="hidden md:inline">Print</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                    </button>
                )}
                {onSendNotice && (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onSendNotice(id);
                        }}
                        className="px-4 py-2 rounded-xl bg-green-50 text-green-600 border border-green-100 text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all flex items-center gap-2"
                    >
                        Send Notice
                    </button>
                )}
                <button className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-active group-hover:text-white transition-all">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default ExamCard;
