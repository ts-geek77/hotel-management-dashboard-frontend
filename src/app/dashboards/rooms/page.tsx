"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

import { Room } from "@/types";
import { CreateRoomInput, UpdateRoomInput } from "@/services/room.service";
import {
  ROOM_TYPES,
  ROOM_STATUSES,
  ROOM_STATUS_BADGE,
  DEFAULT_ROOM_FORM,
} from "@/constants";
import { useRooms } from "@/hooks";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RoomsPage() {
  const {
    rooms,
    loading,
    saving,
    handleAddRoom,
    handleUpdateRoom,
    handleDeleteRoom,
  } = useRooms();

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [addForm, setAddForm] = useState<CreateRoomInput>(DEFAULT_ROOM_FORM);
  const [editForm, setEditForm] = useState<UpdateRoomInput & { id: number }>({ id: 0 });
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; roomNumber: string } | null>(null);

  const onAdd = async () => {
    const success = await handleAddRoom(addForm);
    if (success) {
      setAddOpen(false);
      setAddForm(DEFAULT_ROOM_FORM);
    }
  };

  const openEdit = (room: Room) => {
    setEditForm({
      id: room.id,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      status: room.status,
      price: room.price,
    });
    setEditOpen(true);
  };

  const onEdit = async () => {
    const { id, ...rest } = editForm;
    const success = await handleUpdateRoom(id, rest);
    if (success) {
      setEditOpen(false);
    }
  };

  const openDelete = (room: Room) => {
    setDeleteTarget({ id: room.id, roomNumber: room.roomNumber });
    setDeleteOpen(true);
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    const success = await handleDeleteRoom(deleteTarget.id);
    if (success) {
      setDeleteOpen(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 p-4 min-h-screen" style={{ backgroundColor: "var(--surface-subtle)" }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            Manage hotel rooms, pricing, and availability
          </p>
        </div>
        <Button
          onClick={() => { setAddForm(DEFAULT_ROOM_FORM); setAddOpen(true); }}
          className="flex items-center gap-2 font-semibold"
          style={{ backgroundColor: "var(--brand)", color: "var(--text-on-brand)" }}
        >
          <Plus size={16} />
          Add Room
        </Button>
      </div>

      <Card className="border-none shadow-sm ring-0 overflow-hidden" style={{ backgroundColor: "var(--surface)" }}>
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
                <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center" style={{ width: "20%", color: "var(--text-label)" }}>ROOM NUMBER</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center" style={{ width: "20%", color: "var(--text-label)" }}>TYPE</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center" style={{ width: "20%", color: "var(--text-label)" }}>PRICE/NIGHT</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center" style={{ width: "20%", color: "var(--text-label)" }}>STATUS</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center" style={{ width: "20%", color: "var(--text-label)" }}>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} style={{ borderColor: "var(--border)" }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j} className="px-6 py-4">
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : rooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16 font-medium" style={{ color: "var(--text-muted)" }}>
                    No rooms found. Click &quot;Add Room&quot; to get started.
                  </TableCell>
                </TableRow>
              ) : (
                rooms.map((room) => (
                  <TableRow
                    key={room.id}
                    className="transition-colors hover:bg-[var(--surface-subtle)]"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <TableCell className="px-6 py-4 text-center font-semibold" style={{ color: "var(--text-primary)" }}>
                      {room.roomNumber}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center font-medium" style={{ color: "var(--text-secondary)" }}>
                      {room.roomType}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center font-medium" style={{ color: "var(--text-primary)" }}>
                      ${room.price}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center align-middle">
                      <div className="flex justify-center">
                        <Badge variant="outline" className={`rounded-full px-3 py-0.5 font-medium font-bold ${ROOM_STATUS_BADGE[room.status]}`}>
                          {room.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(room)}
                          className="p-1.5 rounded-md transition-colors hover:bg-blue-50"
                          title="Edit Room"
                        >
                          <Pencil size={15} className="text-primary" />
                        </button>
                        <button
                          onClick={() => openDelete(room)}
                          className="p-1.5 rounded-md transition-colors hover:bg-red-50"
                          title="Delete Room"
                        >
                          <Trash2 size={15} className="text-red-500" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md" style={{ backgroundColor: "var(--surface-solid)" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "var(--text-primary)" }}>Add New Room</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label style={{ color: "var(--text-secondary)" }}>Room Number</Label>
              <Input
                placeholder="e.g. 101"
                value={addForm.roomNumber}
                onChange={(e) => setAddForm((f) => ({ ...f, roomNumber: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label style={{ color: "var(--text-secondary)" }}>Room Type</Label>
              <Select value={addForm.roomType} onValueChange={(v) => setAddForm((f) => ({ ...f, roomType: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROOM_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label style={{ color: "var(--text-secondary)" }}>Price per Night ($)</Label>
              <Input
                type="number"
                placeholder="e.g. 120"
                value={addForm.price || ""}
                onChange={(e) => setAddForm((f) => ({ ...f, price: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label style={{ color: "var(--text-secondary)" }}>Status</Label>
              <Select value={addForm.status ?? "Available"} onValueChange={(v) => setAddForm((f) => ({ ...f, status: v as Room["status"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROOM_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={onAdd} disabled={saving} style={{ backgroundColor: "var(--brand)", color: "#fff" }}>
              {saving ? "Saving..." : "Add Room"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md" style={{ backgroundColor: "var(--surface-solid)" }}>
          <DialogHeader>
            <DialogTitle style={{ color: "var(--text-primary)" }}>Edit Room</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label style={{ color: "var(--text-secondary)" }}>Room Number</Label>
              <Input
                value={editForm.roomNumber ?? ""}
                onChange={(e) => setEditForm((f) => ({ ...f, roomNumber: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label style={{ color: "var(--text-secondary)" }}>Room Type</Label>
              <Select value={editForm.roomType ?? ""} onValueChange={(v) => setEditForm((f) => ({ ...f, roomType: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROOM_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label style={{ color: "var(--text-secondary)" }}>Price per Night ($)</Label>
              <Input
                type="number"
                value={editForm.price ?? ""}
                onChange={(e) => setEditForm((f) => ({ ...f, price: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label style={{ color: "var(--text-secondary)" }}>Status</Label>
              <Select value={editForm.status ?? ""} onValueChange={(v) => setEditForm((f) => ({ ...f, status: v as Room["status"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROOM_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={onEdit} disabled={saving} style={{ backgroundColor: "var(--brand)", color: "#fff" }}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="sm:max-w-sm" style={{ backgroundColor: "var(--surface-solid)" }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: "var(--text-primary)" }}>Delete Room?</AlertDialogTitle>
            <AlertDialogDescription style={{ color: "var(--text-muted)" }}>
              Are you sure you want to delete room{" "}
              <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{deleteTarget?.roomNumber}</span>?
              {" "}This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              disabled={saving}
              className="bg-[var(--destructive)] hover:bg-[var(--destructive-hover)] text-[var(--text-on-brand)]"
            >
              {saving ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
