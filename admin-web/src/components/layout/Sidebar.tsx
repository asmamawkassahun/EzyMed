import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, X, ClipboardList, Store } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/users", icon: Users, label: "Users" },
    { path: "/providers", icon: ClipboardList, label: "Provider Approvals" },
    { path: "/pharmacies", icon: Store, label: "Pharmacy Approvals" },
  ];

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}

      <aside
        className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full w-64 overflow-y-auto border-r-2 border-slate-900/10 bg-white/95 px-3 py-6 backdrop-blur-md scrollbar-hide dark:border-white/10 dark:bg-[#12101c]/95">
          <div className="mb-6 flex items-center justify-end px-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </button>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 border-l-2 px-4 py-3 transition-all ${
                    isActive
                      ? "border-primary-600 bg-primary-600 font-semibold text-white shadow-[4px_4px_0_0_rgba(124,58,237,0.25)]"
                      : "border-transparent text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
