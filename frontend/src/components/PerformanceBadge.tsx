import React from 'react';

interface PerformanceBadgeProps {
    percentage: number;
}

const PerformanceBadge: React.FC<PerformanceBadgeProps> = ({ percentage }) => {
    let grade = 'F';
    let color = 'bg-rose-50 text-rose-600 border-rose-100';

    if (percentage >= 90) {
        grade = 'A+';
        color = 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]';
    } else if (percentage >= 80) {
        grade = 'A';
        color = 'bg-teal-50 text-teal-600 border-teal-100';
    } else if (percentage >= 70) {
        grade = 'B';
        color = 'bg-blue-50 text-blue-600 border-blue-100';
    } else if (percentage >= 60) {
        grade = 'C';
        color = 'bg-orange-50 text-orange-600 border-orange-100';
    } else if (percentage >= 50) {
        grade = 'D';
        color = 'bg-amber-50 text-amber-600 border-amber-100';
    }

    return (
        <span className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${color}`}>
            {grade}
        </span>
    );
};

export default PerformanceBadge;
