import React from 'react';
import { Task } from '../../types';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  Briefcase,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AnalyticsGraphicsProps {
  tasks: Task[];
  title?: string;
  subtitle?: string;
}

export const AnalyticsGraphics: React.FC<AnalyticsGraphicsProps> = ({
  tasks,
  title = 'Mandate Execution & Priority Pipeline',
  subtitle = 'Real-time allocation and delivery metrics across advisory portfolios',
}) => {
  const total = tasks.length;
  const criticalCount = tasks.filter((t) => t.priority === 'Critical').length;
  const highCount = tasks.filter((t) => t.priority === 'High').length;
  const mediumCount = tasks.filter((t) => t.priority === 'Medium').length;
  const lowCount = tasks.filter((t) => t.priority === 'Low').length;

  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const activeCount = tasks.filter((t) => t.status === 'Active').length;
  const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  // Percentage calculations
  const critPct = total > 0 ? Math.round((criticalCount / total) * 100) : 0;
  const highPct = total > 0 ? Math.round((highCount / total) * 100) : 0;
  const medPct = total > 0 ? Math.round((mediumCount / total) * 100) : 0;
  const lowPct = total > 0 ? Math.max(0, 100 - (critPct + highPct + medPct)) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#094897]" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-medium">Completion Rate:</span>
            <span className="font-extrabold text-[#094897]">{completionRate}%</span>
          </div>
        </div>
      </div>

      {/* Grid of 2 clean graphic modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Graphic 1: Priority Spectrum Segmented Bar (7 cols) */}
        <div className="lg:col-span-7 bg-slate-50/70 rounded-xl p-3.5 border border-slate-200/70 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              Priority Workload Allocation
            </span>
            <span className="text-[11px] text-slate-400 font-mono">{total} Total Mandates</span>
          </div>

          {/* Visual Segmented Progress Bar */}
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-200 p-0.5 gap-0.5">
            {critPct > 0 && (
              <div 
                style={{ width: `${critPct}%` }} 
                className="bg-rose-500 h-full rounded-sm transition-all duration-500"
                title={`Critical: ${criticalCount} (${critPct}%)`}
              />
            )}
            {highPct > 0 && (
              <div 
                style={{ width: `${highPct}%` }} 
                className="bg-amber-500 h-full rounded-sm transition-all duration-500"
                title={`High: ${highCount} (${highPct}%)`}
              />
            )}
            {medPct > 0 && (
              <div 
                style={{ width: `${medPct}%` }} 
                className="bg-[#094897] h-full rounded-sm transition-all duration-500"
                title={`Medium: ${mediumCount} (${medPct}%)`}
              />
            )}
            {lowPct > 0 && (
              <div 
                style={{ width: `${lowPct}%` }} 
                className="bg-slate-400 h-full rounded-sm transition-all duration-500"
                title={`Low: ${lowCount} (${lowPct}%)`}
              />
            )}
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-4 gap-2 pt-1 text-center text-[11px]">
            <div className="p-1.5 rounded-lg bg-white border border-slate-200/60">
              <span className="inline-block w-2 h-2 rounded-full bg-rose-500 mr-1" />
              <span className="font-bold text-slate-800">{criticalCount}</span>
              <span className="text-[10px] text-slate-400 block">Critical</span>
            </div>
            <div className="p-1.5 rounded-lg bg-white border border-slate-200/60">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1" />
              <span className="font-bold text-slate-800">{highCount}</span>
              <span className="text-[10px] text-slate-400 block">High</span>
            </div>
            <div className="p-1.5 rounded-lg bg-white border border-slate-200/60">
              <span className="inline-block w-2 h-2 rounded-full bg-[#094897] mr-1" />
              <span className="font-bold text-slate-800">{mediumCount}</span>
              <span className="text-[10px] text-slate-400 block">Medium</span>
            </div>
            <div className="p-1.5 rounded-lg bg-white border border-slate-200/60">
              <span className="inline-block w-2 h-2 rounded-full bg-slate-400 mr-1" />
              <span className="font-bold text-slate-800">{lowCount}</span>
              <span className="text-[10px] text-slate-400 block">Low</span>
            </div>
          </div>
        </div>

        {/* Graphic 2: Mandate Execution Stage Flow (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50/70 rounded-xl p-3.5 border border-slate-200/70 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              Workflow Stages
            </span>
            <span className="text-[11px] text-emerald-600 font-bold">{activeCount} In Execution</span>
          </div>

          <div className="space-y-1.5 py-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-600 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#094897]" />
                Diligence & Structuring
              </span>
              <span className="font-bold text-slate-800">4 Mandates</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#094897] h-full rounded-full w-[65%]" />
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-600 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#13A28F]" />
                Compliance & Delivery
              </span>
              <span className="font-bold text-slate-800">{completedCount} Delivered</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#13A28F] h-full rounded-full w-[80%]" />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-right">
            Client Associates Wealth Advisory Operations
          </p>
        </div>

      </div>
    </div>
  );
};