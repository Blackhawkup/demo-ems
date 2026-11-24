import React, { useEffect } from 'react';
import { useEMS } from '../../context/EMSContext';
import { Employee } from '../../types';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';

interface RemoveEmployeeDialogProps {
  employee: Employee | null;
  onClose: () => void;
}

export const RemoveEmployeeDialog: React.FC<RemoveEmployeeDialogProps> = ({
  employee,
  onClose,
}) => {
  const { removeEmployee } = useEMS();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (employee) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [employee, onClose]);

  if (!employee) return null;

  const handleConfirm = () => {
    removeEmployee(employee.id);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white rounded-3xl max-w-md w-full border border-slate-200/90 shadow-2xl overflow-hidden p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">Remove Employee Account</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to remove this employee from the directory? Their active and completed task assignments will be preserved gracefully as inactive references.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={employee.name} size="sm" avatarBg={employee.avatarBg} />
            <div>
              <p className="text-xs font-bold text-slate-900">{employee.name}</p>
              <p className="text-[11px] text-slate-500 font-mono">@{employee.username}</p>
            </div>
          </div>
          <Badge role={employee.role} size="sm" />
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Confirm Removal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
