import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Sparkles, AlertCircle } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.data.token, res.data.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-gradient min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="glow-sphere" />
      
      <Card className="w-full max-w-lg z-10 border-border bg-card/60 backdrop-blur-2xl shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2 border border-primary/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Sparkles className="text-primary" size={24} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">Welcome Back</CardTitle>
          <CardDescription className="text-zinc-400">Sign in to continue your deep diagnostics.</CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md mb-6 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Email Address</label>
              <Input 
                type="email" 
                placeholder="pooja@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5 border-white/10"
              />
            </div>
            
            <Button type="submit" className="w-full mt-2 font-bold tracking-wide" disabled={loading}>
              {loading ? 'Authenticating...' : <><LogIn size={18} className="mr-2" /> Sign In</>}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
              Create one for free
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
