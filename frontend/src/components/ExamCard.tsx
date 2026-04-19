import React from 'react';
import { Calendar, Clock, BookOpen, ChevronRight } from 'lucide-react';

interface ExamCardProps {
    title: string;
    date: string;
    time: string;
    subject: string;
    status: 'Upcoming' | 'Ongoing' | 'Completed';
}

const ExamCard: React.FC<ExamCardProps> = ({ title, date, time, subject, status }) => {
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

            <button className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-active group-hover:text-white transition-all">
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default ExamCard;
