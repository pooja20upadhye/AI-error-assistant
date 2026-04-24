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
                className="pl-12 bg-white border-border rounded-2xl h-11 text-sm focus-visible:bg-white focus-visible:ring-primary/20 shadow-sm transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pt-12 pb-20 px-8 lg:px-16">
          <div className="max-w-[1400px] mx-auto space-y-16">
            {/* Hero Section */}
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="bg-primary/20 w-16 h-16 rounded-[2rem] flex items-center justify-center border-2 border-primary/40 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                <Sparkles size={32} className="text-primary" />
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-black tracking-tight text-foreground">
                  How can I help you debug today?
                </h1>
                <p className="text-muted-foreground text-base max-w-xl mx-auto font-medium opacity-70">
                  Paste your error traceback below and I'll provide an instant explanation and fix.
                </p>
              </div>
            </div>

            {/* Input Card */}
            <Card className="border-primary/20 bg-card/60 backdrop-blur-2xl shadow-[0_0_50px_rgba(99,102,241,0.1)] overflow-hidden group transition-all">
              <div className="p-3 flex items-center justify-between bg-secondary border-b border-border px-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                </div>
                <div className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground/60">System Diagnostics Active</div>
              </div>
              <CardContent className="p-0">
                <form onSubmit={handlePostError} className="relative">
                  <textarea 
                    className="w-full min-h-[350px] border-none bg-white p-10 text-lg font-mono leading-tight focus:outline-none focus:ring-0 placeholder:text-muted-foreground/40 scrollbar-hide resize-none shadow-inner text-foreground/90"
                    placeholder="TypeError: Cannot read property 'map' of undefined..."
                    value={newError}
                    onChange={(e) => setNewError(e.target.value)}
                    required
                  />
                  <div className="p-6 bg-secondary border-t border-border flex items-center justify-between backdrop-blur-md">
                    <div className="text-xs text-muted-foreground/50 font-bold flex items-center gap-2">
                      <Terminal size={14} />
                      Input Traceback Context
                    </div>
                    <Button 
                      disabled={posting || !newError.trim()} 
                      className="rounded-xl px-12 py-7 text-base font-black shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] transition-all active:scale-95 disabled:opacity-60 bg-primary text-primary-foreground flex items-center gap-3"
                    >
                      {posting ? 'Processing...' : <>Analyze Error <ArrowRight size={20} /></>}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Tips Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Python Traceback', desc: 'Debug Django/FastAPI logs' },
                { label: 'JavaScript TypeError', desc: 'Fix React/Node.js runtime crashes' },
                { label: 'SQL Syntax Error', desc: 'Optimize database queries' }
              ].map((tip) => (
                <div 
                  key={tip.label} 
                  className="p-8 rounded-2xl border border-border bg-white hover:bg-secondary/50 transition-all cursor-pointer group relative overflow-hidden hover:border-primary/50 shadow-sm"
                >
                  <div className="relative z-10 flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-widest font-black text-primary">Quick Start</span>
                    <span className="font-bold text-lg text-foreground group-hover:translate-x-1 transition-transform">{tip.label}</span>
                    <span className="text-xs text-muted-foreground font-medium opacity-60">{tip.desc}</span>
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
