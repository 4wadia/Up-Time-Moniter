import React, { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { OverviewPage } from './pages/Overview';
import { MonitorsList } from './pages/MonitorsList';
import { MonitorDetail } from './pages/MonitorDetail';
import { SettingsPage } from './pages/Settings';
import { NotificationsPage } from './pages/Notifications';
import { AccountPage } from './pages/Account';
import { LogoutPage } from './pages/Logout';
import { LoginPage } from './pages/Login';
import { SignupPage } from './pages/Signup';
import { PageView } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('dashboard');
  const { user, isLoading, isAuthenticated } = useAuth();

  // Route Protection & Redirection Effect
  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      // Logic: If logged in and on auth pages, go to dashboard
      if (currentPage === 'signin' || currentPage === 'signup') {
        setCurrentPage('dashboard');
      }
    } else {
      // Logic: If not logged in and on protected pages, go to signin
      // Allowed public pages: signin, signup
      if (currentPage !== 'signin' && currentPage !== 'signup') {
        setCurrentPage('signin');
      }
    }
  }, [isAuthenticated, currentPage, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  // Handle Standalone Pages (No Sidebar)
  if (currentPage === 'signin') {
    return <LoginPage onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'signup') {
    return <SignupPage onNavigate={setCurrentPage} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <OverviewPage />;
      case 'monitors':
        return <MonitorsList onNavigate={setCurrentPage} />;
      case 'monitor-detail':
        return <MonitorDetail />;
      case 'settings':
        return <SettingsPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'account':
        return <AccountPage />;
      case 'logout':
        return <LogoutPage />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <button onClick={() => setCurrentPage('dashboard')} className="mt-4 text-primary hover:underline">Go Home</button>
          </div>
        );
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage} user={user}>
      {renderPage()}
    </Layout>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;