"use client";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BedDouble,
  BedSingle,
  CalendarCheck,
  Users,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useDashboard } from "@/hooks";
import { BOOKING_BADGE_STYLES, BOOKING_LABELS, DASHBOARD_NAV_ITEMS } from "@/constants";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading: boolean;
}

const StatCard = ({ title, value, icon, loading }: StatCardProps) => (
  <Card className="border-none shadow-sm overflow-hidden group hover:shadow-md hover:bg-[var(--surface-subtle)] transition-all duration-300 p-5 ring-0 cursor-pointer" style={{ backgroundColor: "var(--surface)" }}>
    <div className="transition-transform duration-300 group-hover:scale-[1.03]">
      <div className="flex items-start justify-between">
        <p className="text-sm tracking-tight font-bold group-hover:text-[var(--primary)] transition-colors" style={{ color: "var(--text-secondary)" }}>{title}</p>
        <div className="group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        {loading ? (
          <Skeleton className="h-9 w-16" />
        ) : (
          <p className="text-[28px] font-bold tracking-tight leading-none group-hover:text-[var(--primary)] transition-colors" style={{ color: "var(--text-primary)" }}>{value}</p>
        )}
      </div>
    </div>
  </Card>
);

interface NavCardProps {
  title: string;
  subtitle: string;
  href: string;
}

