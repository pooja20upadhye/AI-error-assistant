import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, Plus, LogOut, Moon, Sun, Monitor, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/Button';

interface ErrorLog {
  id: number;
  error_message: string;
  created_at: string;
}

interface SidebarProps {
  errors: ErrorLog[];
  loading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ errors, loading }) => {
  const { logout, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-72 h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 border-r border-border shrink-0 transition-all duration-300">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold tracking-tight text-primary">
          <Sparkles size={20} />
          <span>Assistant</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="h-8 w-8 p-0">
          <Plus size={18} />
        </Button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Clock size={12} /> Recent History
        </div>
        
        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">Loading history...</div>
        ) : errors.length > 0 ? (
          errors.map((error) => (
            <div 
              key={error.id} 
              onClick={() => navigate(`/error/${error.id}`)}
              className={`sidebar-item ${location.pathname === `/error/${error.id}` ? 'active' : ''}`}
            >
              <AlertCircle size={16} className="shrink-0 opacity-60" />
              <span className="truncate">{error.error_message}</span>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground italic">No diagnostics yet</div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-200/50 dark:bg-zinc-900">
          <div className="flex gap-1">
            <Button variant={theme === 'light' ? 'secondary' : 'ghost'} size="icon" onClick={() => setTheme('light')} className="h-8 w-8">
              <Sun size={14} />
            </Button>
            <Button variant={theme === 'dark' ? 'secondary' : 'ghost'} size="icon" onClick={() => setTheme('dark')} className="h-8 w-8">
              <Moon size={14} />
            </Button>
            <Button variant={theme === 'system' ? 'secondary' : 'ghost'} size="icon" onClick={() => setTheme('system')} className="h-8 w-8">
              <Monitor size={14} />
            </Button>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8 text-muted-foreground hover:text-destructive">
            <LogOut size={14} />
          </Button>
        </div>
        <div className="px-2 text-xs font-medium text-muted-foreground">
          {user?.name}
        </div>
      </div>
    </div>
  );
};
