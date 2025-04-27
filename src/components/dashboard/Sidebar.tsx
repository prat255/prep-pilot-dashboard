
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  ListCheck,
  Settings,
  ArrowLeft,
  ArrowRight,
  Clock,
  Check
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: <Check className="h-5 w-5" />
    },
    {
      path: '/tests',
      label: 'Mock Tests',
      icon: <ListCheck className="h-5 w-5" />
    },
    {
      path: '/revisions',
      label: 'Revisions',
      icon: <Calendar className="h-5 w-5" />
    },
    {
      path: '/pomodoro',
      label: 'Pomodoro',
      icon: <Clock className="h-5 w-5" />
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />
    }
  ];

  return (
    <aside
      className={`bg-white dark:bg-gray-900 border-r dark:border-gray-800 h-screen transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className={`p-4 border-b dark:border-gray-800 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-jee-primary to-jee-secondary flex items-center justify-center text-white font-bold">
                J+
              </div>
              <span className="text-xl font-bold jee-gradient-text">JEETracker+</span>
            </Link>
          )}
          {collapsed && (
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-jee-primary to-jee-secondary flex items-center justify-center text-white font-bold">
              J+
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(true)}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="p-2 flex flex-col flex-1 overflow-y-auto">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center rounded-lg px-3 py-2 transition-colors ${
                  location.pathname === item.path
                    ? 'bg-jee-muted dark:bg-gray-800 text-jee-primary dark:text-jee-accent'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t dark:border-gray-800 flex justify-center">
          {collapsed ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(false)}
              className="h-8 w-8"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <div className="text-sm text-center text-gray-500 dark:text-gray-400">
              v1.0.0
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
