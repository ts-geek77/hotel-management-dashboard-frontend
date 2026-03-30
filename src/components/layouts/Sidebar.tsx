"use client";

import {
  BedDouble,
  Building2,
  CalendarCheck,
  ChevronLeft,
  LayoutDashboard,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/dashboards/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboards/rooms", label: "Rooms", icon: BedDouble },
  { href: "/dashboards/guests", label: "Guests", icon: Users },
  { href: "/dashboards/bookings", label: "Bookings", icon: CalendarCheck },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="relative hidden lg:flex flex-col justify-between h-screen sticky top-0 text-white transition-all duration-300 ease-in-out shrink-0"
      style={{
        backgroundColor: "var(--sidebar-bg)",
        width: collapsed ? "72px" : "256px",
      }}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-white shadow-md hover:bg-slate-700 transition-colors cursor-pointer"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft
          size={14}
          className="transition-transform duration-300"
          style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      <div className="overflow-hidden">
        <div className="flex gap-2 px-[22px] pt-8 items-center text-xl font-bold mb-8">
          <Building2 size={22} className="shrink-0" style={{ color: "var(--brand)" }} />
          <span
            className="tracking-tight whitespace-nowrap transition-all duration-300 overflow-hidden"
            style={{
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
              maxWidth: collapsed ? 0 : "200px",
            }}
          >
            HotelAdmin
          </span>
        </div>
        <div className="flex flex-col px-3 gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboards/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  collapsed ? "px-[17px] py-3 justify-center" : "px-4 py-3"
                } ${
                  isActive
                    ? "font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
                style={
                  isActive
                    ? { backgroundColor: "var(--sidebar-active-bg)", color: "var(--brand)" }
                    : {}
                }
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "var(--sidebar-active-bg)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.backgroundColor = "";
                }}
              >
                <item.icon
                  size={20}
                  className="shrink-0"
                  style={isActive ? { color: "var(--brand)" } : {}}
                />
                <span
                  className="text-[15px] whitespace-nowrap overflow-hidden transition-all duration-300"
                  style={{
                    opacity: collapsed ? 0 : 1,
                    maxWidth: collapsed ? 0 : "200px",
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div
        className="px-5 py-5 border-t border-slate-800/50 overflow-hidden transition-all duration-300"
      >
        <p
          className="text-slate-500 text-xs font-medium whitespace-nowrap transition-all duration-300"
          style={{ opacity: collapsed ? 0 : 1 }}
        >
          © 2026 Hotel Management
        </p>
      </div>
    </div>
  );
};

export default Sidebar;