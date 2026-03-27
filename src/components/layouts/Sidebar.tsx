"use client";

import {
  BedDouble,
  Building2,
  CalendarCheck,
  LayoutDashboard,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/dashboards/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboards/rooms", label: "Rooms", icon: BedDouble },
  { href: "/dashboards/guests", label: "Guests", icon: Users },
  { href: "/dashboards/bookings", label: "Bookings", icon: CalendarCheck },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-between w-64 h-screen text-white" style={{ backgroundColor: "var(--sidebar-bg)" }}>
      <div>
        <div className="flex gap-2 px-6 pt-8 items-center text-xl font-bold mb-8">
          <Building2 size={24} style={{ color: "var(--brand)" }} />
          <p className="tracking-tight">HotelAdmin</p>
        </div>

        <div className="flex flex-col px-3 gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboards/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
                style={isActive ? { backgroundColor: "var(--sidebar-active-bg)", color: "var(--brand)" } : {}}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--sidebar-active-bg)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "";
                }}
              >
                <item.icon size={20} style={isActive ? { color: "var(--brand)" } : {}} />
                <span className="text-[15px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="px-6 py-6 border-t border-slate-800/50">
        <p className="text-slate-500 text-xs font-medium">© 2026 Hotel Management</p>
      </div>
    </div>
  );
};

export default Sidebar;