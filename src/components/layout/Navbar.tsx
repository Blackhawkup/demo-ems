import React, { useState, useRef, useEffect } from 'react';
import { useEMS } from '../../context/EMSContext';
import { 
  Building2, 
  Bell, 
  CheckCircle2, 
  MessageSquare, 
  LogOut, 
  ChevronDown, 
  RotateCcw, 
  Plus, 
  Users,
  ExternalLink
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';

interface NavbarProps {
  pageTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({ pageTitle }) => {
  const { 
    currentUser, 
    logout, 
    switchUser, 
    employees, 
    notifications, 
    setIsCreateTaskModalOpen,
    setIsWhatsAppDemoOpen,
    resetToDefaultData 
  } = useEMS();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Brand & Page Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 sm:hidden">
          <span className="font-extrabold text-sm tracking-tight text-slate-900">
            Client Associates
          </span>
        </div>

        <div className="hidden sm:block">
          <h1 className="text-base font-bold text-slate-900 tracking-tight">{pageTitle}</h1>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* WhatsApp Replication button */}
        <button
          type="button"
          onClick={() => setIsWhatsAppDemoOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-colors duration-150 active:scale-[0.98]"
          title="Open WhatsApp Replication Workflow"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="hidden md:inline">WhatsApp Bot</span>
        </button>

        {/* Create Task Button */}
        <button
          type="button"
          onClick={() => setIsCreateTaskModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-2xs transition-colors duration-150 active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Create Task</span>
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors duration-150"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Notifications ({notifications.length})
                </span>
                <span className="text-[11px] text-blue-600 font-medium">Realtime Alerts</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 py-1">
                {notifications.length === 0 ? (
                  <p className="p-4 text-xs text-slate-500 text-center">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors duration-150">
                      <div className="flex items-start gap-2.5">
                        <div className="p-1 rounded-lg bg-blue-50 text-blue-600 mt-0.5 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                          <p className="text-xs text-slate-600 leading-snug [text-wrap:pretty]">{n.message}</p>
                          <span className="text-[10px] text-slate-400 font-medium">{n.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors duration-150 border border-transparent hover:border-slate-200 active:scale-[0.98]"
          >
            <Avatar name={currentUser.name} size="sm" avatarBg={currentUser.avatarBg} />
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 font-medium">{currentUser.role}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-3">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 font-mono">@{currentUser.username}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <Badge role={currentUser.role} size="sm" />
                  <span className="text-[11px] text-slate-500 truncate">{currentUser.department}</span>
                </div>
              </div>

              {/* Quick switch account helper */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  Quick Switch Account
                </p>
                <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                  {employees
                    .filter((e) => e.id !== currentUser.id)
                    .map((emp) => (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => {
                          switchUser(emp.username);
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-1.5 rounded-lg text-left hover:bg-slate-50 text-xs transition-colors duration-150"
                      >
                        <span className="font-medium text-slate-700 truncate">{emp.name}</span>
                        <Badge role={emp.role} size="sm" />
                      </button>
                    ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    resetToDefaultData();
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-150"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset Demo Data</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors duration-150"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
