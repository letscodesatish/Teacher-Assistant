import React from 'react';
import { Users, UserPlus, Clock } from 'lucide-react';

const AttendanceStats = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="card p-4 flex items-center gap-4 border-none shadow-sm bg-blue-50">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                    <Users size={24} />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase text-blue-600/60 tracking-wider">Total Students</p>
                    <p className="text-xl font-black text-blue-900">42</p>
                </div>
            </div>

            <div className="card p-4 flex items-center gap-4 border-none shadow-sm bg-green-50">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-green-600 shadow-sm">
                    <UserPlus size={24} />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase text-green-600/60 tracking-wider">Present Today</p>
                    <p className="text-xl font-black text-green-900">28</p>
                </div>
            </div>

            <div className="card p-4 flex items-center gap-4 border-none shadow-sm bg-orange-50">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-orange-600 shadow-sm">
                    <Clock size={24} />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase text-orange-600/60 tracking-wider">Remaining</p>
                    <p className="text-xl font-black text-orange-900">14</p>
                </div>
            </div>
        </div>
    );
};

export default AttendanceStats;
