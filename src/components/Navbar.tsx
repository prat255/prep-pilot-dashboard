
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-jee-primary to-jee-secondary flex items-center justify-center text-white font-bold">
            J+
          </div>
          <span className="text-xl font-bold jee-gradient-text">JEETracker+</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-jee-primary dark:hover:text-jee-accent transition-colors">
            Home
          </Link>
          <Link to="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-jee-primary dark:hover:text-jee-accent transition-colors">
            Dashboard
          </Link>
          <Link to="/tests" className="text-gray-700 dark:text-gray-200 hover:text-jee-primary dark:hover:text-jee-accent transition-colors">
            Mock Tests
          </Link>
          <Link to="/revisions" className="text-gray-700 dark:text-gray-200 hover:text-jee-primary dark:hover:text-jee-accent transition-colors">
            Revisions
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{user.name.split(' ')[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  Settings
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-jee-primary to-jee-secondary hover:opacity-90">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-4 z-50 animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-gray-700 dark:text-gray-200 hover:text-jee-primary dark:hover:text-jee-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className="text-gray-700 dark:text-gray-200 hover:text-jee-primary dark:hover:text-jee-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/tests" 
              className="text-gray-700 dark:text-gray-200 hover:text-jee-primary dark:hover:text-jee-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Mock Tests
            </Link>
            <Link 
              to="/revisions" 
              className="text-gray-700 dark:text-gray-200 hover:text-jee-primary dark:hover:text-jee-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Revisions
            </Link>
            
            {user ? (
              <>
                <div className="border-t dark:border-gray-800 pt-2 mt-2"></div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <Link 
                  to="/settings" 
                  className="text-gray-700 dark:text-gray-200 hover:text-jee-primary dark:hover:text-jee-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="text-gray-700 dark:text-gray-200 hover:text-jee-primary dark:hover:text-jee-accent transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <Button 
                  variant="destructive" 
                  className="mt-2" 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Log In</Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-jee-primary to-jee-secondary hover:opacity-90">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
