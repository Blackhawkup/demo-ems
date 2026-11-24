import React, { useState, useEffect } from 'react';
import { useEMS } from '../../context/EMSContext';
import { Priority } from '../../types';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { 
  X, 
  Check, 
  Plus, 
  AlertCircle
} from 'lucide-react';

export const CreateTaskModal: React.FC = () => {
  const { 
    currentUser, 
    employees, 
    isCreateTaskModalOpen, 
    setIsCreateTaskModalOpen,
    createTask 
  } = useEMS();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('High');
  // Default deadline: 7 days from now formatted YYYY-MM-DD
  const [deadline, setDeadline] = useState(() => {
    const d = new Date(Date.now() + 7 * 86400000);
    return d.toISOString().split('T')[0];
  });
  // Auto-selected employee IDs (creator auto-included)
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>(() => {
    return currentUser ? [currentUser.id] : [];
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCreateTaskModalOpen(false);
    };
    if (isCreateTaskModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCreateTaskModalOpen, setIsCreateTaskModalOpen]);

  if (!isCreateTaskModalOpen || !currentUser) return null;

  const toggleEmployee = (empId: string) => {
    // Creator is always auto-included, but let's allow toggling others
    if (empId === currentUser.id) return; // Keep creator locked in

    setSelectedEmployeeIds((prev) =>
      prev.includes(empId) ? prev.filter((id) => id !== empId) : [...prev, empId]
    );
  };

  const selectAllRole = (role: 'Analyst' | 'Banker') => {
    const matchingIds = employees.filter((e) => e.role === role).map((e) => e.id);
    setSelectedEmployeeIds((prev) => {
      const set = new Set([...prev, ...matchingIds]);
      return Array.from(set);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task Title is required.');
      return;
    }

    try {
      createTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        deadline,
        assignedEmployeeIds: selectedEmployeeIds,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('High');
      setSelectedEmployeeIds([currentUser.id]);
      setError(null);
      setIsCreateTaskModalOpen(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to create task');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCreateTaskModalOpen(false);
      }}
    >
      <div 
        className="bg-white rounded-3xl max-w-xl w-full border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight [text-wrap:balance]">Create New Task</h2>
              <p className="text-xs text-slate-500">
                Logged in as <span className="font-semibold text-slate-700">{currentUser.name}</span> ({currentUser.role})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateTaskModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Task Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Task Title <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Prepare quarterly financial analysis report"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* 2. Task Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Task Description <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline deliverables, research scope, reference spreadsheets or requirements..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Priority & Deadline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 3. Priority */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Priority
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Critical', 'High', 'Medium', 'Low'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-colors duration-150 active:scale-[0.98] ${
                      priority === p
                        ? p === 'Critical'
                          ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-2xs font-bold'
                          : p === 'High'
                          ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-2xs font-bold'
                          : p === 'Medium'
                          ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-2xs font-bold'
                          : 'bg-slate-100 border-slate-300 text-slate-700 shadow-2xs font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Deadline */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Deadline <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400">Target completion date</p>
            </div>
          </div>

          {/* 5. Assign Team Members (Multi-select dropdown) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Assign Team Members (<span className="tabular-nums">{selectedEmployeeIds.length}</span> selected)
              </label>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => selectAllRole('Analyst')}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  + Analysts
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => selectAllRole('Banker')}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  + Bankers
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 [text-wrap:pretty]">
              Select one or multiple colleagues. Task creator is auto-included.
            </p>

            <div className="max-h-52 overflow-y-auto border border-slate-200 rounded-2xl divide-y divide-slate-100 bg-white">
              {employees.map((emp) => {
                const isSelected = selectedEmployeeIds.includes(emp.id);
                const isCreator = emp.id === currentUser.id;

                return (
                  <div
                    key={emp.id}
                    onClick={() => toggleEmployee(emp.id)}
                    className={`p-3 flex items-center justify-between cursor-pointer transition-colors duration-150 ${
                      isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={emp.name} size="sm" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900">{emp.name}</p>
                          {isCreator && (
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">
                              Creator (You)
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">{emp.department}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge role={emp.role} size="sm" />
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Submit inside modal */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateTaskModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors duration-150 active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-[0.98]"
            >
              Create Task & Notify Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
