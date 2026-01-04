
import React from 'react';
import { Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  title: string;
  showIcons?: boolean;
}

const Header = ({ title, showIcons = true }: HeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between mb-6">
      <div className="flex-1">
        {showIcons && (
          <Link to={user ? "/profile" : "/auth"}>
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
              <User className="text-primary" size={18} />
            </div>
          </Link>
        )}
      </div>
      
      <h1 className="text-xl font-bold text-center flex-1">{title}</h1>
      
      <div className="flex-1 flex justify-end">
        {showIcons && (
          <Link to="/notifications">
            <Bell className="text-muted-foreground hover:text-foreground transition-colors" size={22} />
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
