
import { SGDEvent } from "../types";

// Mock data for now, will be replaced with actual API calls
export const mockEvents: SGDEvent[] = [
  {
    id: "1",
    title: "Freshman Welcome Dinner",
    description: "Join us for a casual dinner to meet fellow freshmen from the engineering department!",
    date_time: "2025-05-20T18:00:00",
    location: "The Campus Cafe, Student Union Building",
    capacity: 10,
    visibility: "public",
    host_id: "host1",
    host_name: "Alex Morgan",
    attendees: [
      { id: "u1", name: "Jordan Smith", email: "jordan@university.edu" },
      { id: "u2", name: "Taylor Johnson", email: "taylor@university.edu" },
    ],
    waitlist: [],
    attendees_by_status: {
      going: [
        { id: "u1", name: "Jordan Smith", email: "jordan@university.edu" },
        { id: "u2", name: "Taylor Johnson", email: "taylor@university.edu" },
      ],
      maybe: [],
      not_going: []
    },
    is_paid: false,
  },
  {
    id: "2",
    title: "MBA Networking Dinner",
    description: "Connect with second-year MBA students and alumni in a casual setting over dinner.",
    date_time: "2025-05-22T19:00:00",
    location: "Bistro 45, Downtown Campus",
    capacity: 8,
    visibility: "community",
    host_id: "host2",
    host_name: "Sam Wilson",
    attendees: [
      { id: "u3", name: "Casey Lee", email: "casey@university.edu" },
      { id: "u4", name: "Morgan Chen", email: "morgan@university.edu" },
      { id: "u5", name: "Jamie Kim", email: "jamie@university.edu" },
    ],
    waitlist: [
      { id: "u6", name: "Riley Brown", email: "riley@university.edu" },
    ],
    attendees_by_status: {
      going: [
        { id: "u3", name: "Casey Lee", email: "casey@university.edu" },
        { id: "u4", name: "Morgan Chen", email: "morgan@university.edu" },
        { id: "u5", name: "Jamie Kim", email: "jamie@university.edu" },
      ],
      maybe: [],
      not_going: []
    },
    is_paid: true,
    price: 15,
    community_id: "business-school",
    image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: "3",
    title: "International Students Potluck",
    description: "Bring a dish from your home country and join us for a night of cultural exchange and delicious food!",
    date_time: "2025-05-25T17:30:00",
    location: "International House, East Campus",
    capacity: 15,
    visibility: "public",
    host_id: "host3",
    host_name: "Ari Patel",
    attendees: [
      { id: "u7", name: "Quinn Zhang", email: "quinn@university.edu" },
      { id: "u8", name: "Robin Gupta", email: "robin@university.edu" },
      { id: "u9", name: "Cameron Silva", email: "cameron@university.edu" },
      { id: "u10", name: "Avery Nguyen", email: "avery@university.edu" },
    ],
    waitlist: [],
    attendees_by_status: {
      going: [
        { id: "u7", name: "Quinn Zhang", email: "quinn@university.edu" },
        { id: "u8", name: "Robin Gupta", email: "robin@university.edu" },
        { id: "u9", name: "Cameron Silva", email: "cameron@university.edu" },
        { id: "u10", name: "Avery Nguyen", email: "avery@university.edu" },
      ],
      maybe: [],
      not_going: []
    },
    is_paid: false,
    image: "https://images.unsplash.com/photo-1547573854-74d2a71d0826?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: "4",
    title: "Computer Science Study Group Dinner",
    description: "Ace your finals while enjoying pizza! We'll discuss algorithms, data structures, and more.",
    date_time: "2025-06-01T18:00:00",
    location: "Computer Science Building, Room 302",
    capacity: 12,
    visibility: "community",
    host_id: "host4",
    host_name: "Dr. Pat Johnson",
    attendees: [
      { id: "u11", name: "River Patel", email: "river@university.edu" },
      { id: "u12", name: "Dakota Wilson", email: "dakota@university.edu" },
    ],
    waitlist: [],
    attendees_by_status: {
      going: [
        { id: "u11", name: "River Patel", email: "river@university.edu" },
        { id: "u12", name: "Dakota Wilson", email: "dakota@university.edu" },
      ],
      maybe: [],
      not_going: []
    },
    is_paid: true,
    price: 10,
    community_id: "cs-department",
  },
  {
    id: "5",
    title: "LGBTQ+ Alliance Dinner",
    description: "Monthly dinner for LGBTQ+ students and allies. A safe space to connect and build community.",
    date_time: "2025-06-05T19:00:00",
    location: "Rainbow Cafe, West Campus",
    capacity: 20,
    visibility: "public",
    host_id: "host5",
    host_name: "Taylor Reed",
    attendees: [
      { id: "u13", name: "Jordan Harper", email: "jordan.h@university.edu" },
      { id: "u14", name: "Alex Martinez", email: "alex.m@university.edu" },
    ],
    waitlist: [],
    attendees_by_status: {
      going: [
        { id: "u13", name: "Jordan Harper", email: "jordan.h@university.edu" },
        { id: "u14", name: "Alex Martinez", email: "alex.m@university.edu" },
      ],
      maybe: [],
      not_going: []
    },
    is_paid: false,
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  }
];
