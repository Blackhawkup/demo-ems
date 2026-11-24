export type Role = 'Banker' | 'Analyst' | 'Team Lead';

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export type TaskStatus = 'Active' | 'Completed';

export type MemberTaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Employee {
  id: string;
  name: string;
  username: string;
  password: string;
  role: Role;
  email: string;
  department: string;
  phone?: string;
  status: 'Active' | 'On Leave';
  createdAt: string;
  avatarBg?: string;
}

export interface MemberAssignment {
  employeeId: string;
  employeeName: string;
  role: Role;
  status: MemberTaskStatus;
  updatedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  deadline: string; // YYYY-MM-DD
  createdBy: {
    id: string;
    name: string;
    role: Role;
  };
  assignedMembers: MemberAssignment[];
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
  category?: string;

  // Real Client Associates mandate extensions
  mandateId?: string;
  clientFamily?: string;
  originHub?: string;
  targetHub?: string;
  value?: string;
  stageTag?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'task_assigned' | 'reminder' | 'task_completed' | 'system';
}

export interface WhatsAppMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  step?: number;
}

export type ActiveView = 
  | 'dashboard' 
  | 'my-tasks' 
  | 'task-management' 
  | 'employee-management' 
  | 'create-task' 
  | 'profile' 
  | 'whatsapp-demo';
