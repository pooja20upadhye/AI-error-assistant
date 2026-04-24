import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, Copy, Check, Sparkles, Terminal, ArrowRight } from 'lucide-react';
import api from '../api/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Sidebar } from '../components/Sidebar';

interface ErrorLog {
  id: number;
  error_message: string;
  ai_explanation: string;
  created_at: string;
}

const ErrorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<ErrorLog | null>(null);
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/errors/${id}`);
        setError(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/errors');
        setErrors(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleCopy = () => {
    if (!error) return;
    navigator.clipboard.writeText(error.ai_explanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">Analyzing diagnostic report...</p>
      </div>
    </div>
  );
  
  if (!error) return <div className="h-screen flex items-center justify-center text-zinc-500 bg-background">Report not found.</div>;

  return (
    <div className="flex h-screen bg-background overflow-hidden animate-fade-in">
      <Sidebar errors={errors} loading={historyLoading} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-background/50 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground">
              <ChevronLeft size={18} className="mr-1" /> Back
            </Button>
            <div className="h-4 w-px bg-border" />
            <div className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Sparkles size={14} className="text-primary" />
              Report ID: #{id}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleCopy} className="h-9 px-4">
              {copied ? <><Check size={14} className="mr-2 text-primary" /> Copied</> : <><Copy size={14} className="mr-2" /> Copy Solution</>}
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Share2 size={16} />
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-8 lg:px-24 py-16">
          <div className="max-w-4xl mx-auto space-y-16">
            
            {/* Original Traceback */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase ml-1 opacity-60">
                <Terminal size={14} />
                Input Traceback
              </div>
              <Card className="border-border/40 bg-zinc-100/50 dark:bg-zinc-900/50 overflow-hidden shadow-none backdrop-blur-sm">
                <div className="p-8 text-base text-destructive dark:text-red-400 font-mono whitespace-pre-wrap leading-relaxed">
                  {error.error_message}
                </div>
              </Card>
            </div>

            {/* AI Diagnosis */}
            <div className="space-y-8 pb-20">
              <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] text-primary uppercase ml-1">
                <Sparkles size={16} />
                AI Diagnosis & Fix
              </div>
              
              <div className="space-y-8">
                {error.ai_explanation.split('\n').filter(line => line.trim()).map((line, i) => {
                  if (line.startsWith('### ') || line.startsWith('**')) {
                    const text = line.replace(/### |\*\*/g, '');
                    return (
                      <h3 key={i} className="text-2xl font-black tracking-tight text-foreground pt-6 flex items-center gap-4">
                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                        {text}
                      </h3>
                    );
                  }
                  if (line.includes('`')) {
                    // Check if it's a code block-like line
                    const isFullCode = line.startsWith('`') && line.endsWith('`');
                    return (
                      <div key={i} className="my-6">
                         <div className="bg-zinc-950 text-zinc-100 p-6 rounded-2xl border border-white/10 overflow-x-auto font-mono text-sm leading-loose shadow-xl">
                           {line.split('`').map((part, index) => (
                             index % 2 === 1 ? <code key={index} className="text-primary-foreground bg-primary/20 px-1.5 py-0.5 rounded font-bold">{part}</code> : part
                           ))}
                         </div>
                      </div>
                    );
                  }
                  return <p key={i} className="text-muted-foreground text-lg leading-relaxed font-medium pl-6 border-l-2 border-border/20">{line}</p>;
                })}
              </div>
            </div>

            <div className="pt-16 border-t border-border/50 flex justify-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')} 
                className="text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all gap-3 group px-8 py-6 rounded-2xl text-base font-bold"
              >
                Found a new bug? Analyze it now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ErrorDetail;
