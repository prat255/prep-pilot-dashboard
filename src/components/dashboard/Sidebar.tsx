
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  BookOpen, 
  Clock, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  User,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import ThemeToggle from '../ThemeToggle';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(() => {
    // Check if sidebar state is stored in localStorage
    const savedState = localStorage.getItem('jeeTracker-sidebar');
    return savedState ? savedState === 'expanded' : window.innerWidth > 1024;
  });
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Update localStorage when expanded state changes
  useEffect(() => {
    localStorage.setItem('jeeTracker-sidebar', expanded ? 'expanded' : 'collapsed');
  }, [expanded]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Auto collapse on smaller screens
      if (window.innerWidth < 1024 && expanded) {
        setExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Check on initial render
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [expanded]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      icon: <Home className="h-5 w-5" />,
      title: 'Dashboard',
      path: '/dashboard'
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: 'Mock Tests',
      path: '/tests'
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: 'Revisions',
      path: '/revisions'
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: 'Pomodoro',
      path: '/pomodoro'
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: 'Settings',
      path: '/settings'
    }
  ];

  // Add admin link if user is admin
  if (user?.role === 'admin') {
    menuItems.push({
      icon: <Shield className="h-5 w-5" />,
      title: 'Admin',
      path: '/admin'
    });
  }

  // For mobile sidebar toggle
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Button - Visible on mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleMobileSidebar} 
          className="bg-white/20 backdrop-blur-lg border border-gray-200 dark:border-gray-800"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={cn(
        "h-screen bg-sidebar fixed top-0 left-0 z-40 flex-shrink-0 transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800",
        expanded ? "w-64" : "w-20",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Sidebar header with logo */}
          <div className={cn(
            "flex items-center h-16 px-4",
            expanded ? "justify-between" : "justify-center"
          )}>
            {expanded && (
              <Link to="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-jee-primary to-jee-secondary flex items-center justify-center text-white font-bold">
                  J+
                </div>
                <span className="text-xl font-bold jee-gradient-text">JEETracker+</span>
              </Link>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className={cn(
                "p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transform transition-transform",
                expanded ? "" : "rotate-180"
              )}
              aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* User information */}
          {user && (
            <div className={cn(
              "px-4 py-3 border-t border-b border-gray-200 dark:border-gray-700",
              expanded ? "text-left" : "text-center"
            )}>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-jee-primary/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-jee-primary" />
                </div>
                {expanded && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation links */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors",
                      location.pathname === item.path
                        ? "bg-jee-primary/10 text-jee-primary font-medium"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700",
                      expanded ? "justify-start" : "justify-center"
                    )}
                    onClick={() => window.innerWidth < 1024 && setIsMobileOpen(false)}
                  >
                    {item.icon}
                    {expanded && <span>{item.title}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Theme toggle and logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className={expanded ? "flex justify-between mb-4" : "flex justify-center mb-4"}>
              <ThemeToggle />
              {expanded && <span className="text-sm">Theme</span>}
            </div>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-center hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/20",
                expanded ? "justify-start gap-3" : "px-0"
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {expanded && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
