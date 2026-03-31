"use client";

import { useState } from "react";
import { Eye, Loader2, Plus } from "lucide-react";
import { useGuests } from "@/hooks";
import { Guest } from "@/types";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormFieldLabel } from "@/components/ui/form-field";
import { DialogFooter } from "@/components/ui/dialog";

export default function GuestsPage() {
  const {
    guests,
    loading,
    selectedGuest,
    guestHistory,
    loadingHistory,
    isDetailOpen,
    isAddOpen,
    saving,
    handleViewDetails,
    closeDetail,
    openAdd,
    closeAdd,
    handleAddGuest,
  } = useGuests();

  const [addForm, setAddForm] = useState({ name: "", email: "", phone: "" });

  const toDateInput = (dateStr: string) => dateStr?.slice(0, 10) ?? "";

  const onAddSubmit = async () => {
    const success = await handleAddGuest(addForm as Omit<Guest, "id">);
    if (success) {
      setAddForm({ name: "", email: "", phone: "" });
    }
  };

  return (
    <div className="space-y-6 p-6 min-h-screen" style={{ backgroundColor: "var(--surface-subtle)" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 lg:gap-0 lg:items-start">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight lg:hidden" style={{ color: "var(--text-primary)" }}>Guests Management</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            View guest information and booking history
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 font-semibold w-full sm:w-auto"
          style={{ backgroundColor: "var(--brand)", color: "var(--text-on-brand)" }}
        >
          <Plus size={16} />
          Add Guest
        </Button>
      </div>

      <div className="rounded-xl border shadow-sm overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <Table className="min-w-[700px] lg:min-w-0">
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
      </div>

      <Dialog open={isDetailOpen} onOpenChange={closeDetail}>
        <DialogContent className="sm:max-w-2xl w-[95vw] sm:w-full p-0 overflow-hidden border-none" style={{ backgroundColor: "var(--surface)" }}>
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Guest Details</DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 py-3 border-b border-dashed" style={{ borderColor: "var(--border-subtle)" }}>
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
                <div className="overflow-x-auto">
                  <Table className="min-w-[500px] lg:min-w-0">
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
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddOpen} onOpenChange={closeAdd}>
        <DialogContent className="sm:max-w-md w-[95vw] sm:w-full" style={{ backgroundColor: "var(--surface-solid)" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "var(--text-primary)" }}>Add New Guest</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <FormFieldLabel>Name</FormFieldLabel>
              <Input
                placeholder="e.g. John Doe"
                value={addForm.name}
                onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <FormFieldLabel>Email Address</FormFieldLabel>
              <Input
                type="email"
                placeholder="e.g. john@example.com"
                value={addForm.email}
                onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <FormFieldLabel>Phone Number</FormFieldLabel>
              <Input
                type="tel"
                placeholder="e.g. +1 555-0123"
                value={addForm.phone}
                onChange={(e) => setAddForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={closeAdd} disabled={saving}>Cancel</Button>
            <Button onClick={onAddSubmit} disabled={saving} style={{ backgroundColor: "var(--brand)", color: "#fff" }}>
              {saving ? "Saving..." : "Add Guest"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
