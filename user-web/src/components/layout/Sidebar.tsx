import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  User,
  X,
  ShoppingCart,
  ShoppingBag,
  Stethoscope,
  CalendarClock,
  BriefcaseMedical,
  ClipboardCheck,
  Activity,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useShopStore } from "../../stores/shop.store";
import { useChatStore } from "../../stores/chat.store";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { profile, user } = useAuth();
  const messageCount = useChatStore((state) => state.unreadCount);
  const fetchUnreadCount = useChatStore((state) => state.fetchUnreadCount);
  const myOrders = useShopStore((state) => state.myOrders);
  const fetchOrders = useShopStore((state) => state.fetchOrders);
  const orderCount = myOrders.filter(
    (order) => order.order_status === "pending",
  ).length;

  const menuItems = [
    {
      path: "/dashboard",
      icon: Home,
      label: "Dashboard",
      roles: ["patient", "doctor", "pharmacy", "admin"],
    },
    { path: "/shop", icon: ShoppingBag, label: "Shop", roles: ["patient"] },
    { path: "/orders", icon: ShoppingCart, label: "Orders", roles: ["patient"] },
    {
      path: "/manage/products",
      icon: ShoppingBag,
      label: "Manage Medicines",
      roles: ["pharmacy", "admin"],
    },
    {
      path: "/manage/orders",
      icon: ShoppingCart,
      label: "Manage Orders",
      roles: ["pharmacy", "admin"],
    },
    {
      path: "/doctors",
      icon: Stethoscope,
      label: "Doctors",
      roles: ["patient"],
    },
    {
      path: "/health-tracker",
      icon: Activity,
      label: "Health Tracker",
      roles: ["patient"],
    },
    {
      path: "/bookings",
      icon: CalendarClock,
      label: "Bookings",
      roles: ["patient"],
    },
    {
      path: "/doctor/services",
      icon: BriefcaseMedical,
      label: "My Services",
      roles: ["doctor", "admin"],
    },
    {
      path: "/doctor/bookings",
      icon: ClipboardCheck,
      label: "Doctor Bookings",
      roles: ["doctor", "admin"],
    },
    {
      path: "/doctor/patients",
      icon: User,
      label: "Patient Readings",
      roles: ["doctor", "admin"],
    },
    {
      path: "/profile",
      icon: User,
      label: "Profile",
      roles: ["patient", "doctor", "pharmacy", "admin"],
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !profile || item.roles.includes(profile.role),
  );

  useEffect(() => {
    if (user && profile?.role === "patient") {
      fetchOrders("my");
    }
  }, [user, profile?.role, fetchOrders]);

  useEffect(() => {
    if (!user || profile?.role !== "patient") {
      return;
    }

    fetchUnreadCount();
  }, [user, profile?.role, fetchUnreadCount]);

  const handleItemClick = () => {
    // Only close the drawer on mobile widths to avoid desktop route flicker.
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`fixed lg:sticky top-16 lg:top-0 left-0 z-40 h-[calc(100vh-4rem)] lg:h-full transition-transform duration-200 lg:transition-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full w-64 overflow-y-auto border-r-2 border-slate-900/10 bg-white/98 px-3 py-2 backdrop-blur-md scrollbar-hide dark:border-white/10 dark:bg-[#12101c]/96">
          <div className="flex justify-end px-2 py-2 lg:hidden">
            <button
              onClick={onClose}
              className="cursor-pointer lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <nav className="space-y-1 pt-1 lg:pt-3">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleItemClick}
                  className={`flex items-center gap-3 border-l-2 px-3 py-3 text-[15px] transition-all duration-200 ${
                    isActive
                      ? "border-primary-600 bg-primary-600 font-semibold text-white shadow-[4px_4px_0_0_rgba(124,58,237,0.22)] dark:shadow-[4px_4px_0_0_rgba(167,139,250,0.2)]"
                      : "border-transparent text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="font-medium">{item.label}</span>
                  {item.path === "/orders" && orderCount > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center bg-secondary px-1 text-[10px] font-bold text-white">
                      {orderCount}
                    </span>
                  )}
                  {item.path === "/chat" && messageCount > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center bg-primary-500 px-1 text-[10px] font-bold text-white">
                      {messageCount}
                    </span>
                  )}
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
