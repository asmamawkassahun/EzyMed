import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "../../contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface dark:bg-surface-dark relative">
      <div
        className="pointer-events-none fixed inset-0 opacity-100 dark:opacity-70 bg-[linear-gradient(165deg,rgba(124,58,237,0.05)_0%,transparent_40%),linear-gradient(215deg,rgba(244,63,94,0.04)_0%,transparent_35%)] dark:bg-[linear-gradient(165deg,rgba(124,58,237,0.1)_0%,transparent_45%),linear-gradient(215deg,rgba(244,63,94,0.06)_0%,transparent_38%)]"
        aria-hidden
      />
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="relative z-10 flex min-w-0 pt-16">
        {user && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
        <main
          className={`w-full min-w-0 flex-1 p-4 sm:p-6 lg:p-8 ${user ? "lg:ml-64" : ""}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
