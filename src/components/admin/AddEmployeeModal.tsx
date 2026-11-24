import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useEMS } from '../../context/EMSContext';
import { 
  X, 
  UserPlus, 
  Lock, 
  User, 
  Briefcase, 
  Building2, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose }) => {
  const { addEmployee } = useEMS();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('1234');
  const [role, setRole] = useState<'Banker' | 'Analyst'>('Analyst');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Employee Name is required.');
      return;
    }
    if (!username.trim()) {
      setError('Username is required.');
      return;
    }

    const result = addEmployee({
      name: name.trim(),
      username: username.trim(),
      password: password || '1234',
      role,
      department: department.trim() || (role === 'Banker' ? 'Private Banking' : 'Equity Research'),
    });

    if (result.success) {
      setName('');
      setUsername('');
      setPassword('1234');
      setDepartment('');
      setError(null);
      onClose();
    } else {
      setError(result.error || 'Failed to add employee');
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative bg-white rounded-3xl max-w-md w-full border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header in Client Associates Corporate Navy */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-[#094897]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add New Team Member</h3>
              <p className="text-xs text-slate-500">Create employee profile and login credentials</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Employee Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Full Name <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. Gaurav Kapoor"
                required
                className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#094897] focus:outline-none"
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Username <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''));
                  if (error) setError(null);
                }}
                placeholder="gaurav"
                required
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#094897] focus:outline-none font-mono text-xs"
              />
            </div>
            <p className="text-[11px] text-slate-400">Unique login identifier (used with password 1234)</p>
          </div>

          {/* Role selector */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Role <span className="text-rose-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('Analyst')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  role === 'Analyst'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Analyst</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('Banker')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  role === 'Banker'
                    ? 'bg-sky-50 border-sky-300 text-sky-800 shadow-2xs font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Banker</span>
              </button>
            </div>
          </div>

          {/* Department */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Department <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder={role === 'Banker' ? 'Private Banking & Wealth' : 'Equity Research & Valuation'}
                className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#094897] focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="1234"
                className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#094897] focus:outline-none font-mono text-xs"
              />
            </div>
            <p className="text-[11px] text-slate-400">Demo password defaults to 1234</p>
          </div>

          {/* Submit buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-[#094897] hover:bg-[#073673] rounded-xl shadow-xs transition-colors"
            >
              Save & Authorize Login
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

