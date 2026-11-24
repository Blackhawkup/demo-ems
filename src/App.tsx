import React from 'react';
import { EMSProvider, useEMS } from './context/EMSContext';
import { LoginPage } from './components/auth/LoginPage';
import { Layout } from './components/layout/Layout';
import { EmployeeDashboard } from './components/dashboard/EmployeeDashboard';
import { TeamLeadDashboard } from './components/dashboard/TeamLeadDashboard';
import { MyTasksView } from './components/dashboard/MyTasksView';
import { TaskManagementView } from './components/admin/TaskManagementView';
import { ProfileView } from './components/dashboard/ProfileView';

// Global Modals
import { CreateTaskModal } from './components/tasks/CreateTaskModal';
import { TaskDetailModal } from './components/tasks/TaskDetailModal';
import { ReminderModal } from './components/tasks/ReminderModal';
import { TaskCreatedEmailModal } from './components/tasks/TaskCreatedEmailModal';
import { WhatsAppReplication } from './components/whatsapp/WhatsAppReplication';
import { Toast } from './components/common/Toast';

const EMSApp: React.FC = () => {
  const { currentUser, activeView } = useEMS();

  // If not logged in, show login page
  if (!currentUser) {
    return (
      <>
        <LoginPage />
        <WhatsAppReplication />
        <Toast />
      </>
    );
  }

  // Dynamic Page Title
  const getPageTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return currentUser.role === 'Team Lead'
          ? 'Team Lead Administrative Dashboard'
          : `${currentUser.role} Workspace Dashboard`;
      case 'my-tasks':
        return 'My Assigned Tasks';
      case 'employee-management':
        return 'Employee Directory & Access Management';
      case 'task-management':
        return 'Organization Task Oversight';
      case 'profile':
        return 'Profile & Account Security';
      default:
        return 'Employee Management System';
    }
  };

  // Render content based on activeView
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return currentUser.role === 'Team Lead' ? (
          <TeamLeadDashboard />
        ) : (
          <EmployeeDashboard />
        );
      case 'my-tasks':
        return <MyTasksView />;
      case 'employee-management':
        return <TeamLeadDashboard />;
      case 'task-management':
        return <TaskManagementView />;
      case 'profile':
        return <ProfileView />;
      default:
        return currentUser.role === 'Team Lead' ? (
          <TeamLeadDashboard />
        ) : (
          <EmployeeDashboard />
        );
    }
  };

  return (
    <Layout pageTitle={getPageTitle()}>
      {renderContent()}

      {/* Global Interactive Modals */}
      <CreateTaskModal />
      <TaskDetailModal />
      <ReminderModal />
      <TaskCreatedEmailModal />
      <WhatsAppReplication />
      <Toast />
    </Layout>
  );
};

export default function App() {
  return (
    <EMSProvider>
      <EMSApp />
    </EMSProvider>
  );
}
