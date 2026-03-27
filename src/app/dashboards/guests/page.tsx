"use client";

import { Eye, Loader2 } from "lucide-react";
import { 
  useGuests 
} from "@/hooks";
import { 
  GUEST_LABELS,
  BOOKING_BADGE_STYLES,
  BOOKING_LABELS 
} from "@/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function GuestsPage() {
  const {
    guests,
    loading,
    selectedGuest,
    guestHistory,
    loadingHistory,
    isDetailOpen,
    handleViewDetails,
    closeDetail,
  } = useGuests();

  const toDateInput = (dateStr: string) => dateStr?.slice(0, 10) ?? "";

  return (
    <div className="space-y-6 p-6 min-h-screen" style={{ backgroundColor: "var(--surface-subtle)" }}>
      <div className="flex flex-col gap-1">
        <p className="text-sm" style={{ color: "var(--text-label)" }}>View guest information and booking history</p>
      </div>

      <div className="rounded-xl border shadow-sm overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent" style={{ borderColor: "var(--border)" }}>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>{GUEST_LABELS.NAME}</TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>{GUEST_LABELS.EMAIL}</TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>{GUEST_LABELS.PHONE}</TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right" style={{ color: "var(--text-label)" }}>{GUEST_LABELS.ACTIONS}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} style={{ borderColor: "var(--border-subtle)" }}>
                  <TableCell colSpan={4} className="px-6 py-4">
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : guests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 font-medium" style={{ color: "var(--text-muted)" }}>
                  No guests found
                </TableCell>
              </TableRow>
            ) : (
              guests.map((guest) => (
                <TableRow key={guest.id} className="transition-colors hover:bg-[var(--surface-subtle)]" style={{ borderColor: "var(--border)" }}>
                  <TableCell className="px-6 py-4 font-semibold" style={{ color: "var(--text-primary)" }}>{guest.name}</TableCell>
                  <TableCell className="px-6 py-4" style={{ color: "var(--text-primary)" }}>{guest.email}</TableCell>
                  <TableCell className="px-6 py-4" style={{ color: "var(--text-secondary)" }}>{guest.phone}</TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleViewDetails(guest)}
                      className="p-2 rounded-md transition-colors hover:bg-[var(--surface-muted)] group cursor-pointer"
                    >
                      <Eye size={18} className="text-[var(--text-muted)] group-hover:text-[var(--primary)] text-slate-500" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailOpen} onOpenChange={closeDetail}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden border-none" style={{ backgroundColor: "var(--surface)" }}>
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Guest Details</DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-8">
            <div className="flex items-center gap-8 py-3 border-b border-dashed" style={{ borderColor: "var(--border-subtle)" }}>
              <div className="flex gap-2 items-center whitespace-nowrap">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Name:</span>
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{selectedGuest?.name}</span>
              </div>
              <div className="flex gap-2 items-center whitespace-nowrap">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Email:</span>
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{selectedGuest?.email}</span>
              </div>
              <div className="flex gap-2 items-center whitespace-nowrap">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Phone:</span>
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{selectedGuest?.phone}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>Booking History</h3>
              <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border-subtle)" }}>
                <Table>
                  <TableHeader style={{ backgroundColor: "var(--surface-muted)" }}>
                    <TableRow className="hover:bg-transparent" style={{ borderColor: "var(--border-subtle)" }}>
                      <TableHead className="px-4 py-3 text-[10px] font-bold uppercase" style={{ color: "var(--text-label)" }}>Room Number</TableHead>
                      <TableHead className="px-4 py-3 text-[10px] font-bold uppercase" style={{ color: "var(--text-label)" }}>Check-In</TableHead>
                      <TableHead className="px-4 py-3 text-[10px] font-bold uppercase" style={{ color: "var(--text-label)" }}>Check-Out</TableHead>
                      <TableHead className="px-4 py-3 text-[10px] font-bold uppercase text-center" style={{ color: "var(--text-label)" }}>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingHistory ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto text-[var(--brand)]" />
                        </TableCell>
                      </TableRow>
                    ) : guestHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-sm" style={{ color: "var(--text-muted)" }}>
                          No booking history found
                        </TableCell>
                      </TableRow>
                    ) : (
                      guestHistory.map((booking) => (
                        <TableRow key={booking.id} style={{ borderColor: "var(--border-subtle)" }}>
                          <TableCell className="px-4 py-3 font-medium" style={{ color: "var(--text-primary)" }}>{booking.roomNumber}</TableCell>
                          <TableCell className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{toDateInput(booking.checkIn)}</TableCell>
                          <TableCell className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{toDateInput(booking.checkOut)}</TableCell>
                          <TableCell className="px-4 py-3">
                            <div className="flex justify-center">
                              <Badge variant="outline" className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${BOOKING_BADGE_STYLES[booking.status]}`}>
                                {BOOKING_LABELS[booking.status]}
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
