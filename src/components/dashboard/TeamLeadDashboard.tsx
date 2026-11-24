import React, { useState, useMemo } from 'react';
import { useEMS, isTaskOverdue, sortTasksByPriority } from '../../context/EMSContext';
import { StatCard } from './StatCard';
import { AnalyticsGraphics } from './AnalyticsGraphics';
import { EmployeeTable } from '../admin/EmployeeTable';
import { AddEmployeeModal } from '../admin/AddEmployeeModal';
import { RemoveEmployeeDialog } from '../admin/RemoveEmployeeDialog';
import { EmployeeDetailModal } from '../admin/EmployeeDetailModal';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { Employee, Task } from '../../types';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Search, 
  Calendar,
  MessageSquare,
  Mail,
  ChevronRight,
  ShieldCheck,
  Building2,
  Trash2,
  UserPlus
} from 'lucide-react';

export const TeamLeadDashboard: React.FC = () => {
  const { 
    currentUser, 
    employees, 
    tasks, 
    setActiveView, 
    setIsCreateTaskModalOpen,
    setSelectedTask,
    setIsTaskDetailModalOpen,
    openReminderModal,
    changeTaskPriority,
    deleteTask
  } = useEMS();

  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'tasks'>('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [employeeToRemove, setEmployeeToRemove] = useState<Employee | null>(null);
  const [selectedProfileEmployee, setSelectedProfileEmployee] = useState<Employee | null>(null);

  const [taskSearch, setTaskSearch] = useState('');
  const [taskPriorityFilter, setTaskPriorityFilter] = useState('ALL');
  const [taskStatusFilter, setTaskStatusFilter] = useState('ALL');

  // Statistics
  const totalEmployees = employees.length;
  const totalActiveTasks = tasks.filter((t) => t.status === 'Active').length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const overdueTasks = tasks.filter((t) => isTaskOverdue(t)).length;

  // Filtered organization tasks
  const filteredTasks = useMemo(() => {
    let list = [...tasks];

    if (taskStatusFilter !== 'ALL') {
      list = list.filter((t) => t.status === taskStatusFilter);
    }

    if (taskPriorityFilter !== 'ALL') {
      list = list.filter((t) => t.priority === taskPriorityFilter);
    }

    if (taskSearch.trim()) {
      const q = taskSearch.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.createdBy.name.toLowerCase().includes(q) ||
          t.mandateId?.toLowerCase().includes(q) ||
          t.assignedMembers.some((m) => m.employeeName.toLowerCase().includes(q))
      );
    }

    return sortTasksByPriority(list);
  }, [tasks, taskStatusFilter, taskPriorityFilter, taskSearch]);

  const handleOpenTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailModalOpen(true);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-6 animate-fade-slide-up">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Executive Leadership Dashboard
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#094897] text-white">
              Team Lead
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Client Associates Multi-Family Office • Firm-Wide Team & Mandate Oversight
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs transition-colors active:scale-[0.98]"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#094897]" />
            <span>Add Employee</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateTaskModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#094897] hover:bg-[#073673] text-white shadow-2xs transition-colors active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          title="Team Members"
          value={totalEmployees}
          icon={<Users className="w-4 h-4" />}
          iconBg="bg-blue-50 text-[#094897]"
          onClick={() => {
            const el = document.getElementById('team-members-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <StatCard
          title="Active Mandates"
          value={totalActiveTasks}
          icon={<Clock className="w-4 h-4" />}
          iconBg="bg-sky-50 text-sky-700"
          onClick={() => {
            setTaskStatusFilter('Active');
            const el = document.getElementById('organization-tasks-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <StatCard
          title="Completed"
          value={completedTasks}
          icon={<CheckCircle2 className="w-4 h-4" />}
          iconBg="bg-emerald-50 text-emerald-600"
          badgeText={totalActiveTasks + completedTasks > 0 ? `${Math.round((completedTasks / (totalActiveTasks + completedTasks)) * 100)}%` : '0%'}
          badgeColor="bg-emerald-50 text-emerald-800 border border-emerald-200"
          onClick={() => {
            setTaskStatusFilter('Completed');
            const el = document.getElementById('organization-tasks-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <StatCard
          title="Overdue Tasks"
          value={overdueTasks}
          icon={<AlertTriangle className="w-4 h-4" />}
          iconBg="bg-rose-50 text-rose-600"
          badgeColor="bg-rose-50 text-rose-700 border border-rose-200"
          onClick={() => {
            setTaskStatusFilter('Active');
            setTaskPriorityFilter('Critical');
            const el = document.getElementById('organization-tasks-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>

      {/* Executive Graphics Module */}
      <AnalyticsGraphics
        tasks={tasks}
        title="Organization Advisory Pipeline & Risk Distribution"
        subtitle="Firm-wide operational capacity across Bankers and Analysts"
      />

      {/* SECTION 1: TEAM MEMBERS ROSTER & WORKLOAD (Immediately visible to Team Lead!) */}
      <div id="team-members-section" className="space-y-3 scroll-mt-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-[#094897]" />
              <span>Team Members & Workloads</span>
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 tabular-nums">
              {employees.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs font-bold text-[#094897] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Employee</span>
          </button>
        </div>

        {/* Comprehensive Employee Table */}
        <EmployeeTable
          onSelectEmployee={(emp: Employee) => setSelectedProfileEmployee(emp)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenRemoveDialog={(emp: Employee) => setEmployeeToRemove(emp)}
        />
      </div>

      {/* SECTION 2: ORGANIZATION TASKS OVERSIGHT (Directly visible on the dashboard!) */}
      <div id="organization-tasks-section" className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden space-y-0 scroll-mt-20">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Organization Tasks Oversight
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 tabular-nums">
              {filteredTasks.length}
            </span>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={taskStatusFilter}
              onChange={(e) => setTaskStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={taskPriorityFilter}
              onChange={(e) => setTaskPriorityFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks, assignees..."
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#094897] w-40 sm:w-56"
              />
            </div>
          </div>
        </div>

        {/* Task Rows */}
        <div className="divide-y divide-slate-100">
          {filteredTasks.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No tasks match your filter criteria.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const overdue = isTaskOverdue(task);
              const members = task.assignedMembers || [];
              const totalMembers = members.length;
              const completedMembers = members.filter((m) => m?.status === 'Completed').length;
              const progressPct = totalMembers > 0 ? Math.round((completedMembers / totalMembers) * 100) : 0;
              const primaryMember = members[0];

              return (
                <div
                  key={task.id}
                  onClick={() => handleOpenTask(task)}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left Column */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge priority={task.priority} size="sm" />
                      <Badge status={task.status} size="sm" />
                      {overdue && <Badge status="Overdue" size="sm" />}

                      {task.mandateId && (
                        <span className="text-[11px] font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {task.mandateId}
                        </span>
                      )}

                      {task.category && (
                        <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                          • {task.category}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#094897] transition-colors leading-snug">
                      {task.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-0.5 flex-wrap">
                      <span>Created by {task.createdBy?.name || 'Executive Lead'}</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className={overdue ? 'text-rose-600 font-bold' : ''}>
                          Due {formatDate(task.deadline)}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="flex items-center gap-5 shrink-0 self-end md:self-auto">
                    {/* Progress bar */}
                    <div className="w-28 space-y-1 hidden sm:block">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Progress</span>
                        <span className="font-semibold text-slate-700">{progressPct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            progressPct === 100
                              ? 'bg-emerald-500'
                              : progressPct > 0
                              ? 'bg-[#094897]'
                              : 'bg-slate-300'
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Team avatars */}
                    <div className="flex items-center -space-x-1.5" title="Assigned Team Members">
                      {members.slice(0, 3).map((m) => (
                        <Avatar key={m.employeeId} name={m.employeeName} size="sm" />
                      ))}
                      {members.length > 3 && (
                        <span className="w-6 h-6 rounded-full bg-slate-100 border border-white text-[10px] font-bold text-slate-600 flex items-center justify-center">
                          +{members.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() =>
                          openReminderModal('whatsapp', task, primaryMember?.employeeName || 'Team')
                        }
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="Simulate WhatsApp Reminder"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openReminderModal('email', task, primaryMember?.employeeName || 'Team')
                        }
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#094897] hover:bg-blue-50 transition-colors"
                        title="Simulate Email Reminder"
                      >
                        <Mail className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenTask(task)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="View Full Task Details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Admin Action Modals */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <RemoveEmployeeDialog
        employee={employeeToRemove}
        onClose={() => setEmployeeToRemove(null)}
      />

      <EmployeeDetailModal
        employee={selectedProfileEmployee}
        onClose={() => setSelectedProfileEmployee(null)}
      />
    </div>
  );
};