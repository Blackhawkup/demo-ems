import React, { useState } from 'react';
import { useEMS } from '../../context/EMSContext';
import { 
  X, 
  MessageSquare, 
  Mail, 
  CheckCircle2, 
  Send, 
  Clock, 
  Calendar,
  Smartphone,
  Copy
} from 'lucide-react';

export const ReminderModal: React.FC = () => {
  const { reminderModalData, closeReminderModal, showToast } = useEMS();
  const [copied, setCopied] = useState(false);

  if (!reminderModalData) return null;

  const { type, task, targetEmployeeName } = reminderModalData;
  const isWhatsApp = type === 'whatsapp';

  const formattedDeadline = (() => {
    try {
      const d = new Date(task.deadline);
      return d.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return task.deadline;
    }
  })();

  const whatsAppText = `Hi ${targetEmployeeName}, this is a reminder regarding the task '${task.title}'. Please ensure your assigned work is completed before the deadline: ${formattedDeadline}.`;

  const emailSubject = `Task Reminder – ${task.title}`;
  const emailBody = `Hi ${targetEmployeeName},

This is a friendly reminder regarding your assigned task: ${task.title}.

Deadline: ${formattedDeadline}

Please update your progress and ensure completion within the stipulated timeline.

Regards,
EMS Team`;

  const handleSimulateDelivery = () => {
    showToast('Reminder sent successfully!', 'success');
    closeReminderModal();
  };

  const handleCopy = () => {
    const textToCopy = isWhatsApp ? whatsAppText : `${emailSubject}\n\n${emailBody}`;
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`p-4 sm:p-5 flex items-center justify-between border-b ${
          isWhatsApp 
            ? 'bg-emerald-50/80 border-emerald-100 text-emerald-950' 
            : 'bg-blue-50/80 border-blue-100 text-blue-950'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl text-white ${isWhatsApp ? 'bg-emerald-600' : 'bg-blue-600'}`}>
              {isWhatsApp ? <Smartphone className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">
                  {isWhatsApp ? 'WhatsApp Reminder Simulation' : 'Email Reminder Simulation'}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 border border-slate-200">
                  Demo Sandbox
                </span>
              </div>
              <p className="text-xs text-slate-600">Simulating automated notification dispatch</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeReminderModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recipient</p>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">{targetEmployeeName}</span>
              <span className="text-slate-500 font-mono">
                {isWhatsApp ? '+91 ••••• •••••' : `${targetEmployeeName.toLowerCase().replace(/\s+/g, '.')}@clientassociates.com`}
              </span>
            </div>
          </div>

          {/* Message preview container */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {isWhatsApp ? 'Simulated WhatsApp Message' : 'Simulated Email Payload'}
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-medium"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>

            {isWhatsApp ? (
              /* WhatsApp Chat Bubble Style */
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs text-slate-800 leading-relaxed font-sans relative">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 mb-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Client Associates EMS Bot</span>
                </div>
                <p className="whitespace-pre-wrap">{whatsAppText}</p>
                <div className="text-right mt-2 text-[10px] text-slate-400">12:30 PM • Sent</div>
              </div>
            ) : (
              /* Email Style */
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="border-b border-slate-200 pb-2">
                  <p className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Subject: </span>
                    {emailSubject}
                  </p>
                </div>
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-mono text-[11px]">
                  {emailBody}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={closeReminderModal}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSimulateDelivery}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-all ${
              isWhatsApp 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Confirm & Send Reminder</span>
          </button>
        </div>
      </div>
    </div>
  );
};
