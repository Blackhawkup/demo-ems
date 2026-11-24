import React, { useState, useMemo } from 'react';
import { useEMS, sortTasksByPriority } from '../../context/EMSContext';
import { TaskCard } from './TaskCard';
import { 
  Search, 
  Plus
} from 'lucide-react';

export const MyTasksView: React.FC = () => {
  const { currentUser, tasks, setIsCreateTaskModalOpen } = useEMS();
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const myTasks = useMemo(() => {
    if (!currentUser) return [];
    return tasks.filter((t) =>
      t.assignedMembers.some((m) => m.employeeId === currentUser.id)
    );
  }, [tasks, currentUser]);

  const filteredTasks = useMemo(() => {
    let list = [...myTasks];

    if (statusFilter !== 'ALL') {
      list = list.filter((t) => t.status === statusFilter);
    }

    if (priorityFilter !== 'ALL') {
      list = list.filter((t) => t.priority === priorityFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.createdBy.name.toLowerCase().includes(q)
      );
    }

    return sortTasksByPriority(list);
  }, [myTasks, statusFilter, priorityFilter, search]);

  if (!currentUser) return null;

  return (
    <div className="space-y-4">
      {/* Header and Filter Row */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold text-slate-900 tracking-tight">My Tasks</h1>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 tabular-nums">
            {filteredTasks.length}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-36 sm:w-48"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button
            type="button"
            onClick={() => setIsCreateTaskModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Grid of Task Cards */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
          No tasks found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};
