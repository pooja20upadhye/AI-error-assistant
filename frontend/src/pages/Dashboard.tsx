import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Terminal, ArrowRight } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { Sidebar } from '../components/Sidebar';

interface ErrorLog {
  id: number;
  error_message: string;
  ai_explanation: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [newError, setNewError] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  
  useAuth();
  const navigate = useNavigate();

  const fetchErrors = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/errors?keyword=${search}`);
      setErrors(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrors();
  }, [search]);

  const handlePostError = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newError.trim()) return;
    
    setPosting(true);
    try {
      const res = await api.post('/errors', { errorMessage: newError });
      setNewError('');
      fetchErrors();
      navigate(`/error/${res.data.data.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden animate-fade-in">
      <Sidebar errors={errors} loading={loading} />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header with Search */}
        <header className="h-20 border-b border-border/40 flex items-center px-8 bg-background/50 backdrop-blur-md z-10">
          <div className="max-w-2xl w-full">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <Input 
                placeholder="Search your diagnostics history..." 
                className="pl-12 bg-muted/30 border-transparent rounded-2xl h-11 text-sm focus-visible:bg-background focus-visible:ring-primary/20 shadow-sm transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pt-16 pb-20 px-8 lg:px-24">
          <div className="max-w-4xl mx-auto space-y-16">
            {/* Hero Section */}
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="bg-primary/10 w-20 h-20 rounded-[2.5rem] flex items-center justify-center border-2 border-primary/20 shadow-2xl shadow-primary/10 animate-float">
                <Sparkles size={40} className="text-primary" />
              </div>
              <div className="space-y-2">
                <h1 className="text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                  How can I help you debug today?
                </h1>
                <p className="text-muted-foreground text-xl max-w-xl mx-auto font-medium">
                  Paste your error traceback below and I'll provide an instant explanation and fix.
                </p>
              </div>
            </div>

            {/* Input Card */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-3xl overflow-hidden group transition-all hover:shadow-primary/5">
              <div className="p-2 flex items-center justify-between bg-muted/40 border-b border-border/50 px-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/50" />
                </div>
                <div className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground/60 uppercase">DIAGNOSTICS ENGINE ACTIVE</div>
              </div>
              <CardContent className="p-0">
                <form onSubmit={handlePostError} className="relative">
                  <textarea 
                    className="w-full min-h-[250px] border-none bg-transparent p-8 text-lg font-mono leading-relaxed focus:outline-none focus:ring-0 placeholder:text-muted-foreground/20 scrollbar-hide resize-none"
                    placeholder="TypeError: Cannot read property 'map' of undefined..."
                    value={newError}
                    onChange={(e) => setNewError(e.target.value)}
                    required
                  />
                  <div className="p-6 bg-muted/10 border-t border-border/30 flex items-center justify-between backdrop-blur-sm">
                    <div className="text-xs text-muted-foreground font-semibold flex items-center gap-2 opacity-70">
                      <Terminal size={14} />
                      Attach code context for better results
                    </div>
                    <Button 
                      disabled={posting || !newError.trim()} 
                      className="rounded-full px-10 py-6 text-base font-bold shadow-2xl hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
                    >
                      {posting ? (
                        <span className="flex items-center gap-2">Processing...</span>
                      ) : (
                        <span className="flex items-center gap-2">Analyze Error <ArrowRight size={20} /></span>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Tips Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Python Traceback', color: 'blue' },
                { label: 'JavaScript TypeError', color: 'amber' },
                { label: 'SQL Syntax Error', color: 'emerald' }
              ].map((tip) => (
                <div 
                  key={tip.label} 
                  className="p-6 rounded-2xl border border-border/40 bg-muted/10 hover:bg-muted/30 transition-all cursor-pointer text-muted-foreground hover:text-foreground group relative overflow-hidden"
                >
                  <div className="relative z-10 flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">Quick start</span>
                    <span className="font-semibold text-base">{tip.label}</span>
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Sparkles size={80} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
