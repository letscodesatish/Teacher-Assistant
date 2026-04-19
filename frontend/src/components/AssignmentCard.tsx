import React from 'react';
import { Download, Calendar, BookOpen, Clock, FileText } from 'lucide-react';

interface AssignmentCardProps {
  id: number;
  title: string;
  description: string;
  subject: string;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ id, title, description, subject }) => {
  const exportAssignment = () => {
    window.open(`http://localhost:8005/assignments/export/${id}`, '_blank');
  };

  return (
    <div className="assignment-card-premium group">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-slate-100 transition-colors">
            <BookOpen className="text-slate-900" size={20} />
          </div>
          <div>
            <span className="badge-ai mb-1 inline-block">v1.2</span>
            <h3 className="text-lg font-bold text-slate-900 pr-4">{title}</h3>
          </div>
        </div>
        <button 
          onClick={exportAssignment}
          className="p-2 hover:bg-slate-50 rounded-xl transition-colors border border-slate-100 shadow-sm"
          title="Download PDF"
        >
          <Download size={18} className="text-slate-600" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
          <FileText size={14} />
          {subject}
        </div>
        
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>

        <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
           <div className="flex items-center gap-2">
             <Calendar size={12} />
             <span>Due: {new Date().toLocaleDateString()}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
