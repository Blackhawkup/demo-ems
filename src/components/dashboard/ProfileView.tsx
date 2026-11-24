import React, { useState } from 'react';
import { useEMS } from '../../context/EMSContext';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  ShieldCheck, 
  Key, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Lock,
  Save,
  RotateCcw
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, tasks, showToast, resetToDefaultData } = useEMS();
  const [password, setPassword] = useState('1234');
  const [confirmPassword, setConfirmPassword] = useState('1234');

  if (!currentUser) return null;

  const myTasks = tasks.filter((t) =>
    t.assignedMembers.some((m) => m.employeeId === currentUser.id)
  );
  const activeCount = myTasks.filter((t) => t.status === 'Active').length;
  const completedCount = myTasks.filter((t) => t.status === 'Completed').length;
  const completionRate = myTasks.length > 0 ? Math.round((completedCount / myTasks.length) * 100) : 100;

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    showToast('Password updated successfully for current session.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar name={currentUser.name} size="xl" avatarBg={currentUser.avatarBg} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{currentUser.name}</h1>
                <Badge role={currentUser.role} size="sm" />
              </div>
              <p className="text-xs text-blue-200 mt-1">{currentUser.department}</p>
              <p className="text-xs text-slate-400 font-mono">@{currentUser.username}</p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
            <span className="text-xs text-slate-400">Account Status</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {currentUser.status}
            </span>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/50">
          <div className="p-4 text-center">
            <p className="text-xs text-slate-500 font-medium">Assigned Tasks</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{myTasks.length}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs text-slate-500 font-medium">Active Tasks</p>
            <p className="text-2xl font-bold text-blue-600 mt-0.5">{activeCount}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs text-slate-500 font-medium">Completed</p>
            <p className="text-2xl font-bold text-emerald-600 mt-0.5">{completedCount}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs text-slate-500 font-medium">Completion Rate</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{completionRate}%</p>
          </div>
        </div>

        {/* Contact and Account Info */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
              Employee Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] text-slate-500 font-medium">Official Email Address</p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{currentUser.email}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] text-slate-500 font-medium">Primary Contact</p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">
                  {currentUser.phone || '+91 98101 23456'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] text-slate-500 font-medium">Department Division</p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{currentUser.department}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] text-slate-500 font-medium">Onboarding Date</p>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{currentUser.createdAt}</p>
              </div>
            </div>
          </div>

          {/* Security & Password Settings */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
              Security & Credentials
            </h3>
            <form onSubmit={handleUpdatePassword} className="mt-3 max-w-lg space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Change Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Update Password</span>
              </button>
            </form>
          </div>

          {/* Reset Demo Data Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Reset Demo Data</p>
              <p className="text-xs text-slate-400">Restore default employees and tasks</p>
            </div>
            <button
              type="button"
              onClick={resetToDefaultData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