const NavCard = ({ title, subtitle, href }: NavCardProps) => (
  <Link href={href} className="block">
    <Card className="border-none shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all duration-300 cursor-pointer group h-full ring-0" style={{ backgroundColor: "var(--surface)" }}>
      <CardContent className="flex flex-col justify-center h-full p-4 px-5">
        <div className="flex items-center justify-between w-full h-full">
          <div className="flex items-center gap-2">
            <div className="space-y-1">
              <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{title}</h3>
              <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{subtitle}</p>
            </div>
          </div>
          <div className="h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-300 group-hover:bg-[var(--brand-light)]" style={{ backgroundColor: "var(--surface-muted)" }}>
            <ArrowRight className="h-4 w-4 transition-colors group-hover:text-[var(--brand)]" style={{ color: "var(--text-muted)" }} />
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

const ROOM_STATUS_STYLES: Record<string, string> = {
  Available: "bg-emerald-500/15 text-emerald-600 border-emerald-200",
  Booked: "bg-blue-500/15 text-blue-600 border-blue-200",
  Maintenance: "bg-amber-500/15 text-amber-600 border-amber-200",
};

const toDateInput = (dateStr: string) => dateStr?.slice(0, 10) ?? "";

const DashboardPage = () => {
  const {
    stats,
    revenueTrends,
    recentBookings,
    roomStatus,
    loading,
  } = useDashboard();

  const aggregatedRevenue = revenueTrends.reduce<Record<string, number>>((acc, item) => {
    acc[item.date] = (acc[item.date] ?? 0) + item.revenue;
    return acc;
  }, {});
  const revenueChartData = Object.entries(aggregatedRevenue).map(([date, revenue]) => ({ date, revenue }));
  const maxRevenue = Math.max(...revenueChartData.map((d) => d.revenue), 1);

  return (
    <div className="space-y-4 p-4 min-h-screen" style={{ backgroundColor: "var(--surface-subtle)" }}>
      <div className="flex flex-col lg:hidden mb-2">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Dashboard Overview</h1>
        <p className="text-sm text-[var(--text-muted)]">Real-time status of your hotel operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Rooms"
          value={stats?.totalRooms ?? "—"}
          icon={<BedDouble size={24} className="text-blue-500" />}
          loading={loading}
        />
        <StatCard
          title="Available Rooms"
          value={stats?.availableRooms ?? "—"}
          icon={<BedSingle size={24} className="text-emerald-500" />}
          loading={loading}
        />
        <StatCard
          title="Active Bookings"
          value={stats?.activeBookings ?? "—"}
          icon={<CalendarCheck size={24} className="text-purple-500" />}
          loading={loading}
        />
        <StatCard
          title="Checked-In Guests"
          value={stats?.checkedInGuests ?? "—"}
          icon={<Users size={24} className="text-amber-500" />}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {DASHBOARD_NAV_ITEMS.map((item) => (
          <NavCard
            key={item.href}
            title={item.title}
            subtitle={item.subtitle}
            href={item.href}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <Card className="border-none shadow-sm lg:col-span-2" style={{ backgroundColor: "var(--surface)" }}>
          <CardHeader className="flex flex-row items-center gap-2 border-b px-6 py-4" style={{ borderColor: "var(--border)" }}>
            <TrendingUp size={18} className="text-purple-500" />
            <CardTitle className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-end gap-2 h-40">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} className="flex-1 rounded" style={{ height: `${30 + i * 12}px` }} />
                ))}
              </div>
            ) : revenueChartData.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: "var(--text-muted)" }}>No revenue data yet</p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-end gap-2 h-40">
                  {revenueChartData.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 h-full group">
                      <div
                        className="w-full rounded-t-sm bg-purple-500 group-hover:bg-purple-400 transition-all duration-300 relative"
                        style={{ height: `${Math.max(8, (d.revenue / maxRevenue) * 100)}%` }}
                      >
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                          ${d.revenue}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  {revenueChartData.map((d, i) => (
                    <div key={i} className="flex-1 text-center">
                      <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{d.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm" style={{ backgroundColor: "var(--surface)" }}>
          <CardHeader className="flex flex-row items-center gap-2 border-b px-6 py-4" style={{ borderColor: "var(--border)" }}>
            <BedDouble size={18} className="text-blue-500" />
            <CardTitle className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Room Status</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-9 w-full rounded" />)}
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto max-h-52">
                {roomStatus.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 rounded-lg"
                    style={{ backgroundColor: "var(--surface-subtle)" }}
                  >
                    <div>
                      <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>#{r.roomNumber}</span>
                      <span className="ml-2 text-xs" style={{ color: "var(--text-muted)" }}>{r.roomType}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-0.5 rounded-full font-medium border ${ROOM_STATUS_STYLES[r.status]}`}
                    >
                      {r.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm" style={{ backgroundColor: "var(--surface)" }}>
        <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4" style={{ borderColor: "var(--border)" }}>
          <CardTitle className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Recent Bookings</CardTitle>
          <Link href="/dashboards/bookings" className="text-sm font-semibold flex items-center gap-1 transition-colors hover:text-[var(--brand)]" style={{ color: "var(--text-primary)" }}>
            View all <ArrowRight size={14} />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[800px] lg:min-w-0 lg:table-fixed" style={{ width: "100%" }}>
            <colgroup>
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <TableHeader>
              <TableRow className="hover:bg-transparent" style={{ borderColor: "var(--border)" }}>
                <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center" style={{ color: "var(--text-label)" }}>GUEST</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center" style={{ color: "var(--text-label)" }}>ROOM TYPE</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center" style={{ color: "var(--text-label)" }}>CHECK-IN</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center" style={{ color: "var(--text-label)" }}>CHECK-OUT</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center" style={{ color: "var(--text-label)" }}>STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} style={{ borderColor: "var(--border-subtle)" }}>
                    <TableCell colSpan={5} className="px-6 py-4">
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : recentBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 font-medium" style={{ color: "var(--text-muted)" }}>
                    No recent bookings found
                  </TableCell>
                </TableRow>
              ) : (
                recentBookings.map((b) => (
                  <TableRow key={b.id} className="transition-colors hover:bg-[var(--surface-subtle)]" style={{ borderColor: "var(--border)" }}>
                    <TableCell className="px-6 py-4 text-center font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                      {b.guestName ?? `Guest #${b.guestId}`}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center font-medium" style={{ color: "var(--text-primary)" }}>
                      {b.roomType}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center font-medium" style={{ color: "var(--text-primary)" }}>{toDateInput(b.checkIn)}</TableCell>
                    <TableCell className="px-6 py-4 text-center font-medium" style={{ color: "var(--text-primary)" }}>{toDateInput(b.checkOut)}</TableCell>
                    <TableCell className="px-6 py-4 align-middle">
                      <div className="flex justify-center w-full">
                        <Badge variant="outline" className={`px-2.5 py-0.5 rounded-full font-medium ${BOOKING_BADGE_STYLES[b.status]}`}>
                          {BOOKING_LABELS[b.status]}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default DashboardPage;