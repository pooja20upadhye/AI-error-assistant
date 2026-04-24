import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, Plus, LogOut, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-72 h-screen flex flex-col bg-card border-r border-border shrink-0 transition-all duration-300 shadow-sm">
      {/* Header */}
      <div className="h-20 px-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3 font-black tracking-tight text-primary text-xl">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Sparkles size={22} />
          </div>
          <span>Assistant</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="h-10 w-10 p-0 rounded-xl hover:bg-primary/5">
          <Plus size={20} />
        </Button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground tracking-wider flex items-center gap-2">
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
          <div className="p-4 text-center text-sm text-muted-foreground">No diagnostics yet</div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border space-y-4 bg-secondary/50">
        <div className="flex items-center justify-between px-2">
          <div className="flex flex-col">
            <span className="text-[10px] tracking-[0.1em] font-bold text-muted-foreground">Active Session</span>
            <span className="text-sm font-bold text-foreground">{user?.name}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};
