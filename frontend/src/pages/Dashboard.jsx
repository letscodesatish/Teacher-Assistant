import React from 'react';
import { 
  Users, 
  MessageSquare, 
  MoreHorizontal, 
  Eye, 
  Reply, 
  Archive,
  Target,
  ArrowUpRight,
  Clock,
  Calendar,
  CheckCircle2,
  HelpCircle,
  CreditCard,
  BookOpen
} from 'lucide-react';

const Dashboard = () => {
    return (
        <div className="flex flex-col gap-8">
            <div className="dashboard-grid">
                
                {/* New Attendance! (Mocking Feedback Layout) */}
                <div className="card">
                    <div className="card-title">
                        <span>New attendance!</span>
                        <span className="badge">3</span>
                    </div>
                    <div className="flex flex-col gap-6">
                        {[
                            { name: "Section A", topic: "Python Basics", time: "1h ago" },
                            { name: "Section B", topic: "Calculus II", time: "2h ago" },
                            { name: "Section A", topic: "Logic Design", time: "1d ago" },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                    <Users size={20} className="text-slate-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">Anonymous shared attendance about {item.topic}</p>
                                    <div className="flex gap-4 mt-2">
                                        <button className="flex items-center gap-1 text-[11px] font-bold text-slate-500"><Eye size={14}/> View</button>
                                        <button className="flex items-center gap-1 text-[11px] font-bold text-slate-500"><Reply size={14}/> Verify</button>
                                        <button className="flex items-center gap-1 text-[11px] font-bold text-slate-500"><Archive size={14}/> Archive</button>
                                    </div>
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Goals Card */}
                <div className="card">
                     <div className="card-title">Goals</div>
                     <div className="flex flex-col gap-8">
                        {[
                            { team: "Python Team", msg: "made progress towards their goal." },
                            { team: "AI Team", msg: "made added new items to their goal." },
                            { team: "UX Team", msg: "added new members to their goal." },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center">
                                        <Target size={14} className="text-slate-400" />
                                    </div>
                                    <p className="text-sm font-medium"><b className="font-bold">{item.team}</b> {item.msg}</p>
                                </div>
                                <Eye size={16} className="text-slate-400" />
                            </div>
                        ))}
                     </div>
                </div>

                {/* Classroom Pulse (Center Left) */}
                <div className="card">
                    <div className="card-title">Classroom pulse</div>
                    <div className="flex items-center justify-between">
                        <div className="pulse-gauge">
                            <span className="pulse-value">8.2</span>
                            <span className="pulse-label">/10</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            <Metric label="Attendance" val="7.4 ↑" />
                            <Metric label="Grades" val="6.8 ↑" />
                            <Metric label="Focus" val="8.3 ↑" />
                            <Metric label="Syllabus" val="9.1 ↑" />
                        </div>
                    </div>
                </div>

                {/* Upcoming 1-on-1 (Center Right) */}
                <div className="card">
                    <div className="card-title">Upcoming Exams</div>
                    <div className="flex flex-col gap-6">
                        {[
                            { name: "Rahul Sharma", role: "Class Rep" },
                            { name: "Priya Patel", role: "Monitor" },
                            { name: "Vikram Singh", role: "Student" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200" />
                                    <div>
                                        <p className="text-sm font-bold">{item.name}</p>
                                        <p className="text-xs text-slate-500">{item.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                     <button className="flex items-center gap-1 text-[11px] font-bold text-slate-500"><Eye size={14}/> View</button>
                                     <button className="flex items-center gap-1 text-[11px] font-bold text-slate-500"><Calendar size={14}/> Reschedule</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Row - Results and Progress */}
                <div className="card">
                    <div className="card-title">Syllabus Progress</div>
                    <div className="flex flex-col gap-6">
                        <ProgressRow label="Python Basics" val="Q3 review" />
                        <ProgressRow label="Advanced AI" val="Mid-term prep" />
                    </div>
                </div>

                <div className="card">
                    <div className="card-title">Analytics</div>
                    <p className="text-xs text-slate-500 mb-4">Overall effectiveness of studies:</p>
                    <div className="w-full h-10 bg-slate-100 rounded-sm mb-4 relative overflow-hidden">
                        <div className="absolute inset-y-0 left-0 bg-[#5b604b] w-[45%]" />
                        <div className="absolute inset-y-0 left-[45%] bg-[#a3a891] w-[20%]" />
                    </div>
                    <p className="text-xs text-slate-500 mb-4">Preparation for future leadership:</p>
                    <div className="w-full h-10 bg-slate-100 rounded-sm relative overflow-hidden">
                        <div className="absolute inset-y-0 left-0 bg-[#5b604b] w-[75%]" />
                    </div>
                </div>

                {/* Support Column (Right Mock) */}
                <div className="card border-0 bg-transparent shadow-none p-0 flex flex-col gap-4">
                    <div className="card p-4 flex items-center justify-between">
                        <span className="flex items-center gap-3 text-sm font-bold"><HelpCircle size={18}/> Help Center</span>
                    </div>
                    <div className="card p-4 flex items-center justify-between">
                        <span className="flex items-center gap-3 text-sm font-bold"><CreditCard size={18}/> Subscriptions</span>
                    </div>
                    <div className="card p-4 flex items-center justify-between">
                        <span className="flex items-center gap-3 text-sm font-bold"><Users size={18}/> Manage team</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

const Metric = ({ label, val }) => (
    <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#f3f4f0] border border-slate-200 flex items-center justify-center text-[10px] font-black">
            {val.split(' ')[1]}
        </div>
        <div>
            <p className="text-[12px] font-bold">{val.split(' ')[0]}</p>
            <p className="text-[10px] text-slate-500 font-medium uppercase">{label}</p>
        </div>
    </div>
);

const ProgressRow = ({ label, val }) => (
    <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center">
            <BookOpen size={14} className="text-slate-400" />
        </div>
        <div>
            <p className="text-sm font-bold">{label}</p>
            <p className="text-xs text-slate-500">{val}</p>
        </div>
    </div>
);

export default Dashboard;
