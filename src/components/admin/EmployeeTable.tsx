import React, { useState, useMemo } from 'react';
import { useEMS } from '../../context/EMSContext';
import { Employee } from '../../types';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { 
  Search, 
  UserPlus, 
  Trash2, 
  Eye, 
  Filter, 
  ShieldCheck, 
  Briefcase, 
  UserCheck,
  Building2,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface EmployeeTableProps {
  onSelectEmployee: (emp: Employee) => void;
  onOpenAddModal: () => void;
  onOpenRemoveDialog: (emp: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  onSelectEmployee,
  onOpenAddModal,
  onOpenRemoveDialog,
}) => {
  const { employees, tasks } = useEMS();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Compute task statistics per employee
  const employeeStats = useMemo(() => {
    const stats: Record<string, { active: number; completed: number; total: number }> = {};

    employees.forEach((emp) => {
      const assigned = tasks.filter((t) =>
        t.assignedMembers.some((m) => m.employeeId === emp.id)
      );
      const active = assigned.filter((t) => t.status === 'Active').length;
      const completed = assigned.filter((t) => t.status === 'Completed').length;
      stats[emp.id] = {
        active,
        completed,
        total: assigned.length,
      };
    });

    return stats;
  }, [employees, tasks]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (roleFilter !== 'ALL' && emp.role !== roleFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          emp.name.toLowerCase().includes(q) ||
          emp.username.toLowerCase().includes(q) ||
          emp.department.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [employees, roleFilter, search]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5 sm:p-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Employee Directory</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 tabular-nums">
            {filteredEmployees.length}
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none w-44 sm:w-56"
            />
          </div>

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Banker">Bankers</option>
            <option value="Analyst">Analysts</option>
          </select>

          {/* Add Employee Button */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Employee Name</th>
              <th className="py-3 px-3">Username</th>
              <th className="py-3 px-3">Role</th>
              <th className="py-3 px-3 text-center">Active Tasks</th>
              <th className="py-3 px-3 text-center">Completed</th>
              <th className="py-3 px-3 text-center">Total Assigned</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.map((emp) => {
              const stats = employeeStats[emp.id] || { active: 0, completed: 0, total: 0 };
              const isLead = emp.role === 'Team Lead';

              return (
                <tr
                  key={emp.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onSelectEmployee(emp)}
                >
                  {/* Name and avatar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={emp.name} size="sm" avatarBg={emp.avatarBg} />
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {emp.name}
                        </p>
                        <p className="text-[11px] text-slate-500">{emp.department}</p>
                      </div>
                    </div>
                  </td>

                  {/* Username */}
                  <td className="py-3 px-3 font-mono text-slate-600">
                    @{emp.username}
                  </td>

                  {/* Role */}
                  <td className="py-3 px-3">
                    <Badge role={emp.role} size="sm" />
                  </td>

                  {/* Active Tasks */}
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-flex items-center justify-center font-bold px-2 py-0.5 rounded-full text-xs ${
                      stats.active > 0 ? 'bg-sky-50 text-sky-700' : 'text-slate-400'
                    }`}>
                      {stats.active}
                    </span>
                  </td>

                  {/* Completed Tasks */}
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-flex items-center justify-center font-bold px-2 py-0.5 rounded-full text-xs ${
                      stats.completed > 0 ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400'
                    }`}>
                      {stats.completed}
                    </span>
                  </td>

                  {/* Total Tasks */}
                  <td className="py-3 px-3 text-center font-bold text-slate-700">
                    {stats.total}
                  </td>

                  {/* Account Status */}
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {emp.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectEmployee(emp)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-[#094897] hover:bg-blue-50 border border-slate-200 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                        title="View Employee Profile & AI Analysis"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span className="hidden sm:inline">Tasks & AI</span>
                      </button>

                      {!isLead && (
                        <button
                          type="button"
                          onClick={() => onOpenRemoveDialog(emp)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Remove Employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
