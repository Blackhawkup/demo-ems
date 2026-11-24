import React from 'react';
import { Task } from '../../types';
import { useEMS, isTaskOverdue } from '../../context/EMSContext';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { Calendar } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onOpenDetail?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onOpenDetail }) => {
  const { setSelectedTask, setIsTaskDetailModalOpen } = useEMS();

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail(task);
    } else {
      setSelectedTask(task);
      setIsTaskDetailModalOpen(true);
    }
  };

  const overdue = isTaskOverdue(task);
  const totalMembers = task.assignedMembers.length;
  const completedMembers = task.assignedMembers.filter((m) => m.status === 'Completed').length;
  const progressPercent = totalMembers > 0 ? Math.round((completedMembers / totalMembers) * 100) : 0;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-colors duration-150 active:scale-[0.99] cursor-pointer flex flex-col justify-between select-none"
    >
      <div className="space-y-2.5">
        {/* Top meta strip */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge priority={task.priority} size="sm" />
            <Badge status={task.status} size="sm" />
            {overdue && <Badge status="Overdue" size="sm" />}
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium tabular-nums">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className={overdue ? 'text-rose-600 font-bold' : ''}>
              {formatDate(task.deadline)}
            </span>
          </div>
        </div>

        {/* Title ONLY - Description is hidden until clicked */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {task.title}
          </h3>
        </div>

        {/* Progress bar */}
        <div className="space-y-1 pt-0.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Progress</span>
            <span className="font-semibold text-slate-700 tabular-nums">
              {completedMembers}/{totalMembers} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                progressPercent === 100
                  ? 'bg-emerald-500'
                  : progressPercent > 0
                  ? 'bg-blue-600'
                  : 'bg-slate-300'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer info: Creator and assigned avatars */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-[11px] text-slate-400">By</span>
          <span className="text-xs font-semibold text-slate-700 truncate max-w-[130px]" title={task.createdBy.name}>
            {task.createdBy.name}
          </span>
        </div>

        {/* Assigned team member avatars */}
        <div className="flex items-center -space-x-1.5 overflow-hidden">
          {task.assignedMembers.slice(0, 4).map((member) => (
            <div
              key={member.employeeId}
              className="relative inline-block ring-2 ring-white rounded-full shrink-0"
              title={`${member.employeeName} (${member.role}): ${member.status}`}
            >
              <Avatar name={member.employeeName} size="sm" />
              {/* Status dot */}
              <span
                className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-1 ring-white ${
                  member.status === 'Completed'
                    ? 'bg-emerald-500'
                    : member.status === 'In Progress'
                    ? 'bg-blue-500'
                    : 'bg-slate-300'
                }`}
              />
            </div>
          ))}
          {task.assignedMembers.length > 4 && (
            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center ring-2 ring-white shrink-0">
              +{task.assignedMembers.length - 4}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
