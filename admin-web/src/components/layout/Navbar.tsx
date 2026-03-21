import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Menu, Sun, Moon, LogOut } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, profile, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b-2 border-slate-900/10 bg-surface/95 backdrop-blur-md dark:border-white/10 dark:bg-surface-dark/95">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center gap-4">
            {user && (
              <button
                type="button"
                onClick={onMenuClick}
                className="rounded-lg p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
                aria-label="Toggle sidebar"
              >
                <Menu className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              </button>
            )}
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <span className="flex h-8 w-8 items-center justify-center bg-primary-600 text-[10px] font-bold text-white group-hover:bg-primary-700 transition-colors">
                EZ
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Admin
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <>
                <div className="hidden items-center gap-3 md:flex">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {profile?.full_name || user.email}
                  </span>
                  <span className="rounded-full border border-primary-200/90 bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-900 dark:border-primary-700 dark:bg-primary-950 dark:text-primary-100">
                    {profile?.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="cursor-pointer rounded-lg bg-slate-100 p-2 text-slate-700 transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  aria-label="Toggle theme"
                >
                  {isDark ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="cursor-pointer rounded-lg bg-slate-100 p-2 text-slate-700 transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
