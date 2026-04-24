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
        <div className="flex-1 overflow-y-auto px-12 py-12">
          <div className="max-w-full lg:max-w-7xl space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
            
            {/* Original Traceback */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-tight text-primary ml-1">
                <Terminal size={14} />
                Input Traceback
              </div>
              <Card className="border-border bg-zinc-900/50 overflow-hidden shadow-2xl backdrop-blur-xl">
                <div className="p-8 text-base text-red-500 font-mono whitespace-pre-wrap leading-tight opacity-90">
                  {error.error_message}
                </div>
              </Card>
            </div>

            {/* AI Diagnosis */}
            <div className="space-y-8 pb-20">
              <div className="flex items-center gap-3 text-[11px] font-bold tracking-tight text-primary ml-1">
                <Sparkles size={16} />
                AI Diagnosis & Resolution
              </div>
              
              <div className="space-y-6">
                {error.ai_explanation.split('\n').filter(line => line.trim()).map((line, i) => {
                  if (line.startsWith('### ') || line.startsWith('**')) {
                    const text = line.replace(/### |\*\*/g, '');
                    return (
                      <h3 key={i} className="text-xl font-black tracking-tight text-foreground pt-4 flex items-center gap-4">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_#f43f5e]" />
                        {text}
                      </h3>
                    );
                  }
                  if (line.includes('`')) {
                    return (
                      <div key={i} className="my-4">
                         <div className="bg-black text-zinc-100 p-8 rounded-xl border border-border overflow-x-auto font-mono text-sm leading-tight shadow-3xl hover:border-primary/30 transition-colors">
                           {line.split('`').map((part, index) => (
                             index % 2 === 1 ? <code key={index} className="text-primary font-black bg-primary/5 px-1 py-0.5 rounded">{part}</code> : part
                           ))}
                         </div>
                      </div>
                    );
                  }
                  return <p key={i} className="text-muted-foreground text-base leading-snug font-medium pl-6 border-l-2 border-primary/20">{line}</p>;
                })}
              </div>
            </div>

            <div className="pt-12 border-t border-border flex justify-start">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')} 
                className="text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all gap-3 group px-8 py-6 rounded-xl text-sm font-black"
              >
                Launch New Diagnostic <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ErrorDetail;
