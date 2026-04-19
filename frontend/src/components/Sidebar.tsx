'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Camera, 
  Calendar,
  FileText,
  ClipboardList,
  Cpu,
  BookOpen,
  User,
  LogIn,
  GraduationCap
} from 'lucide-react';

const navItems = [
  { id: 'attendance', label: 'Attendance System', icon: Camera, path: '/attendance' },
  { id: 'exams', label: 'Exam Schedule', icon: Calendar, path: '/exams' },
  { id: 'marks', label: 'Marks & Grade Book', icon: FileText, path: '/marks' },
  { id: 'assignments', label: 'Assignment Manager', icon: ClipboardList, path: '/assignments' },
  { id: 'ai-question', label: 'AI Question Paper', icon: Cpu, path: '/question-paper' },
  { id: 'syllabus', label: 'Syllabus Tracker', icon: BookOpen, path: '/syllabus' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  { id: 'login', label: 'Login', icon: LogIn, path: '/login' },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="bg-active p-1.5 rounded-lg">
           <GraduationCap size={20} color="white" />
        </div>
        <span>Teacher Assistant</span>
      </div>

      <nav className="flex-1">
        <div className="nav-group">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (pathname === '/' && item.id === 'attendance');
            return (
              <Link 
                key={item.id}
                href={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon size={18} /> {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
