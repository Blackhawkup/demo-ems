import React from 'react';
import { useEMS } from '../../context/EMSContext';
import { Employee } from '../../types';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { TaskCard } from '../dashboard/TaskCard';
import { 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  Briefcase,
  UserCheck,
  Building2
} from 'lucide-react';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  onClose: () => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  onClose,
}) => {
  const { tasks, setSelectedTask, setIsTaskDetailModalOpen } = useEMS();

  if (!employee) return null;

  // Find all tasks assigned to this employee
  const assignedTasks = tasks.filter((t) =>
    t.assignedMembers.some((m) => m.employeeId === employee.id)
  );

  const activeTasks = assignedTasks.filter((t) => t.status === 'Active');
  const completedTasks = assignedTasks.filter((t) => t.status === 'Completed');

  const handleOpenTask = (task: any) => {
    setSelectedTask(task);
    setIsTaskDetailModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Profile Banner */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-start justify-between relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <Avatar name={employee.name} size="lg" avatarBg={employee.avatarBg} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">{employee.name}</h2>
                <Badge role={employee.role} size="sm" />
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">{employee.department}</p>
              <p className="text-xs text-slate-400 font-mono">@{employee.username}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[11px] text-slate-500 font-medium">Total Tasks</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{assignedTasks.length}</p>
              <p className="text-[10px] text-slate-500">Lifetime assignments</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[11px] text-slate-500 font-medium">Active Tasks</p>
              <p className="text-xl font-bold text-blue-600 mt-0.5">{activeTasks.length}</p>
              <p className="text-[10px] text-slate-500">In execution</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[11px] text-slate-500 font-medium">Completed Tasks</p>
              <p className="text-xl font-bold text-emerald-600 mt-0.5">{completedTasks.length}</p>
              <p className="text-[10px] text-slate-500">Finished</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[11px] text-slate-500 font-medium">Completion Rate</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                {assignedTasks.length > 0
                  ? `${Math.round((completedTasks.length / assignedTasks.length) * 100)}%`
                  : 'N/A'}
              </p>
              <p className="text-[10px] text-slate-500">Performance Index</p>
            </div>
          </div>

          {/* Contact and Department info */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{employee.email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{employee.phone || '+91 98000 00000'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Member since {employee.createdAt}</span>
            </div>
          </div>

          {/* Active Tasks List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Active Tasks ({activeTasks.length})</span>
              </h3>
            </div>

            {activeTasks.length === 0 ? (
              <p className="p-4 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                No active tasks assigned at this moment.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeTasks.map((t) => (
                  <TaskCard key={t.id} task={t} onOpenDetail={handleOpenTask} />
                ))}
              </div>
            )}
          </div>

          {/* Completed Tasks List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Completed Tasks ({completedTasks.length})</span>
              </h3>
            </div>

            {completedTasks.length === 0 ? (
              <p className="p-4 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                No completed tasks yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {completedTasks.map((t) => (
                  <TaskCard key={t.id} task={t} onOpenDetail={handleOpenTask} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
