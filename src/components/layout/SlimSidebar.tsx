import React from 'react';
import { useEMS } from '../../context/EMSContext';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Briefcase, 
  UserCircle, 
  LogOut, 
  MessageSquare, 
  RotateCcw,
  Plus,
  Building2
} from 'lucide-react';

export const SlimSidebar: React.FC = () => {
  const { 
    currentUser, 
    activeView, 
    setActiveView, 
    logout, 
    setIsCreateTaskModalOpen,
    setIsWhatsAppDemoOpen,
    resetToDefaultData 
  } = useEMS();

  if (!currentUser) return null;

  const isLead = currentUser.role === 'Team Lead';

  return (
    <aside className="w-16 sm:w-18 bg-white border-r border-slate-200/90 flex flex-col items-center justify-between py-5 shrink-0 z-20 select-none shadow-xs">
      {/* Top: Clean Client Associates Brand Trigger (Placeholder CA box removed) */}
      <div className="flex flex-col items-center gap-6">
        <button
          type="button"
          onClick={() => setActiveView('dashboard')}
          className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors"
          title="Client Associates EMS"
        >
          <Building2 className="w-5 h-5 text-[#094897]" />
        </button>

        {/* Navigation Icon Column */}
        <nav className="flex flex-col items-center gap-3">
          {/* Dashboard */}
          <button
            type="button"
            onClick={() => setActiveView('dashboard')}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
              activeView === 'dashboard'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Dashboard"
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>

          {/* Tasks List */}
          <button
            type="button"
            onClick={() => setActiveView('my-tasks')}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
              activeView === 'my-tasks'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="My Tasks"
          >
            <Package className="w-5 h-5" />
          </button>

          {/* Team Lead: Employees */}
          {isLead && (
            <button
              type="button"
              onClick={() => setActiveView('employee-management')}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                activeView === 'employee-management'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Employee Management"
            >
              <Users className="w-5 h-5" />
            </button>
          )}

          {/* Team Lead: All Organization Tasks */}
          {isLead && (
            <button
              type="button"
              onClick={() => setActiveView('task-management')}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                activeView === 'task-management'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Organization Task Registry"
            >
              <Briefcase className="w-5 h-5" />
            </button>
          )}

          {/* Create Task Button */}
          <button
            type="button"
            onClick={() => setIsCreateTaskModalOpen(true)}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
            title="Create Task"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* WhatsApp Bot Replication */}
          <button
            type="button"
            onClick={() => setIsWhatsAppDemoOpen(true)}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            title="WhatsApp Bot Simulation"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </nav>
      </div>

      {/* Bottom Icons */}
      <div className="flex flex-col items-center gap-3">
        {/* Profile */}
        <button
          type="button"
          onClick={() => setActiveView('profile')}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
            activeView === 'profile'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Profile & Settings"
        >
          <UserCircle className="w-5 h-5" />
        </button>

        {/* Reset Demo Data */}
        <button
          type="button"
          onClick={resetToDefaultData}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Reset Demo Data"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
