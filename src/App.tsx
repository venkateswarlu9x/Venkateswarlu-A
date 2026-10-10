import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar.js';
import { Sidebar } from './components/Sidebar.js';
import { ToastContainer, ToastMessage } from './components/Toast.js';
import { ConfirmModal } from './components/ConfirmModal.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { EmployeesPage } from './pages/EmployeesPage.js';
import { EmployeeFormPage } from './pages/EmployeeFormPage.js';
import { EmployeeDetailPage } from './pages/EmployeeDetailPage.js';
import { DepartmentsPage } from './pages/DepartmentsPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { apiService } from './services/api.js';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // Helper to add toast notification
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const newToast: ToastMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Reset database sample records
  const handleResetConfirm = async () => {
    setIsResetting(true);
    try {
      await apiService.resetData();
      addToast(
        'success',
        'Database successfully reset to initial 12 sample employees and 6 departments!'
      );
      setIsResetConfirmOpen(false);
      // reload location to refresh current page state
      window.location.reload();
    } catch (err: any) {
      addToast('error', err.message || 'Failed to reset demo data');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
        {/* Top Navbar */}
        <Navbar
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
          onResetData={() => setIsResetConfirmOpen(true)}
          isResetting={isResetting}
        />

        {/* Body Layout: Sidebar + Main Content */}
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Responsive Sidebar */}
          <Sidebar
            isMobileOpen={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
            onResetData={() => setIsResetConfirmOpen(true)}
          />

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 pb-16">
            <Routes>
              <Route path="/" element={<DashboardPage onNotify={addToast} />} />
              <Route path="/employees" element={<EmployeesPage onNotify={addToast} />} />
              <Route path="/employees/add" element={<EmployeeFormPage onNotify={addToast} />} />
              <Route path="/employees/edit/:id" element={<EmployeeFormPage onNotify={addToast} />} />
              <Route path="/employees/:id" element={<EmployeeDetailPage onNotify={addToast} />} />
              <Route path="/departments" element={<DepartmentsPage onNotify={addToast} />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        {/* Global Toast Notifications */}
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

        {/* Reset Database Confirmation Modal */}
        <ConfirmModal
          isOpen={isResetConfirmOpen}
          title="Reset Demo Records"
          message={`Are you sure you want to reset the database to the default seed state?\n\nThis will restore the original 12 employees and 6 departments, discarding any newly added test entries.`}
          confirmLabel="Reset Data"
          cancelLabel="Cancel"
          isDestructive={false}
          isLoading={isResetting}
          onConfirm={handleResetConfirm}
          onClose={() => setIsResetConfirmOpen(false)}
        />
      </div>
    </BrowserRouter>
  );
}
