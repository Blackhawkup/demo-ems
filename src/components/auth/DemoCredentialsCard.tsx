import React, { useState } from 'react';
import { useEMS } from '../../context/EMSContext';
import { Users, X, Search, ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge';

interface DemoCredentialsCardProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (username: string) => void;
  onQuickLogin: (username: string) => void;
}

export const DemoCredentialsCard: React.FC<DemoCredentialsCardProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
  onQuickLogin,
}) => {
  const { employees } = useEMS();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'LEAD' | 'BANKER' | 'ANALYST'>('ALL');

  if (!isOpen) return null;

  const bankers = employees.filter((e) => e.role === 'Banker');
  const analysts = employees.filter((e) => e.role === 'Analyst');

  const filteredEmployees = employees.filter((e) => {
    if (activeTab === 'LEAD' && e.role !== 'Team Lead') return false;
    if (activeTab === 'BANKER' && e.role !== 'Banker') return false;
    if (activeTab === 'ANALYST' && e.role !== 'Analyst') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.username.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full flex flex-col max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Demo Accounts
                </h3>
                <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">
                  Password: 1234
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeTab === 'ALL' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('LEAD')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeTab === 'LEAD' ? 'bg-white text-indigo-700 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lead
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('BANKER')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeTab === 'BANKER' ? 'bg-white text-sky-700 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bankers
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ANALYST')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeTab === 'ANALYST' ? 'bg-white text-emerald-700 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Analysts
            </button>
          </div>
        </div>

        {/* Accounts List */}
        <div className="p-3 overflow-y-auto space-y-1.5 flex-1 divide-y divide-slate-100">
          {filteredEmployees.map((emp) => {
            const isLead = emp.role === 'Team Lead';
            const isBanker = emp.role === 'Banker';

            return (
              <div
                key={emp.id}
                className="pt-1.5 first:pt-0 flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${
                      isLead ? 'bg-indigo-600' : isBanker ? 'bg-sky-600' : 'bg-emerald-600'
                    }`}
                  >
                    {emp.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 truncate">{emp.name}</span>
                      <Badge role={emp.role} size="sm" />
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">
                      @{emp.username}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectAccount(emp.username);
                      onClose();
                    }}
                    className="px-2 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                  >
                    Fill
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onQuickLogin(emp.username);
                      onClose();
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white rounded-lg shadow-2xs transition-colors ${
                      isLead
                        ? 'bg-indigo-600 hover:bg-indigo-700'
                        : isBanker
                        ? 'bg-sky-600 hover:bg-sky-700'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    <span>Login</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
