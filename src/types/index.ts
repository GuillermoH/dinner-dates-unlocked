
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
  created_at?: string;
  updated_at?: string;
}

export interface SGDEvent {
  id: string;
  title: string;
  description: string;
  date_time: string;  // Changed from dateTime to match DB column
  location: string;
  capacity: number;
  visibility: EventVisibility;
  host_id: string;    // Changed from hostId to match DB column
  host_name: string;  // Changed from hostName to match DB column
  attendees: Attendee[];
  waitlist: Attendee[];
  image?: string;
  is_paid: boolean;   // Changed from isPaid to match DB column
  price?: number;
  community_id?: string; // Changed from communityId to match DB column
  created_at?: string;
  updated_at?: string;
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  paymentStatus?: "pending" | "confirmed";
}
