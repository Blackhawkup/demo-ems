import React from 'react';
import { useEMS } from '../../context/EMSContext';
import { Badge } from '../common/Badge';
import { 
  CheckCircle2, 
  Mail, 
  X, 
  Calendar, 
  Users, 
  Check, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const TaskCreatedEmailModal: React.FC = () => {
  const { emailNotificationModalData, closeEmailNotificationModal } = useEMS();

  if (!emailNotificationModalData) return null;

  const { task, assignedNames } = emailNotificationModalData;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-200 border border-blue-400/30">
              <Mail className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">Task Notification Sent</h3>
                <span className="text-[10px] font-bold bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded border border-emerald-400/30">
                  Simulated
                </span>
              </div>
              <p className="text-xs text-blue-200/80">Automated Enterprise Broadcast Engine</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeEmailNotificationModal}
            className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Success Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-950">Email Dispatch Confirmed</p>
              <p className="text-xs text-emerald-800 leading-relaxed mt-0.5">
                Task notification emails have been sent successfully to all assigned employees.
              </p>
            </div>
          </div>

          {/* Task Details Display (Required by Prompt) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Dispatched Task Summary
            </h4>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
              <div>
                <span className="text-slate-500 font-medium">Task Name:</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{task.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-200">
                <div>
                  <span className="text-slate-500 font-medium">Priority:</span>
                  <div className="mt-1">
                    <Badge priority={task.priority} size="sm" />
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 font-medium">Deadline:</span>
                  <p className="font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(task.deadline)}</span>
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-medium">Assigned Employees ({assignedNames.length}):</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {assignedNames.map((name) => (
                    <span
                      key={name}
                      className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-semibold text-xs"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={closeEmailNotificationModal}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
