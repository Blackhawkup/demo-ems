import React, { useState, useEffect } from 'react';
import { useEMS, isTaskOverdue } from '../../context/EMSContext';
import { MemberTaskStatus, Priority } from '../../types';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { 
  X, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Mail, 
  Check, 
  Trash2
} from 'lucide-react';

export const TaskDetailModal: React.FC = () => {
  const { 
    currentUser, 
    selectedTask, 
    isTaskDetailModalOpen, 
    setIsTaskDetailModalOpen,
    updateMemberStatus,
    toggleTaskStatus,
    changeTaskPriority,
    openReminderModal,
    deleteTask
  } = useEMS();

  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsTaskDetailModalOpen(false);
    };
    if (isTaskDetailModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isTaskDetailModalOpen, setIsTaskDetailModalOpen]);

  if (!isTaskDetailModalOpen || !selectedTask) return null;

  const isTeamLead = currentUser?.role === 'Team Lead';
  const isCreator = currentUser?.id === selectedTask.createdBy?.id;
  const overdue = isTaskOverdue(selectedTask);

  // Check current user's assignment
  const myAssignment = currentUser 
    ? (selectedTask.assignedMembers || []).find((m) => m?.employeeId === currentUser.id)
    : null;

  const totalMembers = selectedTask.assignedMembers?.length || 0;
  const completedCount = (selectedTask.assignedMembers || []).filter((m) => m?.status === 'Completed').length;
  const progressPercent = totalMembers > 0 ? Math.round((completedCount / totalMembers) * 100) : 0;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const handleToggleMyStatus = () => {
    if (!currentUser || !myAssignment) return;
    const nextStatus: MemberTaskStatus = 
      myAssignment.status === 'Completed' 
        ? 'In Progress' 
        : myAssignment.status === 'In Progress' 
        ? 'Completed' 
        : 'In Progress';
    updateMemberStatus(selectedTask.id, currentUser.id, nextStatus);
  };

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsTaskDetailModalOpen(false);
      }}
    >
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge priority={selectedTask.priority} />
              <Badge status={selectedTask.status} />
              {overdue && <Badge status="Overdue" />}
              {selectedTask.category && (
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200/60">
                  {selectedTask.category}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug [text-wrap:balance]">
              {selectedTask.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsTaskDetailModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Task Description & Objectives
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap [text-wrap:pretty]">
              {selectedTask.description}
            </div>
          </div>

          {/* Key Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="text-[11px] text-slate-500 font-medium">Task Creator</p>
              <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                {selectedTask.createdBy.name}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">{selectedTask.createdBy.role}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="text-[11px] text-slate-500 font-medium">Target Deadline</p>
              <p className={`text-xs font-bold truncate mt-0.5 tabular-nums ${overdue ? 'text-rose-600' : 'text-slate-900'}`}>
                {formatDate(selectedTask.deadline)}
              </p>
              <p className="text-[10px] text-slate-500">{overdue ? 'Past Deadline' : 'Upcoming'}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="text-[11px] text-slate-500 font-medium">Creation Date</p>
              <p className="text-xs font-bold text-slate-900 truncate mt-0.5 tabular-nums">
                {formatDate(selectedTask.createdAt)}
              </p>
              <p className="text-[10px] text-slate-500">System Logged</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="text-[11px] text-slate-500 font-medium">Progress</p>
              <p className="text-xs font-bold text-slate-900 truncate mt-0.5 tabular-nums">
                {completedCount}/{totalMembers} Members
              </p>
              <p className="text-[10px] text-emerald-600 font-bold tabular-nums">{progressPercent}% complete</p>
            </div>
          </div>

          {/* My Part Status Action Banner (If assigned) */}
          {myAssignment && (
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-blue-950">Your Individual Assignment Status</p>
                <div className="flex items-center gap-2">
                  <Badge status={myAssignment.status} size="sm" />
                  <span className="text-xs text-slate-600 [text-wrap:pretty]">
                    {myAssignment.status === 'Completed'
                      ? 'You have marked your assigned part as done.'
                      : myAssignment.status === 'In Progress'
                      ? 'Your assignment is currently in progress.'
                      : 'You have not yet started your part.'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleMyStatus}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-colors duration-150 active:scale-[0.98] ${
                    myAssignment.status === 'Completed'
                      ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {myAssignment.status === 'Completed'
                    ? 'Reopen My Part'
                    : 'Mark My Part Completed'}
                </button>
              </div>
            </div>
          )}

          {/* Assigned Team Members Table / List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Assigned Team Members & Individual Statuses ({selectedTask.assignedMembers.length})
              </h4>
              <span className="text-xs text-slate-500 font-medium tabular-nums">
                {completedCount} of {totalMembers} complete
              </span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
              {selectedTask.assignedMembers.map((member) => {
                const isMe = currentUser?.id === member.employeeId;
                return (
                  <div
                    key={member.employeeId}
                    className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors duration-150"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={member.employeeName} size="sm" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900">{member.employeeName}</p>
                          {isMe && (
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">{member.role}</p>
                      </div>
                    </div>

                    {/* Member status badge & Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                      <Badge status={member.status} size="sm" />

                      {/* Admin or Member Status Selector */}
                      {(isTeamLead || isCreator || isMe) && (
                        <select
                          value={member.status}
                          onChange={(e) =>
                            updateMemberStatus(
                              selectedTask.id,
                              member.employeeId,
                              e.target.value as MemberTaskStatus
                            )
                          }
                          className="text-[11px] bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-semibold focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      )}

                      {/* Send Reminders to this member */}
                      {member.status !== 'Completed' && (
                        <div className="flex items-center gap-1 pl-1">
                          <button
                            type="button"
                            onClick={() =>
                              openReminderModal('whatsapp', selectedTask, member.employeeName)
                            }
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-emerald-200/80 active:scale-95 transition-colors"
                            title={`Send WhatsApp Reminder to ${member.employeeName}`}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              openReminderModal('email', selectedTask, member.employeeName)
                            }
                            className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 border border-blue-200/80 active:scale-95 transition-colors"
                            title={`Send Email Reminder to ${member.employeeName}`}
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Direct Reminders */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() =>
                openReminderModal(
                  'whatsapp',
                  selectedTask,
                  selectedTask.assignedMembers.find((m) => m.status !== 'Completed')?.employeeName ||
                    selectedTask.assignedMembers[0].employeeName
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors active:scale-[0.98]"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Send WhatsApp Reminder</span>
            </button>

            <button
              type="button"
              onClick={() =>
                openReminderModal(
                  'email',
                  selectedTask,
                  selectedTask.assignedMembers.find((m) => m.status !== 'Completed')?.employeeName ||
                    selectedTask.assignedMembers[0].employeeName
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-800 bg-blue-50/80 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors active:scale-[0.98]"
            >
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>Send Email Reminder</span>
            </button>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Admin Priority / Delete Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isTeamLead && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Priority:</span>
                <select
                  value={selectedTask.priority}
                  onChange={(e) => changeTaskPriority(selectedTask.id, e.target.value as Priority)}
                  className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                {!confirmDelete ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors active:scale-95"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => deleteTask(selectedTask.id)}
                      className="px-2.5 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg active:scale-95"
                    >
                      Confirm Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-2 py-1 text-xs text-slate-500 hover:bg-slate-200 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mark Entire Task Completed / Close */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {(isTeamLead || isCreator || completedCount === totalMembers) && (
              <button
                type="button"
                onClick={() => toggleTaskStatus(selectedTask.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors duration-150 shadow-xs active:scale-[0.98] ${
                  selectedTask.status === 'Completed'
                    ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>
                  {selectedTask.status === 'Completed'
                    ? 'Reopen Entire Task'
                    : 'Mark Entire Task Completed'}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsTaskDetailModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors duration-150 active:scale-[0.98]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
