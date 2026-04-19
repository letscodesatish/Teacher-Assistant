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
    window.open(`http://localhost:8999/assignments/export/${id}`, '_blank');
  };

  return (
    <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-3xl -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
            <FileText size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">v1.2</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{subject}</span>
            </div>
            <h3 className="font-bold text-lg text-slate-900">{title}</h3>
          </div>
        </div>
        <button 
          onClick={exportAssignment}
          className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all"
        >
          <Download size={18} />
        </button>
      </div>

      <p className="text-slate-600 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
        {description}
      </p>

      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            <Calendar size={12} />
            <span>Due: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
