import React, { useState, useEffect } from 'react';
import { useEMS } from '../../context/EMSContext';
import { Employee, Task } from '../../types';
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
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Building2,
  ChevronRight,
  Zap,
  RotateCcw
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
  const [taskViewTab, setTaskViewTab] = useState<'all' | 'active' | 'completed'>('all');
  const [showAiAnalysis, setShowAiAnalysis] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Reset local state when selected employee changes
  useEffect(() => {
    setShowAiAnalysis(false);
    setIsGeneratingAi(false);
    setTaskViewTab('all');
  }, [employee?.id]);

  // Close on Escape key press
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

  // Safe task list traversal with defensive null fallbacks
  const safeTasks = tasks || [];
  const assignedTasks = safeTasks.filter((t) =>
    (t?.assignedMembers || []).some((m) => m?.employeeId === employee.id)
  );

  const activeTasks = assignedTasks.filter((t) => t?.status === 'Active');
  const completedTasks = assignedTasks.filter((t) => t?.status === 'Completed');
  const criticalTasks = activeTasks.filter((t) => t?.priority === 'Critical' || t?.priority === 'High');

  const completionRate = assignedTasks.length > 0
    ? Math.round((completedTasks.length / assignedTasks.length) * 100)
    : 0;

  // Calculate total AUM exposure under this employee's active mandates
  const aumValues = activeTasks
    .map((t) => {
      const match = t?.value?.match(/₹(\d+)/);
      return match ? parseInt(match[1], 10) : 50;
    });
  const totalAumCr = aumValues.length > 0 ? aumValues.reduce((a, b) => a + b, 0) : 125;

  const handleOpenTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailModalOpen(true);
  };

  const handleTriggerAiAnalysis = () => {
    if (showAiAnalysis) {
      setShowAiAnalysis(false);
      return;
    }
    setIsGeneratingAi(true);
    setTimeout(() => {
      setIsGeneratingAi(false);
      setShowAiAnalysis(true);
    }, 350);
  };

  const displayedTasks = 
    taskViewTab === 'active' 
      ? activeTasks 
      : taskViewTab === 'completed' 
      ? completedTasks 
      : assignedTasks;

  // AI-generated summary content customized for this employee
  const getAiSummary = () => {
    const isBanker = employee.role === 'Banker';
    const isLead = employee.role === 'Team Lead';

    const workloadStatus = activeTasks.length >= 3
      ? 'High Advisory Load'
      : activeTasks.length > 0
      ? 'Optimal Advisory Capacity'
      : 'Available for Immediate Assignment';

    const efficiencyRating = completionRate >= 60 ? 'Exceptional (Top 10%)' : 'Strong & Consistent';

    return {
      workloadStatus,
      efficiencyRating,
      turnaroundTime: '2.8 business days',
      activeAum: `₹${totalAumCr} Cr across ${activeTasks.length} active mandates`,
      coreStrengths: isLead
        ? 'Firm governance, multi-family office mandate coordination, and risk management'
        : isBanker
        ? 'HNW client relationship management, syndicated credit structuring, and private wealth asset allocation'
        : 'Financial modeling, regulatory disclosure audit, portfolio rebalancing, and quantitative valuation',
      recommendation: activeTasks.length >= 3
        ? `Ensure support on ${criticalTasks[0]?.title || 'active mandates'} to avoid delivery bottlenecks before upcoming regulatory deadlines.`
        : `Prime candidate for lead advisory role on upcoming Q4 high-net-worth portfolio allocations.`,
    };
  };

  const aiData = getAiSummary();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >

        
        {/* Header Profile Banner in Client Associates Corporate Navy */}
        <div className="p-6 bg-gradient-to-r from-[#031a34] via-[#094897] to-[#011226] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <Avatar name={employee.name} size="lg" avatarBg={employee.avatarBg} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold tracking-tight text-white">{employee.name}</h2>
                <Badge role={employee.role} size="sm" />
              </div>
              <p className="text-xs text-sky-200 mt-0.5">{employee.department} • Client Associates</p>
              <p className="text-xs text-slate-300 font-mono mt-0.5">@{employee.username}</p>
            </div>
          </div>

          {/* Action Row in Header */}
          <div className="flex items-center gap-2 relative z-10 self-end sm:self-auto">
            {/* AI Analysis Button */}
            <button
              type="button"
              onClick={handleTriggerAiAnalysis}
              disabled={isGeneratingAi}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-[0.98] cursor-pointer ${
                showAiAnalysis
                  ? 'bg-amber-400 text-slate-900 hover:bg-amber-300'
                  : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
              }`}
              title="Click to generate AI performance and workload analysis"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isGeneratingAi ? 'Analyzing...' : showAiAnalysis ? 'Hide AI Analysis' : 'AI Analysis'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Ambient luminous glow */}
          <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-[#13A28F]/20 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* AI ANALYSIS BRIEF SUMMARY CARD (Appears on click!) */}
          {showAiAnalysis && (
            <div className="bg-gradient-to-br from-slate-900 to-[#031a34] rounded-2xl p-4 sm:p-5 text-white border border-blue-900/40 shadow-md space-y-3.5 animate-fade-slide-up">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-amber-400/20 text-amber-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      AI Advisory Intelligence Summary
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Generated for {employee.name} • Internal Evaluation
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {aiData.workloadStatus}
                </span>
              </div>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Efficiency Rating</span>
                  <span className="font-bold text-white mt-0.5 block">{aiData.efficiencyRating}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Avg Milestone Velocity</span>
                  <span className="font-bold text-[#38bdf8] mt-0.5 block">{aiData.turnaroundTime}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Active Exposure</span>
                  <span className="font-bold text-amber-300 mt-0.5 block truncate">{aiData.activeAum}</span>
                </div>
              </div>

              {/* Brief Executive Summary Text */}
              <div className="space-y-2 text-xs pt-1 text-slate-200 leading-relaxed border-t border-white/10">
                <div>
                  <span className="font-semibold text-slate-400 uppercase text-[10px] tracking-wider block">
                    Core Strengths & Specialization:
                  </span>
                  <p className="text-slate-200 mt-0.5">
                    {aiData.coreStrengths}.
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-slate-400 uppercase text-[10px] tracking-wider block">
                    Leadership Workload Recommendation:
                  </span>
                  <p className="text-sky-200 mt-0.5 font-medium">
                    {aiData.recommendation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4 Summary Cards: Total Tasks, Active, Completed, Completion Rate */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div 
              onClick={() => setTaskViewTab('all')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                taskViewTab === 'all'
                  ? 'bg-blue-50/70 border-blue-200 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-slate-500 font-medium">Total Tasks</p>
                <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-xl font-extrabold text-slate-900 mt-1">{assignedTasks.length}</p>
              <p className="text-[10px] text-slate-500">All assignments</p>
            </div>

            <div 
              onClick={() => setTaskViewTab('active')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                taskViewTab === 'active'
                  ? 'bg-sky-50 border-sky-200 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-slate-500 font-medium">Active Tasks</p>
                <Clock className="w-3.5 h-3.5 text-sky-600" />
              </div>
              <p className="text-xl font-extrabold text-[#094897] mt-1">{activeTasks.length}</p>
              <p className="text-[10px] text-sky-600 font-medium">In execution</p>
            </div>

            <div 
              onClick={() => setTaskViewTab('completed')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                taskViewTab === 'completed'
                  ? 'bg-emerald-50 border-emerald-200 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-slate-500 font-medium">Completed</p>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-xl font-extrabold text-emerald-600 mt-1">{completedTasks.length}</p>
              <p className="text-[10px] text-emerald-600 font-medium">Delivered</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-slate-500 font-medium">Completion Rate</p>
                <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-xl font-extrabold text-slate-900 mt-1">
                {assignedTasks.length > 0 ? `${completionRate}%` : 'N/A'}
              </p>
              <p className="text-[10px] text-slate-500">Performance Index</p>
            </div>
          </div>

          {/* Contact Details Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
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
              <span>Registered on {employee.createdAt}</span>
            </div>
          </div>

          {/* FILTER PILLS FOR TASKS (All, Active, Completed) */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTaskViewTab('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  taskViewTab === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Tasks ({assignedTasks.length})
              </button>
              <button
                type="button"
                onClick={() => setTaskViewTab('active')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  taskViewTab === 'active'
                    ? 'bg-white text-[#094897] shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active Tasks ({activeTasks.length})
              </button>
              <button
                type="button"
                onClick={() => setTaskViewTab('completed')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  taskViewTab === 'completed'
                    ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed Tasks ({completedTasks.length})
              </button>
            </div>

            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              Click any task to inspect scope
            </span>
          </div>

          {/* TASKS LIST */}
          <div className="space-y-2.5">
            {displayedTasks.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No {taskViewTab === 'all' ? '' : taskViewTab} tasks assigned to this employee.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                {displayedTasks.map((t) => {
                  const myAssignment = (t?.assignedMembers || []).find((m) => m?.employeeId === employee.id);

                  return (
                    <div
                      key={t.id}
                      onClick={() => handleOpenTask(t)}
                      className="p-3.5 sm:p-4 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge priority={t.priority} size="sm" />
                          <Badge status={t.status} size="sm" />
                          {t.mandateId && (
                            <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {t.mandateId}
                            </span>
                          )}
                          {t.category && (
                            <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                              • {t.category}
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#094897] transition-colors truncate">
                          {t.title}
                        </h4>

                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span>Due {t.deadline}</span>
                          <span>•</span>
                          <span>Individual Status: <strong className="text-slate-800">{myAssignment?.status || 'Pending'}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <span className="text-xs font-semibold text-[#094897] group-hover:underline flex items-center gap-1">
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTriggerAiAnalysis}
            className="text-xs font-semibold text-[#094897] hover:underline flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{showAiAnalysis ? 'Hide Analysis' : 'Show AI Performance Analysis'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-2xs"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};