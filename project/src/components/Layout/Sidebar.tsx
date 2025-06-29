import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Users, 
  Settings, 
  FileText, 
  MessageSquare,
  BarChart3,
  Clock
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isOpen: boolean;
}

export function Sidebar({ currentView, onViewChange, isOpen }: SidebarProps) {
  const { user } = useAuth();

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'courses', label: 'Course Management', icon: BookOpen },
          { id: 'requests', label: 'Change Requests', icon: FileText }
        ];
      case 'student':
        return [
          { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
          { id: 'schedule', label: 'My Schedule', icon: Calendar },
          { id: 'courses', label: 'My Courses', icon: BookOpen },
          { id: 'polls', label: 'Professor Polls', icon: MessageSquare },
          { id: 'notifications', label: 'Notifications', icon: FileText }
        ];
      case 'professor':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'schedule', label: 'My Schedule', icon: Calendar },
          { id: 'courses', label: 'My Courses', icon: BookOpen },
          { id: 'requests', label: 'Change Requests', icon: Clock },
          { id: 'polls', label: 'Create Polls', icon: MessageSquare }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => {}}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-300 ease-in-out
        w-64 bg-white border-r border-gray-200 flex flex-col
      `}>
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left
                      transition-colors duration-200
                      ${isActive
                        ? 'bg-primary-100 text-primary-900 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon
                      className={`
                        mr-3 flex-shrink-0 h-5 w-5
                        ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}
                      `}
                    />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        
        {/* User info at bottom */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 capitalize">
                  {user?.role} - {user?.department}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}