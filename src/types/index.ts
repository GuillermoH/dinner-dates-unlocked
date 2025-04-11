
export type EventVisibility = "public" | "private" | "community";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  venmoHandle?: string;
  communities?: string[];
}

export interface Community {
  id: string;
  name: string;
  description: string;
  members: string[];
  admins: string[];
}

export interface SGDEvent {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  capacity: number;
  visibility: EventVisibility;
  hostId: string;
  hostName: string;
  attendees: Attendee[];
  waitlist: Attendee[];
  image?: string;
  isPaid: boolean;
  price?: number;
  communityId?: string;
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  paymentStatus?: "pending" | "confirmed";
}
