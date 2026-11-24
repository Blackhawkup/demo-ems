import React from 'react';
import { Priority, MemberTaskStatus, Role, TaskStatus } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'priority' | 'status' | 'role' | 'default';
  priority?: Priority;
  status?: MemberTaskStatus | TaskStatus | 'Overdue';
  role?: Role;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  priority,
  status,
  role,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs font-semibold';

  // Priority Styles
  if (priority || variant === 'priority') {
    const p = priority || 'Medium';
    switch (p) {
      case 'Critical':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-semibold ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
            Critical
          </span>
        );
      case 'High':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-semibold ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            High
          </span>
        );
      case 'Medium':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-medium ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 font-medium ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Low
          </span>
        );
    }
  }

  // Status Styles
  if (status || variant === 'status') {
    const s = status || 'Pending';
    switch (s) {
      case 'Completed':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-medium ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            In Progress
          </span>
        );
      case 'Active':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 font-medium ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            Active
          </span>
        );
      case 'Overdue':
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-lg bg-rose-100 border border-rose-300 text-rose-800 font-bold ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            Overdue
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 font-medium ${sizeClasses} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Pending
          </span>
        );
    }
  }

  // Role Styles
  if (role || variant === 'role') {
    const r = role || 'Analyst';
    switch (r) {
      case 'Team Lead':
        return (
          <span className={`inline-flex items-center rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold ${sizeClasses} ${className}`}>
            Team Lead
          </span>
        );
      case 'Banker':
        return (
          <span className={`inline-flex items-center rounded-lg bg-sky-50 border border-sky-200 text-sky-700 font-semibold ${sizeClasses} ${className}`}>
            Banker
          </span>
        );
      case 'Analyst':
        return (
          <span className={`inline-flex items-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold ${sizeClasses} ${className}`}>
            Analyst
          </span>
        );
    }
  }

  return (
    <span className={`inline-flex items-center rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium ${sizeClasses} ${className}`}>
      {children}
    </span>
  );
};
