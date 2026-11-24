import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Employee, 
  Task, 
  Priority, 
  MemberTaskStatus, 
  NotificationItem, 
  ActiveView,
  MemberAssignment
} from '../types';
import { SEED_EMPLOYEES } from '../data/seedEmployees';
import { SEED_TASKS } from '../data/seedTasks';

const STORAGE_KEYS = {
  EMPLOYEES: 'ems_employees_v1',
  TASKS: 'ems_tasks_v1',
  CURRENT_USER: 'ems_current_user_v1',
  NOTIFICATIONS: 'ems_notifications_v1',
};

// Priority weight for sorting: Critical (1) > High (2) > Medium (3) > Low (4)
export const PRIORITY_WEIGHT: Record<Priority, number> = {
  Critical: 1,
  High: 2,
  Medium: 3,
  Low: 4,
};

export const sortTasksByPriority = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    const pDiff = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
    if (pDiff !== 0) return pDiff;
    // secondary sort by deadline
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });
};

export const isTaskOverdue = (task: Task): boolean => {
  if (task.status === 'Completed') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDeadline = new Date(task.deadline);
  taskDeadline.setHours(0, 0, 0, 0);
  return taskDeadline.getTime() < today.getTime();
};

interface ReminderModalData {
  type: 'whatsapp' | 'email';
  task: Task;
  targetEmployeeName: string;
}

interface EmailNotificationModalData {
  task: Task;
  assignedNames: string[];
}

interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'error';
}

interface EMSContextType {
  currentUser: Employee | null;
  employees: Employee[];
  tasks: Task[];
  notifications: NotificationItem[];
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  toast: ToastMessage | null;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;

  // Auth
  login: (username: string, password?: string) => boolean;
  logout: () => void;
  switchUser: (username: string) => void;

  // Tasks
  createTask: (data: {
    title: string;
    description: string;
    priority: Priority;
    deadline: string;
    assignedEmployeeIds: string[];
  }) => Task;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  updateMemberStatus: (taskId: string, employeeId: string, status: MemberTaskStatus) => void;
  toggleTaskStatus: (taskId: string) => void;
  changeTaskPriority: (taskId: string, priority: Priority) => void;

  // Employees (Team Lead)
  addEmployee: (data: { name: string; username: string; password?: string; role: 'Banker' | 'Analyst'; department?: string }) => { success: boolean; error?: string };
  removeEmployee: (employeeId: string) => { success: boolean; error?: string };

  // Modals & Active Selections
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  selectedEmployee: Employee | null;
  setSelectedEmployee: (emp: Employee | null) => void;

  isCreateTaskModalOpen: boolean;
  setIsCreateTaskModalOpen: (open: boolean) => void;

  isTaskDetailModalOpen: boolean;
  setIsTaskDetailModalOpen: (open: boolean) => void;

  reminderModalData: ReminderModalData | null;
  openReminderModal: (type: 'whatsapp' | 'email', task: Task, targetEmployeeName: string) => void;
  closeReminderModal: () => void;

  emailNotificationModalData: EmailNotificationModalData | null;
  closeEmailNotificationModal: () => void;

  isWhatsAppDemoOpen: boolean;
  setIsWhatsAppDemoOpen: (open: boolean) => void;

  // Utilities
  resetToDefaultData: () => void;
}

const EMSContext = createContext<EMSContextType | undefined>(undefined);

