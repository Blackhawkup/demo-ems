import React, { useState, useMemo } from 'react';
import { useEMS, sortTasksByPriority, isTaskOverdue } from '../../context/EMSContext';
import { Task, Priority } from '../../types';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { 
  Search, 
  Trash2, 
  Eye, 
  AlertTriangle, 
  Calendar, 
  Plus
} from 'lucide-react';

export const TaskManagementView: React.FC = () => {
  const { 
    tasks, 
    setSelectedTask, 
    setIsTaskDetailModalOpen, 
    changeTaskPriority, 
    deleteTask,
    setIsCreateTaskModalOpen 
  } = useEMS();

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    let list = [...tasks];

    if (statusFilter !== 'ALL') {
      list = list.filter((t) => t.status === statusFilter);
    }

    if (priorityFilter !== 'ALL') {
      list = list.filter((t) => t.priority === priorityFilter);
    }

    if (overdueOnly) {
      list = list.filter((t) => isTaskOverdue(t));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.createdBy.name.toLowerCase().includes(q) ||
          t.assignedMembers.some((m) => m.employeeName.toLowerCase().includes(q))
      );
    }

    return sortTasksByPriority(list);
  }, [tasks, statusFilter, priorityFilter, overdueOnly, search]);

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

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Organization Tasks</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 tabular-nums">
              {filteredTasks.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateTaskModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors shrink-0 active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            onClick={() => setOverdueOnly(!overdueOnly)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              overdueOnly
                ? 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Overdue</span>
          </button>
        </div>
      </div>

      {/* Task Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Task Name</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Deadline</th>
                <th className="py-2.5 px-3">Creator</th>
                <th className="py-2.5 px-4">Progress</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No tasks found.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const overdue = isTaskOverdue(task);
                  const total = task.assignedMembers.length;
                  const completed = task.assignedMembers.filter((m) => m.status === 'Completed').length;
                  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

                  return (
                    <tr
                      key={task.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => handleOpenTask(task)}
                    >
                      {/* Title only */}
                      <td className="py-3 px-4 max-w-sm">
                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {task.title}
                        </p>
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={task.priority}
                          onChange={(e) => changeTaskPriority(task.id, e.target.value as Priority)}
                          className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-0.5 font-semibold text-slate-700"
                        >
                          <option value="Critical">Critical</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </td>

                      {/* Deadline */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 tabular-nums">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className={overdue ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                            {formatDate(task.deadline)}
                          </span>
                        </div>
                      </td>

                      {/* Creator */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-700 font-medium">
                        {task.createdBy.name}
                      </td>

                      {/* Progress */}
                      <td className="py-3 px-4 min-w-[160px]">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] tabular-nums text-slate-600">
                            <span>{completed}/{total} done</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                pct === 100 ? 'bg-emerald-500' : pct > 0 ? 'bg-blue-600' : 'bg-slate-300'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <Badge status={task.status} size="sm" />
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenTask(task)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Inspect Task Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {taskToDelete === task.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  deleteTask(task.id);
                                  setTaskToDelete(null);
                                }}
                                className="px-2 py-0.5 text-[10px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded"
                              >
                                Del
                              </button>
                              <button
                                type="button"
                                onClick={() => setTaskToDelete(null)}
                                className="px-1.5 py-0.5 text-[10px] text-slate-500 hover:bg-slate-200 rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setTaskToDelete(task.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                              title="Delete Task"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
