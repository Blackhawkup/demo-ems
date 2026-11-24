import React, { useState } from 'react';
import { Task } from '../../types';
import { useEMS } from '../../context/EMSContext';
import { Avatar } from '../common/Avatar';
import { 
  MoreVertical, 
  MessageSquare, 
  Phone, 
  ChevronDown, 
  Plus, 
  ExternalLink 
} from 'lucide-react';

interface TaskFeedPanelProps {
  tasks: Task[];
  activeTask: Task;
  onSelectTask: (task: Task) => void;
  statusTab: 'Active' | 'Completed';
  onChangeStatusTab: (tab: 'Active' | 'Completed') => void;
}

export const TaskFeedPanel: React.FC<TaskFeedPanelProps> = ({
  tasks,
  activeTask,
  onSelectTask,
  statusTab,
  onChangeStatusTab,
}) => {
  const { 
    setSelectedTask, 
    setIsTaskDetailModalOpen, 
    openReminderModal,
    setIsCreateTaskModalOpen 
  } = useEMS();

  const handleOpenDetails = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailModalOpen(true);
  };

  const getStatusBadge = (task: Task) => {
    if (task.status === 'Completed') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
          DELIVERED
        </span>
      );
    }

    if (task.priority === 'Critical') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#d7ff38] text-black tracking-tight shadow-2xs">
          IN TRANSIT
        </span>
      );
    }

    if (task.priority === 'High') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#f3e8ff] text-[#7e22ce]">
          PACKED
        </span>
      );
    }

    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#d7ff38] text-black tracking-tight">
        IN TRANSIT
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 flex flex-col h-full max-h-[860px] overflow-hidden w-full lg:w-[410px] shrink-0">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Mandates
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsCreateTaskModalOpen(true)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
            title="Create Mandate"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pill Switcher matching Screenshot */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-full mb-4">
        <button
          type="button"
          onClick={() => onChangeStatusTab('Active')}
          className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all text-center ${
            statusTab === 'Active'
              ? 'bg-[#181513] text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          Active
        </button>
        <button
          type="button"
          onClick={() => onChangeStatusTab('Completed')}
          className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all text-center ${
            statusTab === 'Completed'
              ? 'bg-[#181513] text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          Delivered
        </button>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {tasks.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No mandates in this category.
          </div>
        ) : (
          tasks.map((task) => {
            const isSelected = activeTask.id === task.id;
            const primaryMember = task.assignedMembers[0];
            const routeTitle = `${task.originHub || 'Mumbai'} → ${task.targetHub || 'Gurugram HQ'}`;

            if (isSelected) {
              /* EXPANDED HERO CARD matching Screenshot 2 */
              return (
                <div
                  key={task.id}
                  className="rounded-2xl border-2 border-slate-900 p-4 bg-white shadow-sm space-y-3 transition-all"
                >
                  {/* Top route & badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {routeTitle}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Mandate {task.mandateId || `#${task.id.replace('task-', 'CA-')}`}
                      </p>
                    </div>
                    {getStatusBadge(task)}
                  </div>

                  {/* Lime green progress line matching screenshot */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#c2f300] h-full rounded-full transition-all duration-300"
                      style={{
                        width: task.status === 'Completed' ? '100%' : '58%',
                      }}
                    />
                  </div>

                  {/* 4-Column Meta Grid matching screenshot */}
                  <div className="grid grid-cols-4 gap-2 pt-1 text-[11px] border-b border-slate-100 pb-3">
                    <div>
                      <p className="text-slate-400 font-medium text-[10px]">Client</p>
                      <p className="font-bold text-slate-900 truncate mt-0.5">
                        {task.clientFamily || 'Family Trust'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium text-[10px]">Due Date</p>
                      <p className="font-bold text-slate-900 truncate mt-0.5">
                        {task.deadline}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium text-[10px]">Value</p>
                      <p className="font-bold text-slate-900 truncate mt-0.5">
                        {task.value || '₹125 Cr'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium text-[10px]">Priority</p>
                      <p className="font-bold text-slate-900 truncate mt-0.5">
                        {task.priority}
                      </p>
                    </div>
                  </div>

                  {/* Assigned Banker / Courier Row matching screenshot */}
                  {primaryMember && (
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={primaryMember.employeeName} size="md" />
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                            Lead Advisor
                          </p>
                          <p className="text-xs font-bold text-slate-900">
                            {primaryMember.employeeName}
                          </p>
                        </div>
                      </div>

                      {/* Circular Action Buttons matching screenshot */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            openReminderModal('whatsapp', task, primaryMember.employeeName)
                          }
                          className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-400 flex items-center justify-center text-slate-600 hover:text-emerald-700 transition-colors"
                          title="WhatsApp Reminder"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            openReminderModal('email', task, primaryMember.employeeName)
                          }
                          className="w-8 h-8 rounded-full border border-slate-200 hover:border-slate-400 flex items-center justify-center text-slate-600 hover:text-blue-700 transition-colors"
                          title="Email Reminder"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Accordion link: Delivery history and details */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleOpenDetails(task)}
                      className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 group"
                    >
                      <span>Mandate scope and team details</span>
                      <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            }

            /* COLLAPSED ROW ITEM matching Screenshot 2 */
            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {routeTitle}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                    Mandate {task.mandateId || `#${task.id.replace('task-', 'CA-')}`}
                  </p>
                </div>
                {getStatusBadge(task)}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
