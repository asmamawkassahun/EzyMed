import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { useShopStore } from "../../stores/shop.store";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const cartItems = useShopStore((state) => state.cartItems);
  const fetchCart = useShopStore((state) => state.fetchCart);

  const isDoctorUnderOnboarding =
    profile?.role === "doctor" &&
    ["pending", "rejected"].includes(
      (profile?.role_status || "").toLowerCase(),
    );
  const hideAppChrome =
    isDoctorUnderOnboarding ||
    location.pathname === "/doctor/complete-profile" ||
    location.pathname === "/doctor/pending-approval";

  useEffect(() => {
    if (!user || profile?.role !== "patient") {
      return;
    }

    fetchCart();
  }, [user, profile?.role, fetchCart]);

  const showFloatingCart =
    user &&
    profile?.role === "patient" &&
    cartItems.length > 0 &&
    location.pathname !== "/cart";

  return (
    <div className="relative h-screen overflow-hidden bg-surface dark:bg-surface-dark">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-100 dark:opacity-75 bg-[linear-gradient(165deg,rgba(124,58,237,0.06)_0%,transparent_42%),linear-gradient(215deg,rgba(244,63,94,0.04)_0%,transparent_36%)] dark:bg-[linear-gradient(165deg,rgba(124,58,237,0.11)_0%,transparent_48%),linear-gradient(215deg,rgba(244,63,94,0.07)_0%,transparent_40%)]"
        aria-hidden
      />
      {!hideAppChrome && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        </div>
      )}

      <div className={`relative z-10 ${hideAppChrome ? "pt-0" : "pt-16"} h-full`}>
        <div className="flex h-full overflow-hidden">
          {user && !hideAppChrome && (
            <Sidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          )}
          <main
            id="app-main-scroll"
            className="flex-1 overflow-y-auto p-5 sm:p-6 lg:px-10 lg:py-9"
          >
            {children}
          </main>

          {showFloatingCart && (
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-3 bg-primary-600 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[6px_6px_0_0_rgba(124,58,237,0.25)] transition duration-200 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_rgba(124,58,237,0.2)] dark:shadow-[6px_6px_0_0_rgba(167,139,250,0.2)]"
            >
              <span className="relative inline-flex items-center">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {cartItems.length > 99 ? "99+" : cartItems.length}
                </span>
              </span>
              Go to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
