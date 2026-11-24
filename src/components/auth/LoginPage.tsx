import React, { useState, useMemo } from 'react';
import { useEMS } from '../../context/EMSContext';
import { DemoCredentialsCard } from './DemoCredentialsCard';
import { AnimatedBubbles } from '../common/AnimatedBubbles';
import { 
  ArrowRight, 
  MessageSquare, 
  Eye, 
  EyeOff, 
  Users, 
  CheckCircle,
  TrendingUp,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const LoginPage: React.FC = () => {
  const { login, employees, setIsWhatsAppDemoOpen } = useEMS();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // Dynamic role identification when typing a valid username
  const matchedEmployee = useMemo(() => {
    if (!username.trim()) return null;
    return employees.find(
      (e) => e.username.toLowerCase() === username.trim().toLowerCase()
    );
  }, [username, employees]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      login(username.trim(), password || '1234');
      setIsSubmitting(false);
    }, 200);
  };

  const handleSelectAccount = (uname: string) => {
    setUsername(uname);
    setPassword('1234');
  };

  const handleQuickLogin = (uname: string) => {
    setUsername(uname);
    setPassword('1234');
    login(uname, '1234');
  };

  return (
    <div className="min-h-screen bg-[#011226] flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans selection:bg-[#094897] selection:text-white relative overflow-hidden">
      
      {/* Outer Screen Ambient Animated Blue Bubbles in Background (Outside the box) */}
      <AnimatedBubbles theme="dark" className="absolute inset-0 w-full h-full pointer-events-none" opacity={0.32} />

      {/* Main Card Container */}
      <div className="max-w-6xl w-full bg-[#031a34] rounded-[32px] lg:rounded-[40px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-700/40 relative z-10 animate-fade-slide-up">
        
        {/* LEFT PANEL: Deep Corporate Navy as before, NO BUBBLES INSIDE */}
        <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between text-white relative overflow-hidden bg-gradient-to-b from-[#031a34] via-[#021830] to-[#011226] min-h-[520px]">
          
          {/* Top Brand Tagline */}
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[#13A28F] animate-pulse" />
              <span>Private Wealth Management & MFO</span>
            </div>
            <p className="text-xs text-slate-300 tracking-wide font-normal pt-1.5 leading-relaxed max-w-xs">
              Preserving, growing, and transitioning family wealth across generations since 2002.
            </p>
          </div>

          {/* Center Editorial Typography with Loading Text Shimmer */}
          <div className="my-8 lg:my-auto relative z-10 space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.12] text-white">
              Celebrate life<br />
              <span className="animate-text-shimmer font-extrabold">
                with Client Associates
              </span>
            </h1>
            <p className="text-xs text-slate-300 font-mono tracking-wider uppercase">
              Employee Task Management System
            </p>
          </div>

          {/* Bottom Translucent Corporate Metrics */}
          <div className="relative z-10 pt-4 flex items-center justify-between gap-3 text-xs text-slate-300 border-t border-white/15 backdrop-blur-xs">
            <div>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider">AUM Exposure</span>
              <span className="font-extrabold text-white text-base tabular-nums">₹42,500 Cr+</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Advisory Network</span>
              <span className="font-extrabold text-[#38bdf8] text-base">11 Wealth Hubs</span>
            </div>
          </div>

          {/* Ambient Lighting Orbs for Deep Multi-Layer Glow */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#094897]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -right-20 w-60 h-60 bg-[#13A28F]/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* RIGHT PANEL: Pure Crisp White SaaS Card with Client Associates Blue Accents */}
        <div className="lg:col-span-7 bg-white rounded-t-[32px] lg:rounded-t-none lg:rounded-[32px] p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
          
          {/* Top Bar: Clean Brand Name (NO LOGO PLACEHOLDER BOX) & Demo Accounts Button */}
          <div className="flex items-center justify-between pb-4">
            <div>
              {/* Clean typographic brand name without any placeholder icon box */}
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 block leading-tight">
                Client Associates
              </span>
              <span className="text-[11px] text-slate-500 font-medium block">
                Employee Task Portal
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsDemoModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#094897] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-[#094897]" />
              <span>Demo Accounts</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="max-w-md w-full mx-auto my-auto py-4 space-y-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Sign In
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your employee credentials to access your task dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username (e.g. lead, karan, rahul)"
                  required
                  className="w-full px-5 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#094897]/30 focus:border-[#094897] transition-all placeholder-slate-400 shadow-2xs"
                />

                {matchedEmployee && (
                  <div className="mt-1.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs animate-fade-slide-up">
                    <span className="font-semibold text-slate-800 truncate">{matchedEmployee.name}</span>
                    <Badge role={matchedEmployee.role} size="sm" />
                  </div>
                )}
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (Default: 1234)"
                  required
                  className="w-full px-5 pr-12 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#094897]/30 focus:border-[#094897] transition-all placeholder-slate-400 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Hint */}
              <div className="flex items-center justify-between text-xs px-1">
                <button
                  type="button"
                  onClick={() => setIsDemoModalOpen(true)}
                  className="text-[#094897] font-semibold hover:underline cursor-pointer"
                >
                  Default password for all accounts: 1234
                </button>
              </div>

              {/* Client Associates Corporate Navy Sign In Button with subtle hover lift */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-[#094897] hover:bg-[#073673] shadow-md shadow-blue-900/20 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
              </button>

              {/* Show WhatsApp Replication Button */}
              <button
                type="button"
                onClick={() => setIsWhatsAppDemoOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Show WhatsApp Replication</span>
              </button>
            </form>

            {/* Quick 1-Click Role Switcher */}
            <div className="pt-2 text-center text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-slate-400">Quick Test Login: </span>
              <button
                type="button"
                onClick={() => handleQuickLogin('lead')}
                className="font-bold text-[#094897] hover:underline cursor-pointer"
              >
                Team Lead (lead)
              </button>
              <span className="mx-1.5 text-slate-300">•</span>
              <button
                type="button"
                onClick={() => handleQuickLogin('karan')}
                className="font-bold text-[#094897] hover:underline cursor-pointer"
              >
                Banker (karan)
              </button>
              <span className="mx-1.5 text-slate-300">•</span>
              <button
                type="button"
                onClick={() => handleQuickLogin('rahul')}
                className="font-bold text-[#094897] hover:underline cursor-pointer"
              >
                Analyst (rahul)
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <span>© 2002-2026 Client Associates. Internal Employee Portal.</span>
            <div className="flex items-center gap-4">
              <span className="hover:text-slate-600 cursor-pointer">Support</span>
              <span className="hover:text-slate-600 cursor-pointer">DLF Cyber City HQ</span>
            </div>
          </div>
        </div>

      </div>

      {/* Demo Credentials Modal */}
      <DemoCredentialsCard
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSelectAccount={handleSelectAccount}
        onQuickLogin={handleQuickLogin}
      />
    </div>
  );
};