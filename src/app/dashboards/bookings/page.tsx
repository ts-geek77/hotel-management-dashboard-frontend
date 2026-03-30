"use client";

import { useBookings } from "@/hooks/useBookings";
import { Booking, Guest, Room } from "@/types";
import { useState, useMemo, useEffect, useCallback } from "react";
import type { DayButtonProps } from "react-day-picker";
import * as Yup from "yup";
import useForm from "@/hooks/useForm";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,  
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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
  CalendarCheck,
  CalendarDays,
  CalendarX,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  TableIcon,
  User,
  XCircle,
} from "lucide-react";
import { format, parseISO, addDays, startOfDay } from "date-fns";
import { 
  BOOKING_STATUSES, 
  BOOKING_LABELS, 
  BOOKING_BADGE_STYLES,
  BOOKING_STATUS_DOTS,
  BOOKING_STATUS_SURFACES,
  BOOKING_STATUS_TEXT_COLORS,
  MONTHS
} from "@/constants";

const toDateStr = (d: Date | null | undefined) => {
  if (!d || isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const toDateInput = (s: string | null | undefined) => {
  if (typeof s !== "string") return "";
  return s.slice(0, 10);
};

interface DayDetailProps {
  date: Date;
  bookings: Booking[];
  guestMap: Record<number, Guest>;
  roomMap: Record<number, Room>;
}

const DayDetailContent = ({
  date,
  bookings,
  guestMap,
  roomMap,
}: DayDetailProps) => {
  if (!date || isNaN(date.getTime())) return null;

  const label = date.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto" style={{ backgroundColor: 'var(--surface)' }}>
      <DialogHeader>
        <DialogTitle className="text-base font-semibold">{label}</DialogTitle>
      </DialogHeader>

      {bookings.length === 0 ? (
        <div className="py-10 text-center text-gray-400 text-sm">
          No bookings on this day
        </div>
      ) : (
        <div className="flex flex-col gap-3 pt-1">
          {bookings.map((b, i) => (
            <div key={b.id}>
              {i > 0 && <Separator className="mb-3" />}
              <div className={`rounded-lg border p-4 ${BOOKING_STATUS_SURFACES[b.status] || ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${BOOKING_STATUS_TEXT_COLORS[b.status] || ''}`}>
                    {BOOKING_LABELS[b.status]}
                  </span>
                  <span className="text-xs text-gray-400">#{b.id}</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="h-7 w-7 rounded-full bg-white border flex items-center justify-center shrink-0">
                    <User className="h-3.5 w-3.5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Guest</p>
                    <p className="text-sm font-medium text-zinc-900">
                      {guestMap[b.guestId]?.name ?? `Guest #${b.guestId}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="h-7 w-7 rounded-full bg-white border flex items-center justify-center shrink-0">
                    <BedDouble className="h-3.5 w-3.5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Room</p>
                    <p className="text-sm font-medium text-zinc-900">
                      {roomMap[b.roomId]?.roomNumber
                        ? `Room ${roomMap[b.roomId].roomNumber}`
                        : `#${b.roomId}`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 mt-3">
                  <div className="flex items-center gap-1.5">
                    <CalendarCheck className="h-3.5 w-3.5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Check-in</p>
                      <p className="text-xs font-medium text-zinc-800">{toDateInput(b.checkIn)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CalendarX className="h-3.5 w-3.5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Check-out</p>
                      <p className="text-xs font-medium text-zinc-800">{toDateInput(b.checkOut)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DialogContent>
  );
};

const BOOKING_SCHEMA = Yup.object().shape({
  guestId: Yup.number().required("Guest is required").positive("Invalid guest"),
  roomId: Yup.number().required("Room is required").positive("Invalid room"),
  checkIn: Yup.string().required("Check-in date is required"),
  checkOut: Yup.string()
    .required("Check-out date is required")
    .test("is-after-checkin", "Check-out must be after check-in", function(val) {
      const { checkIn } = this.parent;
      if (!checkIn || !val) return true;
      return new Date(val) > new Date(checkIn);
    }),
  status: Yup.string().required("Status is required") as Yup.Schema<Booking["status"]>,
});

export default function BookingsPage() {
  const {
    bookings,
    rooms,
    guests,
    loading,
    view,
    setView,
    handleCreateBooking,
    handleUpdateStatus,
    handleDeleteBooking,
  } = useBookings();

  const [month, setMonth] = useState<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [dayDialogOpen, setDayDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const initialValues = useMemo(() => ({
    guestId: "" as unknown as number,
    roomId: "" as unknown as number,
    checkIn: "",
    checkOut: "",
    status: "Booked" as Booking["status"],
  }), []);

  const handleSubmitBooking = useCallback(async (data: any) => {
    await handleCreateBooking({
      guestId: Number(data.guestId),
      roomId: Number(data.roomId),
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      status: data.status,
    });
    setCreateDialogOpen(false);
  }, [handleCreateBooking]);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    setFieldValue,
    handleSubmit,
    reset,
  } = useForm({
    initialValues,
    schema: BOOKING_SCHEMA,
    onSubmit: handleSubmitBooking,
  });

  useEffect(() => {
    if (!createDialogOpen) {
      reset();
    }
  }, [createDialogOpen, reset]);

  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    bookings.forEach((b) => {
      const start = parseISO(b.checkIn);
      const end = parseISO(b.checkOut);
      let cursor = startOfDay(start);
      const last = startOfDay(end);

      while (cursor <= last) {
        const key = toDateStr(cursor);
        if (!map[key]) map[key] = [];
        map[key].push(b);
        cursor = addDays(cursor, 1);
      }
    });
    return map;
  }, [bookings]);

  const guestLookup = useMemo(() => 
    guests.reduce((acc, g) => ({ ...acc, [g.id]: g }), {} as Record<number, Guest>),
    [guests]
  );
  
  const roomLookup = useMemo(() => 
    rooms.reduce((acc, r) => ({ ...acc, [r.id]: r }), {} as Record<number, Room>),
    [rooms]
  );

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setDayDialogOpen(true);
  };

  const selectedDayBookings = useMemo(() => {
    if (!selectedDate) return [];
    const key = toDateStr(selectedDate);
    return bookingsByDate[key] ?? [];
  }, [selectedDate, bookingsByDate]);

  const CustomDayButton = (props: DayButtonProps) => {
    const { day, modifiers, ...buttonProps } = props;
    const key = toDateStr(day.date);
    const dayBookings = bookingsByDate[key] ?? [];
    const isToday = modifiers?.today ?? false;
    const isOutside = modifiers?.outside ?? false;

    return (
      <button
        {...buttonProps}
        type="button"
        onClick={(e) => {
          props.onClick?.(e);
          handleDayClick(day.date);
        }}
        className={`
          w-full h-[80px] sm:h-[100px] flex flex-col items-start p-2
          transition-all hover:bg-slate-50/50 hover:cursor-pointer focus:outline-none bg-surface
          border border-border shadow-sm rounded-xl
          ${isOutside ? "bg-slate-50/10 opacity-30 grayscale" : ""}
          ${isToday ? "border-brand border-2" : ""}
          ${modifiers?.selected ? "ring-2 ring-brand" : ""}
        `}
      >
        <span
          className={`
            text-[11px] font-bold h-6 w-6 flex items-center justify-center rounded-full shrink-0 mb-2 leading-none
            ${isToday ? "bg-brand text-white shadow-sm" : "text-text-muted"}
          `}
        >
          {day.date.getDate()}
        </span>

        <div className="w-full space-y-1 flex-1 overflow-hidden px-0.5 text-left">
          {dayBookings.slice(0, 2).map((b) => (
            <div
              key={b.id}
              className={`
                w-full rounded-sm px-2 py-1 text-[9px] font-extrabold leading-tight
                truncate border-none text-white shadow-sm
                ${BOOKING_STATUS_DOTS[b.status] || 'bg-slate-400'}
              `}
            >
              {roomLookup[b.roomId]?.roomNumber ?? b.roomId} - {guestLookup[b.guestId]?.name?.split(" ")[0] ?? "Guest"}
            </div>
          ))}
          {dayBookings.length > 2 && (
            <p className="text-[9px] font-extrabold text-text-muted/60 text-center w-full mt-auto mb-0.5">
              +{dayBookings.length - 2} more
            </p>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="w-full space-y-4 p-6 min-h-screen bg-slate-50/50 text-text-primary">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col lg:hidden">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Bookings Management</h1>
          <p className="text-sm text-[var(--text-muted)]">Real-time status of your hotel operations</p>
        </div>
        <div className="flex items-center border border-border rounded-lg p-0.5 bg-surface shadow-sm overflow-hidden w-full sm:w-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("calendar")}
            className={`h-8 flex-1 sm:px-4 cursor-pointer rounded-md transition-all ${
              view === "calendar" ? "bg-slate-100 shadow-sm font-bold text-text-primary" : "text-text-muted hover:text-text-secondary"
            }`}
          >
            <CalendarDays className="h-4 w-4 mr-2" /> Calendar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("table")}
            className={`h-8 flex-1 sm:px-4 cursor-pointer rounded-md transition-all ${
              view === "table" ? "bg-slate-100 shadow-sm font-bold text-text-primary" : "text-text-muted hover:text-text-secondary"
            }`}
          >
            <TableIcon className="h-4 w-4 mr-2" /> Table
          </Button>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-brand hover:bg-brand-hover text-white cursor-pointer font-bold px-6 shadow-md rounded-lg h-11 transition-all active:scale-95">
              <Plus className="mr-2 h-4 w-4 text-white" /> New Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg w-[95vw] sm:w-full p-0 overflow-hidden border-none rounded-2xl bg-surface">
            <DialogHeader className="p-8 pb-2">
              <DialogTitle className="text-xl font-bold text-text-primary">Create New Booking</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-text-label uppercase tracking-wider">Guest</Label>
                <Select 
                  name="guestId" 
                  value={values.guestId ? values.guestId.toString() : ""} 
                  onValueChange={(val) => setFieldValue("guestId", Number(val))}
                >
                  <SelectTrigger className={`bg-surface-muted/50 border-border h-12 rounded-xl focus:ring-brand ${touched.guestId && errors.guestId ? 'border-error ring-error ring-1' : ''}`}>
                    <SelectValue placeholder="Select a guest" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border shadow-xl bg-surface">
                    {guests.map((g) => (
                      <SelectItem key={g.id} value={g.id.toString()} className="font-medium focus:bg-brand-light">{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {touched.guestId && errors.guestId && <p className="text-xs text-error mt-1">{errors.guestId}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-text-label uppercase tracking-wider">Room</Label>
                <Select 
                  name="roomId" 
                  value={values.roomId ? values.roomId.toString() : ""} 
                  onValueChange={(val) => setFieldValue("roomId", Number(val))}
                >
                  <SelectTrigger className={`bg-surface-muted/50 border-border h-12 rounded-xl focus:ring-brand ${touched.roomId && errors.roomId ? 'border-error ring-error ring-1' : ''}`}>
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border shadow-xl bg-surface">
                    {rooms.filter(r => r.status === "Available").map((r) => (
                      <SelectItem key={r.id} value={r.id.toString()} className="font-medium focus:bg-brand-light">Room {r.roomNumber} ({r.roomType})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {touched.roomId && errors.roomId && <p className="text-xs text-error mt-1">{errors.roomId}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-text-label uppercase tracking-wider">Check-In</Label>
                  <Input 
                    type="date" 
                    name="checkIn" 
                    min={todayStr} 
                    value={values.checkIn}
                    onChange={handleChange}
                    className={`bg-surface-muted/50 border-border h-12 rounded-xl focus:ring-brand ${touched.checkIn && errors.checkIn ? 'border-error ring-error ring-1' : ''}`} 
                  />
                  {touched.checkIn && errors.checkIn && <p className="text-xs text-error mt-1">{errors.checkIn}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-text-label uppercase tracking-wider">Check-Out</Label>
                  <Input 
                    type="date" 
                    name="checkOut" 
                    min={todayStr} 
                    value={values.checkOut}
                    onChange={handleChange}
                    className={`bg-surface-muted/50 border-border h-12 rounded-xl focus:ring-brand ${touched.checkOut && errors.checkOut ? 'border-error ring-error ring-1' : ''}`} 
                  />
                  {touched.checkOut && errors.checkOut && <p className="text-xs text-error mt-1">{errors.checkOut}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-text-label uppercase tracking-wider">Status</Label>
                <Select 
                  name="status" 
                  value={values.status} 
                  onValueChange={(val) => setFieldValue("status", val)}
                >
                  <SelectTrigger className={`bg-surface-muted/50 border-border h-12 rounded-xl focus:ring-brand ${touched.status && errors.status ? 'border-error ring-error ring-1' : ''}`}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border shadow-xl bg-surface">
                    {BOOKING_STATUSES.map(s => (
                      <SelectItem key={s} value={s} className="font-medium focus:bg-brand-light">{BOOKING_LABELS[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {touched.status && errors.status && <p className="text-xs text-error mt-1">{errors.status}</p>}
              </div>

              <div className="pt-6 flex gap-4">
                <Button type="button" variant="outline" onClick={() => { setCreateDialogOpen(false); reset(); }} disabled={isSubmitting} className="flex-1 h-12 font-bold rounded-xl border-border text-text-secondary">Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 h-12 font-bold bg-brand hover:bg-brand-hover text-white rounded-xl shadow-lg shadow-brand/10 transition-all active:scale-95">
                  {isSubmitting ? "Creating..." : "Create Booking"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {view === "calendar" ? (
        loading ? (
          <div className="rounded-2xl border border-border p-8 space-y-6 bg-surface shadow-sm">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-48 rounded-lg" />
              <Skeleton className="h-10 w-40 rounded-lg" />
            </div>
            <div className="grid grid-cols-7 gap-px bg-border-subtle border border-border rounded-xl overflow-hidden">
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton key={i} className="h-32 bg-surface" />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-2.5 bg-surface">
              <p className="font-bold text-text-primary text-xl">
                {MONTHS[month.getMonth()]} {month.getFullYear()}
              </p>
              <div className="flex items-center border border-border rounded-lg p-0.5 bg-slate-50 shadow-inner">
                <Button 
                  variant="ghost" 
                  size="icon-sm" 
                  onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                  className="h-8 w-8 text-text-muted hover:text-text-secondary hover:bg-white rounded-md transition-all cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </Button>
                <div className="h-4 w-px bg-border mx-1" />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setMonth(new Date())} 
                  className="h-8 px-4 font-bold text-[13px] text-text-secondary hover:bg-white rounded-md transition-all cursor-pointer"
                >
                  Today
                </Button>
                <div className="h-4 w-px bg-border mx-1" />
                <Button 
                  variant="ghost" 
                  size="icon-sm" 
                  onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                  className="h-8 w-8 text-text-muted hover:text-text-secondary hover:bg-white rounded-md transition-all cursor-pointer"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>

            <Calendar
              mode="single"
              onMonthChange={setMonth}
              month={month}
              selected={selectedDate}
              onSelect={setSelectedDate}
              hideNavigation
              showOutsideDays
              className="w-full p-0 bg-slate-50/50"
              formatters={{
                formatWeekdayName: (date) => format(date, "EEE"),
              }}
              classNames={{
                root: "w-full block overflow-x-auto pb-4",
                month_caption: "hidden",
                month_grid: "w-full p-3 min-w-[800px] lg:min-w-0",
                month: "w-full",
                table: "w-full border-separate border-spacing-2 overflow-hidden",
                row: "flex w-full mb-0.5",
                cell: "flex-1 h-full min-h-[100px] p-0 bg-transparent overflow-hidden",
                day: "p-0 w-full h-full",
                day_button: "w-full h-full",
                weekdays: "grid grid-cols-7 bg-surface border-b border-border-subtle",
                weekday: "text-center text-[10px] font-bold text-text-label py-3 uppercase tracking-widest",
              }}
              components={{
                DayButton: CustomDayButton,
              }}
            />

            <div className="flex flex-wrap items-center gap-6 px-6 py-2.5 bg-surface border-t border-border-subtle">
              {BOOKING_STATUSES.map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-sm ${BOOKING_STATUS_DOTS[s] || "bg-slate-300"}`} />
                  <span className="text-[10px] font-bold text-text-label">{BOOKING_LABELS[s]}</span>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        <div className="rounded-xl border border-border shadow-sm overflow-hidden bg-surface">
          <div className="overflow-x-auto">
            <Table className="min-w-[900px] lg:min-w-0 lg:table-fixed">
            <TableHeader className="bg-surface-muted">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-[18%] px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-center text-text-label">Guest</TableHead>
                <TableHead className="w-[12%] px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-center text-text-label">Room</TableHead>
                <TableHead className="w-[18%] px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-center text-text-label">Check-In</TableHead>
                <TableHead className="w-[18%] px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-center text-text-label">Check-Out</TableHead>
                <TableHead className="w-[18%] px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-center text-text-label">Status</TableHead>
                <TableHead className="w-[16%] px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-center text-text-label">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell colSpan={6} className="px-6 py-4"><Skeleton className="h-6 w-full" /></TableCell>
                  </TableRow>
                ))
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 font-medium text-text-muted">No bookings found</TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id} className="transition-colors hover:bg-surface-muted border-border">
                    <TableCell className="px-6 py-4 font-semibold text-sm text-center text-text-primary">{guestLookup[booking.guestId]?.name ?? 'Unknown'}</TableCell>
                    <TableCell className="px-6 py-4 text-sm font-medium text-center text-text-secondary">{roomLookup[booking.roomId]?.roomNumber ?? booking.roomId}</TableCell>
                    <TableCell className="px-6 py-4 text-sm text-center text-text-secondary">{toDateInput(booking.checkIn)}</TableCell>
                    <TableCell className="px-6 py-4 text-sm text-center text-text-secondary">{toDateInput(booking.checkOut)}</TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <Badge variant="outline" className={`px-2 py-0.5 text-[10px] rounded-full font-bold shadow-sm ${BOOKING_BADGE_STYLES[booking.status]}`}>
                        {BOOKING_LABELS[booking.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex justify-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon-sm"
                          onClick={() => {
                            if (booking) setEditBooking(booking);
                          }}
                          className="p-1 h-8 w-8 rounded-md transition-colors hover:bg-surface-muted group cursor-pointer"
                        >
                          <Eye size={18} className="text-text-secondary group-hover:text-brand" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon-sm"
                              className="p-1 rounded-md transition-colors hover:bg-red-50 group cursor-pointer"
                            >
                              <XCircle size={18} className="text-error group-hover:text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-surface border-border">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-bold">Delete Booking?</AlertDialogTitle>
                              <AlertDialogDescription>Are you sure you want to cancel the booking.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="font-bold">Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteBooking(booking.id)} className="bg-error font-bold text-white">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </div>
      )}

      <Dialog open={!!editBooking} onOpenChange={(o) => !o && setEditBooking(null)}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-none text-text-primary shadow-2xl rounded-2xl bg-surface">
          <DialogHeader className="p-8 pb-4 flex flex-row items-center justify-between border-b border-border-subtle">
            <DialogTitle className="text-xl font-bold text-text-primary">Booking Details</DialogTitle>
          </DialogHeader>
          
          <div className="p-8 pt-6 space-y-8">
            {editBooking && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-text-label uppercase tracking-wider">Guest</p>
                    <p className="text-base font-semibold text-text-secondary">{guestLookup[editBooking.guestId]?.name ?? 'Unknown'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-text-label uppercase tracking-wider">Room</p>
                    <p className="text-base font-semibold text-text-secondary">{roomLookup[editBooking.roomId]?.roomNumber ?? editBooking.roomId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-text-label uppercase tracking-wider">Check-in</p>
                    <p className="text-base font-semibold text-text-secondary">{toDateInput(editBooking.checkIn)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-text-label uppercase tracking-wider">Check-out</p>
                    <p className="text-base font-semibold text-text-secondary">{toDateInput(editBooking.checkOut)}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 sm:gap-0 pt-4">
                  <div className="space-y-2 w-full sm:w-[240px]">
                    <p className="text-[11px] font-bold text-text-label uppercase tracking-wider">Status</p>
                    <Select 
                      defaultValue={editBooking.status}
                      onValueChange={(val) => handleUpdateStatus(editBooking.id, val as Booking["status"])}
                    >
                      <SelectTrigger className="h-12 border-brand/30 bg-brand-light text-brand font-semibold rounded-xl focus:ring-brand">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border shadow-xl bg-surface">
                        {BOOKING_STATUSES.map(s => (
                          <SelectItem key={s} value={s} className="font-medium text-text-secondary focus:bg-brand-light focus:text-brand">{BOOKING_LABELS[s]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    variant="destructive"
                    onClick={async () => {
                      await handleUpdateStatus(editBooking.id, "Cancelled");
                      setEditBooking(null);
                    }}
                    className="h-11 px-8 bg-error hover:bg-destructive text-white font-bold rounded-xl shadow-lg shadow-error/20 transition-all active:scale-95"
                  >
                    Cancel Booking
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dayDialogOpen} onOpenChange={setDayDialogOpen}>
        {selectedDate && (
          <DayDetailContent date={selectedDate} bookings={selectedDayBookings} guestMap={guestLookup} roomMap={roomLookup} />
        )}
      </Dialog>
    </div>
  );
}
