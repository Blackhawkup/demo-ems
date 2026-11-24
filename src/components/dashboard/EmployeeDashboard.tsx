import React, { useState, useMemo } from 'react';
import { useEMS, sortTasksByPriority, isTaskOverdue } from '../../context/EMSContext';
import { Task } from '../../types';
import { StatCard } from './StatCard';
import { AnalyticsGraphics } from './AnalyticsGraphics';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Search, 
  Calendar,
  MessageSquare,
  Mail,
  ChevronRight,
  Filter,
  UserCheck
} from 'lucide-react';

export const EmployeeDashboard: React.FC = () => {
  const { 
    currentUser, 
    tasks, 
    setIsCreateTaskModalOpen,
    setSelectedTask,
    setIsTaskDetailModalOpen,
    openReminderModal
  } = useEMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('Active');

  // Tasks assigned to this employee
  const myTasks = useMemo(() => {
    if (!currentUser) return [];
    return tasks.filter((t) =>
      t.assignedMembers.some((m) => m.employeeId === currentUser.id)
    );
  }, [tasks, currentUser]);

  const totalAssigned = myTasks.length;
  const activeTasks = myTasks.filter((t) => t.status === 'Active');
  const activeTasksCount = activeTasks.length;
  const completedTasksCount = myTasks.filter((t) => t.status === 'Completed').length;
  const highPriorityTasksCount = myTasks.filter(
    (t) => t.status === 'Active' && (t.priority === 'Critical' || t.priority === 'High')
  ).length;

  // Filtered and sorted tasks
  const displayTasks = useMemo(() => {
    let list = [...myTasks];

    if (statusFilter !== 'ALL') {
      list = list.filter((t) => t.status === statusFilter);
    }

    if (priorityFilter !== 'ALL') {
      list = list.filter((t) => t.priority === priorityFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.createdBy.name.toLowerCase().includes(q) ||
          t.mandateId?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q) ||
          t.clientFamily?.toLowerCase().includes(q)
      );
    }

    return sortTasksByPriority(list);
  }, [myTasks, statusFilter, priorityFilter, searchQuery]);

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
      {/* Clean Enterprise Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {currentUser.name}
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#094897] border border-blue-200">
              {currentUser.role}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 animate-pulse">
            Client Associates • {currentUser.department}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateTaskModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#094897] hover:bg-[#073673] text-white shadow-2xs transition-colors self-start sm:self-auto active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          title="Total Assigned"
          value={totalAssigned}
          icon={<CheckSquare className="w-4 h-4" />}
          iconBg="bg-blue-50 text-[#094897]"
          onClick={() => {
            setStatusFilter('ALL');
            setPriorityFilter('ALL');
          }}
        />

        <StatCard
          title="Active Tasks"
          value={activeTasksCount}
          icon={<Clock className="w-4 h-4" />}
          iconBg="bg-sky-50 text-sky-600"
          onClick={() => {
            setStatusFilter('Active');
            setPriorityFilter('ALL');
          }}
        />

        <StatCard
          title="Completed"
          value={completedTasksCount}
          icon={<CheckCircle2 className="w-4 h-4" />}
          iconBg="bg-emerald-50 text-emerald-600"
          badgeText={totalAssigned > 0 ? `${Math.round((completedTasksCount / totalAssigned) * 100)}%` : '0%'}
          badgeColor="bg-emerald-50 text-emerald-800 border border-emerald-200"
          onClick={() => {
            setStatusFilter('Completed');
            setPriorityFilter('ALL');
          }}
        />

        <StatCard
          title="Critical / High"
          value={highPriorityTasksCount}
          icon={<AlertTriangle className="w-4 h-4" />}
          iconBg="bg-rose-50 text-rose-600"
          badgeColor="bg-rose-50 text-rose-700 border border-rose-200"
          onClick={() => {
            setStatusFilter('Active');
            setPriorityFilter('Critical');
          }}
        />
      </div>

      {/* Clean Analytics Graphics Module (Replaces the map with clean corporate metrics) */}
      <AnalyticsGraphics
        tasks={myTasks}
        title="My Mandate Pipeline & Workload Allocation"
        subtitle="Visual distribution of active wealth management tasks by urgency"
      />

      {/* MAIN ACTIVE TASKS SECTION (Front and Center for Bankers & Analysts) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Controls Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Assigned Tasks & Mandates
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 tabular-nums">
              {displayTasks.length}
            </span>
          </div>

          {/* Filter Tabs and Search */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Pills */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('Active')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === 'Active'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('Completed')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === 'Completed'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed
              </button>
            </div>

            {/* Priority Selector */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#094897] w-36 sm:w-48"
              />
            </div>
          </div>
        </div>

        {/* Tasks List (Sorted by priority, zero text bloat, no emojis) */}
        <div className="divide-y divide-slate-100">
          {displayTasks.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No tasks match your selected filters.
            </div>
          ) : (
            displayTasks.map((task) => {
              const overdue = isTaskOverdue(task);
              const totalMembers = task.assignedMembers.length;
              const completedMembers = task.assignedMembers.filter((m) => m.status === 'Completed').length;
              const progressPct = totalMembers > 0 ? Math.round((completedMembers / totalMembers) * 100) : 0;
              const primaryMember = task.assignedMembers[0];

              return (
                <div
                  key={task.id}
                  onClick={() => handleOpenTask(task)}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left Column: Title, Mandate ID, Category, Priority */}
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

                      {task.clientFamily && (
                        <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                          • {task.clientFamily}
                        </span>
                      )}
                    </div>

                    {/* Task Title (No verbose description shown here!) */}
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#094897] transition-colors leading-snug">
                      {task.title}
                    </h3>

                    {/* Meta row: Creator & Due Date */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-0.5 flex-wrap">
                      <span>Created by {task.createdBy.name}</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className={overdue ? 'text-rose-600 font-bold' : ''}>
                          Due {formatDate(task.deadline)}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Progress, Team Avatars, and Quick Actions */}
                  <div className="flex items-center gap-5 shrink-0 self-end md:self-auto">
                    {/* Progress indicator */}
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

                    {/* Assigned Avatars */}
                    <div className="flex items-center -space-x-1.5" title="Assigned Team Members">
                      {task.assignedMembers.slice(0, 3).map((m) => (
                        <Avatar key={m.employeeId} name={m.employeeName} size="sm" />
                      ))}
                      {task.assignedMembers.length > 3 && (
                        <span className="w-6 h-6 rounded-full bg-slate-100 border border-white text-[10px] font-bold text-slate-600 flex items-center justify-center">
                          +{task.assignedMembers.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Quick Reminders Simulation Buttons */}
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
    </div>
  );
};