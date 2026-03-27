export interface Room {
  id: number;
  roomNumber: string;
  roomType: string;
  status: "Available" | "Booked" | "Maintenance";
  price: number;
}

export interface Guest {
  id: number;
  name: string;
  email: string;
  phone: string;
  roomNumber?: string;
}

export interface Booking {
  id: number;
  guestId: number;
  roomId: number;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: "Booked" | "Checked In" | "Checked Out" | "Cancelled" | "Confirmed" | "Pending";
  price: number;
  roomNumber?: string;
}

export interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  activeBookings: number;
  checkedInGuests: number;
}
