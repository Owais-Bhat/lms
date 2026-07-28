// Non-product admin content. Orders, customers, transactions, staff, and
// dashboard stats are derived live from Supabase (see order-store.ts,
// products-store.ts, and the admin pages that read them) rather than
// hardcoded here. The lists below have no real backing data source yet
// (no coupons/banners/campaigns/reviews/blog/FAQ/zones/riders/time-slots
// tables exist), so they start empty instead of showing fake demo content.

export const coupons: {
  code: string;
  type: "Percent" | "Flat";
  value: number;
  minOrder: number;
  uses: number;
  limit: number;
  expiry: string;
  firstOrderOnly: boolean;
  active: boolean;
}[] = [];

export const banners: {
  id: string;
  title: string;
  subtitle: string;
  link: string;
  live: boolean;
  active: boolean;
  start: string;
  end: string;
}[] = [];

export const campaigns: {
  id: string;
  name: string;
  channel: string;
  audience: string;
  sent: number;
  opened: number;
  clicked: number;
  conversions: number;
  status: string;
}[] = [];

export const reviewsQueue: {
  id: string;
  product: string;
  customer: string;
  rating: number;
  text: string;
  status: "Pending" | "Approved" | "Rejected";
  photo: boolean;
}[] = [];

export const blogPosts: {
  id: string;
  title: string;
  status: "Published" | "Draft";
  date: string;
  author: string;
}[] = [];

export const faqEntries: {
  id: string;
  category: string;
  question: string;
  answer: string;
}[] = [];

export const deliveryZones: {
  id: string;
  name: string;
  fee: number;
  serviceable: boolean;
  cutoff: string;
}[] = [];

export const timeSlots: {
  id: string;
  slot: string;
  label: string;
  surcharge: number;
  capacity: number;
  booked: number;
  active: boolean;
}[] = [];

export const ridersList: {
  id: string;
  name: string;
  zone: string;
  vehicle: string;
  phone: string;
  deliveries: number;
  deliveriesToday: number;
  rating: number;
  status: string;
}[] = [];
