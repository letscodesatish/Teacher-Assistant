import React, { useState } from 'react';
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
import AttendanceCamera from './components/AttendanceCamera';
import SyllabusTracker from './pages/SyllabusTracker';
import AIContent from './pages/AIContent';
import ExamSchedule from './pages/ExamSchedule';
import MarksGradebook from './pages/MarksGradebook';
import AssignmentManager from './pages/AssignmentManager';
import Profile from './pages/Profile';
import Login from './pages/Login';

function App() {
  const [activeTab, setActiveTab] = useState('attendance');

  const renderContent = () => {
    switch (activeTab) {
      case 'attendance': return <AttendanceCamera />;
      case 'exams': return <ExamSchedule />;
      case 'marks': return <MarksGradebook />;
      case 'assignments': return <AssignmentManager />;
      case 'ai-question': return <AIContent />;
      case 'syllabus': return <SyllabusTracker />;
      case 'profile': return <Profile />;
      case 'login': return <Login />;
      default: return <AttendanceCamera />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="bg-active p-1.5 rounded-lg">
             <GraduationCap size={20} color="white" />
          </div>
          <span>Teacher Assistant</span>
        </div>

        <nav className="flex-1">
          <div className="nav-group">
            <button 
              className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('attendance')}
            >
              <Camera size={18} /> Attendance System
            </button>
            <button 
              className={`nav-item ${activeTab === 'exams' ? 'active' : ''}`}
              onClick={() => setActiveTab('exams')}
            >
              <Calendar size={18} /> Exam Schedule
            </button>
            <button 
              className={`nav-item ${activeTab === 'marks' ? 'active' : ''}`}
              onClick={() => setActiveTab('marks')}
            >
              <FileText size={18} /> Marks & Grade Book
            </button>
            <button 
              className={`nav-item ${activeTab === 'assignments' ? 'active' : ''}`}
              onClick={() => setActiveTab('assignments')}
            >
              <ClipboardList size={18} /> Assignment Manager
            </button>
            <button 
              className={`nav-item ${activeTab === 'ai-question' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai-question')}
            >
              <Cpu size={18} /> AI Question Paper
            </button>
            <button 
              className={`nav-item ${activeTab === 'syllabus' ? 'active' : ''}`}
              onClick={() => setActiveTab('syllabus')}
            >
              <BookOpen size={18} /> Syllabus Tracker
            </button>
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} /> Profile
            </button>
            <button 
              className={`nav-item ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              <LogIn size={18} /> Login
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-stage">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
