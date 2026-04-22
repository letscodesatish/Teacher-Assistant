'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Camera, 
  Calendar,
  FileText,
  ClipboardList,
  Cpu,
  BookOpen,
  User,
  LogIn,
  LogOut,
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
];

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Hide sidebar on login/register pages
  if (pathname === '/login' || pathname === '/register') return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="bg-active p-1.5 rounded-lg">
           <GraduationCap size={20} color="white" />
        </div>
        <span>Teacher Assistant</span>
      </div>

      <nav className="flex-1 overflow-y-auto">
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

      <div className="sidebar-footer border-t border-white/5 pt-4">
        {status === 'authenticated' ? (
          <div className="space-y-2">
            <div className="px-4 py-2">
              <p className="text-sm font-medium text-white truncate">{session.user?.name || 'Teacher'}</p>
              <p className="text-xs text-slate-400 truncate">{session.user?.email}</p>
            </div>
            <button 
              onClick={() => signOut()}
              className="nav-item text-red-400 hover:bg-red-400/10 w-full flex items-center gap-2"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        ) : (
          <Link href="/login" className="nav-item">
            <LogIn size={18} /> Sign In
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