export const EMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or fall back to seeds
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      return stored ? JSON.parse(stored) : SEED_EMPLOYEES;
    } catch {
      return SEED_EMPLOYEES;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
      return stored ? JSON.parse(stored) : SEED_TASKS;
    } catch {
      return SEED_TASKS;
    }
  });

  const [currentUser, setCurrentUser] = useState<Employee | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch {
      return null;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (stored) return JSON.parse(stored);
      return [
        {
          id: 'notif-1',
          title: 'System Initialized',
          message: 'Welcome to Client Associates EMS. Real-time employee task management active.',
          timestamp: 'Just now',
          read: false,
          type: 'system',
        },
        {
          id: 'notif-2',
          title: 'Upcoming Audit Deadline',
          message: 'FY27 Q3 High Net-Worth Portfolio Rebalancing task requires your review.',
          timestamp: '1 hour ago',
          read: false,
          type: 'reminder',
        }
      ];
    } catch {
      return [];
    }
  });

  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Modals
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
  const [reminderModalData, setReminderModalData] = useState<ReminderModalData | null>(null);
  const [emailNotificationModalData, setEmailNotificationModalData] = useState<EmailNotificationModalData | null>(null);
  const [isWhatsAppDemoOpen, setIsWhatsAppDemoOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
    } catch (e) {
      console.error('Failed to sync employees to localStorage', e);
    }
  }, [employees]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to sync tasks to localStorage', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.error('Failed to sync current user to localStorage', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to sync notifications to localStorage', e);
    }
  }, [notifications]);

  // Toast helper
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, text, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  };

  // Auth handlers
  const login = (username: string, password = '1234'): boolean => {
    const found = employees.find(
      (e) => e.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (found) {
      // In demo mode, check password (defaults to 1234 or employee.password)
      if (found.password === password || password === '1234') {
        setCurrentUser(found);
        setActiveView('dashboard');
        showToast(`Welcome back, ${found.name}! Logged in as ${found.role}.`, 'success');
        return true;
      }
    }
    showToast('Invalid username or password. Default demo password is 1234.', 'error');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('dashboard');
    setSelectedTask(null);
    setSelectedEmployee(null);
    setIsTaskDetailModalOpen(false);
    setIsCreateTaskModalOpen(false);
    showToast('Logged out successfully.', 'info');
  };

  const switchUser = (username: string) => {
    const found = employees.find(
      (e) => e.username.toLowerCase() === username.trim().toLowerCase()
    );
    if (found) {
      setCurrentUser(found);
      setActiveView('dashboard');
      showToast(`Switched account to ${found.name} (${found.role})`, 'info');
    }
  };

  // Task Handlers
  const createTask = (data: {
    title: string;
    description: string;
    priority: Priority;
    deadline: string;
    assignedEmployeeIds: string[];
  }): Task => {
    if (!currentUser) throw new Error('Must be logged in to create task');

    // Auto-include task creator in assigned members
    const memberIdSet = new Set(data.assignedEmployeeIds);
    memberIdSet.add(currentUser.id);

    const assignedMembers: MemberAssignment[] = Array.from(memberIdSet)
      .map((empId) => {
        const emp = employees.find((e) => e.id === empId);
        if (!emp) return null;
        return {
          employeeId: emp.id,
          employeeName: emp.name,
          role: emp.role,
          status: 'Pending' as MemberTaskStatus,
        };
      })
      .filter((m): m is MemberAssignment => m !== null);

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: data.title.trim(),
      description: data.description.trim() || 'No detailed description provided.',
      priority: data.priority,
      deadline: data.deadline || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      createdBy: {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
      },
      assignedMembers,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      category: 'General',
    };

    setTasks((prev) => [newTask, ...prev]);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Task Created',
      message: `"${newTask.title}" assigned to ${assignedMembers.length} team members.`,
      timestamp: 'Just now',
      read: false,
      type: 'task_assigned',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Open simulated Email Notification modal as required by Section 5
    setEmailNotificationModalData({
      task: newTask,
      assignedNames: assignedMembers.map((m) => m.employeeName),
    });

    showToast('Task created successfully!', 'success');
    return newTask;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = { ...t, ...updates };
          if (selectedTask?.id === taskId) {
            setSelectedTask(updated);
          }
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
      setIsTaskDetailModalOpen(false);
    }
    showToast('Task removed successfully.', 'info');
  };

  const updateMemberStatus = (taskId: string, employeeId: string, status: MemberTaskStatus) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;

        const updatedMembers = task.assignedMembers.map((m) => {
          if (m.employeeId === employeeId) {
            return {
              ...m,
              status,
              updatedAt: status === 'Completed' ? new Date().toISOString().split('T')[0] : m.updatedAt,
            };
          }
          return m;
        });

        // If all members are completed, mark entire task as completed
        const allCompleted = updatedMembers.length > 0 && updatedMembers.every((m) => m.status === 'Completed');
        const newOverallStatus = allCompleted ? 'Completed' : task.status;

        const updatedTask: Task = {
          ...task,
          assignedMembers: updatedMembers,
          status: newOverallStatus,
          completedAt: allCompleted ? new Date().toISOString().split('T')[0] : task.completedAt,
        };

        if (selectedTask?.id === taskId) {
          setSelectedTask(updatedTask);
        }

        return updatedTask;
      })
    );

    showToast(`Status updated to "${status}".`, 'success');
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const newStatus = task.status === 'Completed' ? 'Active' : 'Completed';
        const updatedTask: Task = {
          ...task,
          status: newStatus,
          completedAt: newStatus === 'Completed' ? new Date().toISOString().split('T')[0] : undefined,
          // If marked completed, mark all individual statuses as completed
          assignedMembers: newStatus === 'Completed' 
            ? task.assignedMembers.map(m => ({ ...m, status: 'Completed' }))
            : task.assignedMembers,
        };
        if (selectedTask?.id === taskId) {
          setSelectedTask(updatedTask);
        }
        return updatedTask;
      })
    );
    showToast('Task status toggled.', 'info');
  };

  const changeTaskPriority = (taskId: string, priority: Priority) => {
    updateTask(taskId, { priority });
    showToast(`Priority updated to ${priority}.`, 'success');
  };

  // Employee management (Team Lead)
  const addEmployee = (data: {
    name: string;
    username: string;
    password?: string;
    role: 'Banker' | 'Analyst';
    department?: string;
  }): { success: boolean; error?: string } => {
    const trimmedUsername = data.username.trim().toLowerCase();
    if (!trimmedUsername) {
      return { success: false, error: 'Username is required.' };
    }
    if (!data.name.trim()) {
      return { success: false, error: 'Full name is required.' };
    }

    const exists = employees.some((e) => e.username.toLowerCase() === trimmedUsername);
    if (exists) {
      return { success: false, error: `Username "${trimmedUsername}" is already taken.` };
    }

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name: data.name.trim(),
      username: trimmedUsername,
      password: data.password || '1234',
      role: data.role,
      email: `${trimmedUsername}@clientassociates.com`,
      department: data.department || (data.role === 'Banker' ? 'Private Banking' : 'Equity Research'),
      phone: '+91 98' + Math.floor(10000000 + Math.random() * 90000000),
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      avatarBg: data.role === 'Banker' ? 'bg-sky-600' : 'bg-emerald-600',
    };

    setEmployees((prev) => [...prev, newEmp]);
    showToast(`Employee ${newEmp.name} (${newEmp.role}) added successfully! Can log in immediately.`, 'success');
    return { success: true };
  };

  const removeEmployee = (employeeId: string): { success: boolean; error?: string } => {
    const target = employees.find((e) => e.id === employeeId);
    if (!target) return { success: false, error: 'Employee not found.' };

    // Prevent team lead from deleting own account
    if (target.role === 'Team Lead' || target.username === 'lead') {
      return { success: false, error: 'Team Lead account cannot be deleted.' };
    }

    // Gracefully handle existing task assignments: keep historical assignment record or tag "(Inactive)"
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        assignedMembers: task.assignedMembers.map((m) =>
          m.employeeId === employeeId
            ? { ...m, employeeName: `${m.employeeName} (Inactive)` }
            : m
        ),
      }))
    );

    setEmployees((prev) => prev.filter((e) => e.id !== employeeId));
    if (selectedEmployee?.id === employeeId) {
      setSelectedEmployee(null);
    }

    showToast(`Employee ${target.name} removed from directory.`, 'info');
    return { success: true };
  };

  // Reminders
  const openReminderModal = (type: 'whatsapp' | 'email', task: Task, targetEmployeeName: string) => {
    setReminderModalData({
      type,
      task,
      targetEmployeeName,
    });
  };

  const closeReminderModal = () => {
    setReminderModalData(null);
  };

  const closeEmailNotificationModal = () => {
    setEmailNotificationModalData(null);
  };

  // Reset to default seeds
  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    setEmployees(SEED_EMPLOYEES);
    setTasks(SEED_TASKS);
    setCurrentUser(null);
    setNotifications([
      {
        id: 'notif-1',
        title: 'System Initialized',
        message: 'Welcome to Client Associates EMS. Demo dataset reset to initial state.',
        timestamp: 'Just now',
        read: false,
        type: 'system',
      },
    ]);
    setSelectedTask(null);
    setSelectedEmployee(null);
    setIsCreateTaskModalOpen(false);
    setIsTaskDetailModalOpen(false);
    setReminderModalData(null);
    setEmailNotificationModalData(null);
    showToast('Data reset to default demonstration state.', 'info');
  };

  return (
    <EMSContext.Provider
      value={{
        currentUser,
        employees,
        tasks,
        notifications,
        activeView,
        setActiveView,
        toast,
        showToast,
        login,
        logout,
        switchUser,
        createTask,
        updateTask,
        deleteTask,
        updateMemberStatus,
        toggleTaskStatus,
        changeTaskPriority,
        addEmployee,
        removeEmployee,
        selectedTask,
        setSelectedTask,
        selectedEmployee,
        setSelectedEmployee,
        isCreateTaskModalOpen,
        setIsCreateTaskModalOpen,
        isTaskDetailModalOpen,
        setIsTaskDetailModalOpen,
        reminderModalData,
        openReminderModal,
        closeReminderModal,
        emailNotificationModalData,
        closeEmailNotificationModal,
        isWhatsAppDemoOpen,
        setIsWhatsAppDemoOpen,
        resetToDefaultData,
      }}
    >
      {children}
    </EMSContext.Provider>
  );
};

export const useEMS = () => {
  const context = useContext(EMSContext);
  if (!context) {
    throw new Error('useEMS must be used within an EMSProvider');
  }
  return context;
};
