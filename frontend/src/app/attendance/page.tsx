import React from 'react';
import AttendanceCamera from '@/components/AttendanceCamera';
import AttendanceStats from '@/components/AttendanceStats';
import { ShieldCheck } from 'lucide-react';

export default function AttendancePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Live</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Attendance System</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time biometric and geospatial verification</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
           <ShieldCheck size={20} className="text-blue-600" />
           <div className="text-right">
              <p className="text-[10px] font-black uppercase text-slate-400 leading-none">Status</p>
              <p className="text-xs font-bold text-slate-700">Protected</p>
           </div>
        </div>
      </header>

      <AttendanceStats />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-12">
           <AttendanceCamera />
        </div>
      </div>
      
      <footer className="mt-12 pt-8 border-t border-slate-200 text-center">
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Institutional Grade Verification • v2.4.0</p>
      </footer>
    </div>
  );
}
