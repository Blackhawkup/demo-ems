import React from 'react';
import { useEMS } from '../../context/EMSContext';
import { 
  Building2, 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Briefcase, 
  PlusCircle, 
  UserCircle, 
  LogOut, 
  MessageSquare,
  RotateCcw
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    currentUser, 
    activeView, 
    setActiveView, 
    logout, 
    tasks, 
    employees,
    setIsCreateTaskModalOpen,
    setIsWhatsAppDemoOpen,
    resetToDefaultData
  } = useEMS();

  if (!currentUser) return null;

  const isTeamLead = currentUser.role === 'Team Lead';

  const myActiveTasksCount = tasks.filter(
    (t) =>
      t.status === 'Active' &&
      t.assignedMembers.some((m) => m.employeeId === currentUser.id)
  ).length;

  const totalActiveTasksCount = tasks.filter((t) => t.status === 'Active').length;

  return (
    <aside className="w-60 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
          CA
        </div>
        <div className="min-w-0">
          <span className="font-bold text-white text-sm tracking-tight">EMS</span>
          <p className="text-[11px] text-slate-400 truncate">Client Associates</p>
        </div>
      </div>

      {/* Current User Info Card */}
      <div className="p-3 mx-3 my-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
          {currentUser.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
          <p className="text-[10px] text-slate-400 truncate">{currentUser.role}</p>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
        <button
          type="button"
          onClick={() => setActiveView('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeView === 'dashboard'
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        {!isTeamLead ? (
          <button
            type="button"
            onClick={() => setActiveView('my-tasks')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeView === 'my-tasks'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <CheckSquare className="w-4 h-4" />
              <span>My Tasks</span>
            </div>
            {myActiveTasksCount > 0 && (
              <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded tabular-nums ${
                activeView === 'my-tasks' ? 'bg-white text-blue-700' : 'bg-slate-700 text-slate-300'
              }`}>
                {myActiveTasksCount}
              </span>
            )}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setActiveView('employee-management')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeView === 'employee-management'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Employees</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 rounded text-slate-400">
                {employees.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('task-management')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeView === 'task-management'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4" />
                <span>All Tasks</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 rounded text-slate-400">
                {totalActiveTasksCount}
              </span>
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => setIsCreateTaskModalOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-blue-400" />
          <span>Create Task</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('profile')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeView === 'profile'
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <UserCircle className="w-4 h-4" />
          <span>Profile</span>
        </button>

        <div className="pt-3">
          <button
            type="button"
            onClick={() => setIsWhatsAppDemoOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/40 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">WhatsApp Replication</span>
          </button>
        </div>
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <button
          type="button"
          onClick={resetToDefaultData}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          title="Reset to initial data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>

        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
