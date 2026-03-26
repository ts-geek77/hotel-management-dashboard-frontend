"use client";

import api from "@/services/api-client";
import { Booking, Guest, Room } from "@/types";
import { useEffect, useState } from "react";
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
import { BedDouble, BedSingle, CalendarCheck, Users, ArrowRight } from "lucide-react";
  
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

const bookingBadge: Record<Booking["status"], string> = {
  Booked: "bg-blue-50 text-blue-600 hover:bg-blue-100 border-transparent",
  "Checked In": "bg-purple-50 text-purple-600 hover:bg-purple-100 border-transparent",
  "Checked Out": "bg-slate-100 text-slate-600 hover:bg-slate-200 border-transparent",
  Cancelled: "bg-red-50 text-red-600 hover:bg-red-100 border-transparent",
  Confirmed: "bg-blue-50 text-blue-600 hover:bg-blue-100 border-transparent",
  Pending: "bg-amber-50 text-amber-600 hover:bg-amber-100 border-transparent",
};

const bookingLabel: Record<Booking["status"], string> = {
  Booked: "Booked",
  "Checked In": "Checked In",
  "Checked Out": "Checked Out",
  Cancelled: "Cancelled",
  Confirmed: "Confirmed",
  Pending: "Pending",
};

const toDateInput = (dateStr: string) => dateStr?.slice(0, 10) ?? "";

const DashboardPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [r, g, b] = await Promise.all([
          api("/rooms"),
          api("/guests"),
          api("/bookings"),
        ]);
        setRooms(r.data);
        setGuests(g.data);
        setBookings(b.data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const availableRooms = rooms.filter((r) => r.status === "Available").length;
  const activeBookings = bookings.filter(
    (b) => b.status === "Booked" || b.status === "Checked In",
  ).length;
  const checkedInGuests = bookings.filter((b) => b.status === "Checked In").length;

  const recentBookings = [...bookings]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  const guestMap = Object.fromEntries(guests.map((g) => [g.id, g.name]));
  const roomMap = Object.fromEntries(rooms.map((r) => [r.id, r.roomNumber]));

  return (
    <div className="space-y-4 p-4 min-h-screen" style={{ backgroundColor: "var(--surface-subtle)" }}>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Rooms"
          value={rooms.length}
          icon={<BedDouble size={24} className="text-blue-500" />}
          loading={loading}
        />
        <StatCard
          title="Available Rooms"
          value={availableRooms}
          icon={<BedSingle size={24} className="text-emerald-500" />}
          loading={loading}
        />
        <StatCard
          title="Active Bookings"
          value={activeBookings}
          icon={<CalendarCheck size={24} className="text-purple-500" />}
          loading={loading}
        />
        <StatCard
          title="Total Guests"
          value={guests.length}
          icon={<Users size={24} className="text-amber-500" />}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <NavCard
          title="Manage Rooms"
          subtitle="View and edit rooms details"
          href="/dashboards/rooms"
        />
        <NavCard
          title="View Guests"
          subtitle="Guest information and history"
          href="/dashboards/guests"
        />
        <NavCard
          title="Manage Bookings"
          subtitle="Create and update bookings"
          href="/dashboards/bookings"
        />
      </div>

      <Card className="border-none shadow-sm" style={{ backgroundColor: "var(--surface)" }}>
        <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4" style={{ borderColor: "var(--border)" }}>
          <CardTitle className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Recent Bookings</CardTitle>
          <Link href="/dashboards/bookings" className="text-sm font-semibold flex items-center gap-1 transition-colors hover:text-[var(--brand)]" style={{ color: "var(--text-primary)" }}>
            View all <ArrowRight size={14} />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="w-full" style={{ tableLayout: "fixed", width: "100%" }}>
            <colgroup>
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <TableHeader>
              <TableRow className="hover:bg-transparent" style={{ borderColor: "var(--border)" }}>
                <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center" style={{ width: "20%", color: "var(--text-label)" }}>GUEST</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center" style={{ width: "20%", color: "var(--text-label)" }}>ROOM</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center" style={{ width: "20%", color: "var(--text-label)" }}>CHECK-IN</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center" style={{ width: "20%", color: "var(--text-label)" }}>CHECK-OUT</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center" style={{ width: "20%", color: "var(--text-label)" }}>STATUS</TableHead>
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
                      {guestMap[b.guestId] ?? `Guest #${b.guestId}`}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center font-medium" style={{ color: "var(--text-primary)" }}>
                      {roomMap[b.roomId] ?? b.roomId}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center font-medium" style={{ color: "var(--text-primary)" }}>{toDateInput(b.checkIn)}</TableCell>
                    <TableCell className="px-6 py-4 text-center font-medium" style={{ color: "var(--text-primary)" }}>{toDateInput(b.checkOut)}</TableCell>
                    <TableCell className="px-6 py-4 align-middle">
                      <div className="flex justify-center w-full">
                        <Badge variant="outline" className={`px-2.5 py-0.5 rounded-full font-medium ${bookingBadge[b.status]}`}>
                          {bookingLabel[b.status]}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
};

export default DashboardPage;