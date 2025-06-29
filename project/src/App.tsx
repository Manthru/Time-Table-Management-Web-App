import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { AuthContainer } from './components/Auth/AuthContainer';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';
import { StudentDashboard } from './components/Dashboard/StudentDashboard';
import { ProfessorDashboard } from './components/Dashboard/ProfessorDashboard';
import { StudentSchedule } from './components/Student/StudentSchedule';
import { StudentCourses } from './components/Student/StudentCourses';
import { StudentPolls } from './components/Student/StudentPolls';
import { StudentNotifications } from './components/Student/StudentNotifications';
import { ProfessorSchedule } from './components/Professor/ProfessorSchedule';
import { ProfessorCourses } from './components/Professor/ProfessorCourses';
import { ProfessorRequests } from './components/Professor/ProfessorRequests';
import { ProfessorPolls } from './components/Professor/ProfessorPolls';
import { AdminCourses } from './components/Admin/AdminCourses';
import { AdminRequests } from './components/Admin/AdminRequests';

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setCurrentView('dashboard');
  }, [user]);

  // Handle browser back button to redirect to login
  useEffect(() => {
    if (user) {
      const handlePopState = (event: PopStateEvent) => {
        // Prevent default back navigation
        event.preventDefault();
        // Logout user which will redirect to login
        logout();
      };

      // Add a history entry when user enters dashboard
      window.history.pushState({ page: 'dashboard' }, '', window.location.href);
      
      // Listen for back button
      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [user, logout]);

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthContainer />;
  }

  const renderCurrentView = () => {
    if (user.role === 'student') {
      switch (currentView) {
        case 'dashboard':
          return <StudentDashboard />;
        case 'schedule':
          return <StudentSchedule />;
        case 'courses':
          return <StudentCourses />;
        case 'polls':
          return <StudentPolls />;
        case 'notifications':
          return <StudentNotifications />;
        default:
          return <StudentDashboard />;
      }
    }
    
    if (user.role === 'professor') {
      switch (currentView) {
        case 'dashboard':
          return <ProfessorDashboard />;
        case 'schedule':
          return <ProfessorSchedule />;
        case 'courses':
          return <ProfessorCourses />;
        case 'requests':
          return <ProfessorRequests />;
        case 'polls':
          return <ProfessorPolls />;
        default:
          return <ProfessorDashboard />;
      }
    }
    
    if (user.role === 'admin') {
      switch (currentView) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'courses':
          return <AdminCourses />;
        case 'requests':
          return <AdminRequests />;
        default:
          return <AdminDashboard />;
      }
    }
    
    // Placeholder for other views
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
        </h2>
        <p className="text-gray-600">
          This section is under development. The {currentView} functionality will be available soon.
        </p>
      </div>
    );
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar 
        currentView={currentView} 
        onViewChange={handleViewChange}
        isOpen={isMobileMenuOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuToggle={handleMenuToggle}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {renderCurrentView()}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;