export type AdminOrder = {
  id: string;
  customer: string;
  email: string;
  items: { name: string; qty: number; customization?: string; image: string }[];
  total: number;
  deliveryDate: string;
  deliverySlot: string;
  status: "Pending" | "Confirmed" | "Baking" | "Out for Delivery" | "Delivered" | "Cancelled";
  paymentStatus: "Paid" | "Pending" | "Refunded" | "COD";
  paymentMethod: string;
  deliveryType: "Delivery" | "Pickup";
  rider?: string;
  address: string;
  zone: string;
  placedAt: string;
  auditTrail: { at: string; event: string }[];
};

const statuses: AdminOrder["status"][] = [
  "Pending",
  "Confirmed",
  "Baking",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const customers = [
  "Ananya Rao",
  "Marcus Webb",
  "Priya Nair",
  "Devika Menon",
  "Rahul Iyer",
  "Sara Thomas",
  "Kabir Malhotra",
  "Fatima Sheikh",
  "James Carter",
  "Neha Gupta",
];

const zones = ["Downtown", "Riverside", "Uptown", "Suburbs North", "Suburbs South"];
const riders = ["Vikram S.", "Ali H.", "Tomás R.", "Priyanka D.", "Unassigned"];
const cakeImages = [
  "/images/products/chocolate-dream.jpg",
  "/images/products/strawberry-delight.jpg",
  "/images/products/red-velvet-romance.jpg",
  "/images/products/berry-bliss-cake.jpg",
  "/images/products/salted-caramel-crunch.jpg",
  "/images/products/classic-butter-cupcakes.jpg",
  "/images/products/double-choc-chip-cookies.jpg",
  "/images/products/wedding-tiered-elegance.jpg",
];

export const adminOrders: AdminOrder[] = Array.from({ length: 24 }).map((_, i) => {
  const status = statuses[i % statuses.length];
  const customer = customers[i % customers.length];
  const zone = zones[i % zones.length];
  const total = 18 + ((i * 7) % 60) + 4.5;
  return {
    id: `BS${480000 + i * 37}`,
    customer,
    email: `${customer.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    items: [
      {
        name: ["Chocolate Dream", "Red Velvet Romance", "Strawberry Delight", "Berry Bliss Cake"][i % 4],
        qty: 1 + (i % 2),
        customization: i % 3 === 0 ? `"Happy Birthday ${customer.split(" ")[0]}!"` : undefined,
        image: cakeImages[i % cakeImages.length],
      },
    ],
    total,
    deliveryDate: `2026-07-${String(20 + (i % 8)).padStart(2, "0")}`,
    deliverySlot: ["Standard (2-6pm)", "Express (within 3 hrs)", "Midnight Delivery"][i % 3],
    status,
    paymentStatus: status === "Cancelled" ? "Refunded" : i % 5 === 0 ? "COD" : "Paid",
    paymentMethod: ["Card", "UPI", "COD", "Wallet"][i % 4],
    deliveryType: i % 6 === 0 ? "Pickup" : "Delivery",
    rider: status === "Out for Delivery" || status === "Delivered" ? riders[i % riders.length] : undefined,
    address: `${100 + i} Confection Lane, ${zone}`,
    zone,
    placedAt: `2026-07-${String(18 + (i % 8)).padStart(2, "0")} ${9 + (i % 10)}:${i % 2 === 0 ? "00" : "30"} AM`,
    auditTrail: [
      { at: `2026-07-${String(18 + (i % 8)).padStart(2, "0")} 09:00`, event: "Order placed" },
      { at: `2026-07-${String(18 + (i % 8)).padStart(2, "0")} 09:05`, event: "Payment confirmed" },
      ...(status !== "Pending" ? [{ at: `2026-07-${String(18 + (i % 8)).padStart(2, "0")} 10:30`, event: "Order confirmed by baker" }] : []),
    ],
  };
});

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joined: string;
  orders: number;
  ltv: number;
  loyaltyPoints: number;
  tags: string[];
  blocked: boolean;
  addresses: string[];
};

export const adminCustomers: AdminCustomer[] = customers.map((name, i) => ({
  id: `CU${1000 + i}`,
  name,
  email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
  phone: `+1 555 0${100 + i * 3}`,
  joined: `2025-${String(1 + (i % 12)).padStart(2, "0")}-14`,
  orders: 2 + (i % 12),
  ltv: 80 + i * 23.5,
  loyaltyPoints: 40 + i * 35,
  tags: i % 3 === 0 ? ["VIP"] : i % 4 === 0 ? ["At risk"] : [],
  blocked: i === 8,
  addresses: [`${100 + i} Confection Lane, ${zones[i % zones.length]}`],
}));

export const coupons = [
  { code: "SWEET10", type: "Percent" as const, value: 10, minOrder: 20, uses: 234, limit: 500, expiry: "2026-08-31", firstOrderOnly: false, active: true },
  { code: "WELCOME15", type: "Percent" as const, value: 15, minOrder: 0, uses: 512, limit: 1000, expiry: "2026-12-31", firstOrderOnly: true, active: true },
  { code: "FREESHIP", type: "Flat" as const, value: 3.5, minOrder: 15, uses: 98, limit: 200, expiry: "2026-08-15", firstOrderOnly: false, active: true },
  { code: "SUMMER25", type: "Percent" as const, value: 25, minOrder: 40, uses: 500, limit: 500, expiry: "2026-06-30", firstOrderOnly: false, active: false },
];

export const banners = [
  { id: "b1", title: "Summer Cake Sale", subtitle: "20% off all birthday cakes through August", link: "/shop?category=birthday", live: true, active: true, start: "2026-07-01", end: "2026-08-31" },
  { id: "b2", title: "Custom Wedding Cakes", subtitle: "Book a tasting session for your big day", link: "/custom-cake-builder", live: true, active: true, start: "2026-06-01", end: "2026-09-30" },
  { id: "b3", title: "Corporate Gifting", subtitle: "Bulk orders with branded packaging", link: "/corporate", live: false, active: false, start: "2026-08-01", end: "2026-09-15" },
];

export const campaigns = [
  { id: "c1", name: "Abandoned Cart Recovery", channel: "Email", audience: "Cart abandoners (7d)", sent: 1240, opened: 512, clicked: 88, conversions: 34, status: "Active" },
  { id: "c2", name: "Birthday Month Reminder", channel: "SMS", audience: "Birthday this month", sent: 340, opened: 340, clicked: 61, conversions: 22, status: "Active" },
  { id: "c3", name: "Winback — 60 Days Inactive", channel: "Email", audience: "No order in 60 days", sent: 890, opened: 210, clicked: 34, conversions: 9, status: "Scheduled" },
];

export const reviewsQueue = [
  { id: "r1", product: "Chocolate Dream", customer: "Ananya Rao", rating: 5, text: "Absolutely delicious, will order again!", status: "Pending", photo: true },
  { id: "r2", product: "Red Velvet Romance", customer: "Sara Thomas", rating: 4, text: "Great taste, delivery was a bit late.", status: "Pending", photo: false },
  { id: "r3", product: "Corporate Logo Cake", customer: "James Carter", rating: 5, text: "Perfect for our office event.", status: "Approved", photo: true },
  { id: "r4", product: "Strawberry Delight", customer: "Neha Gupta", rating: 2, text: "Cake arrived slightly melted.", status: "Pending", photo: true },
];

export const blogPosts = [
  { id: "bp1", title: "5 Tips for Storing Your Cake Overnight", status: "Published", date: "2026-07-10", author: "Bakestudio Team" },
  { id: "bp2", title: "Choosing the Right Cake for a Summer Wedding", status: "Published", date: "2026-06-22", author: "Bakestudio Team" },
  { id: "bp3", title: "Behind the Scenes: A Day in Our Kitchen", status: "Draft", date: "—", author: "Bakestudio Team" },
];

export const faqEntries = [
  { id: "f1", category: "Ordering", question: "How far in advance should I order a custom cake?", answer: "At least 48 hours ahead for custom designs." },
  { id: "f2", category: "Delivery", question: "Do you deliver same-day?", answer: "Yes, for orders placed before 2pm in serviceable areas." },
  { id: "f3", category: "Payments", question: "Do you accept Cash on Delivery?", answer: "Yes, COD is available in select zones." },
];

export const deliveryZones = [
  { id: "z1", name: "Downtown", fee: 2.5, serviceable: true, cutoff: "6:00 PM" },
  { id: "z2", name: "Riverside", fee: 3.0, serviceable: true, cutoff: "5:00 PM" },
  { id: "z3", name: "Uptown", fee: 3.5, serviceable: true, cutoff: "5:00 PM" },
  { id: "z4", name: "Suburbs North", fee: 5.0, serviceable: true, cutoff: "3:00 PM" },
  { id: "z5", name: "Suburbs South", fee: 5.0, serviceable: false, cutoff: "—" },
];

export const timeSlots = [
  { id: "t1", slot: "10am - 2pm", label: "10am - 2pm", surcharge: 0, capacity: 40, booked: 22, active: true },
  { id: "t2", slot: "2pm - 6pm", label: "2pm - 6pm", surcharge: 0, capacity: 40, booked: 35, active: true },
  { id: "t3", slot: "Express (3 hrs)", label: "Express (3 hrs)", surcharge: 3, capacity: 15, booked: 9, active: true },
  { id: "t4", slot: "Midnight Delivery", label: "Midnight Delivery", surcharge: 5, capacity: 10, booked: 10, active: false },
];

export const ridersList = [
  { id: "rd1", name: "Vikram S.", zone: "Downtown", vehicle: "Bike", phone: "+91 98765 11001", deliveries: 340, deliveriesToday: 6, rating: 4.9, status: "Available" },
  { id: "rd2", name: "Ali H.", zone: "Riverside", vehicle: "Scooter", phone: "+91 98765 11002", deliveries: 290, deliveriesToday: 4, rating: 4.8, status: "Available" },
  { id: "rd3", name: "Tomás R.", zone: "Uptown", vehicle: "Bike", phone: "+91 98765 11003", deliveries: 210, deliveriesToday: 0, rating: 4.7, status: "Off Duty" },
  { id: "rd4", name: "Priyanka D.", zone: "Suburbs North", vehicle: "Van", phone: "+91 98765 11004", deliveries: 175, deliveriesToday: 3, rating: 4.9, status: "Available" },
];

export const transactions = Array.from({ length: 10 }).map((_, i) => ({
  id: `TXN${900000 + i}`,
  orderId: adminOrders[i].id,
  amount: adminOrders[i].total,
  method: adminOrders[i].paymentMethod,
  status: i % 7 === 0 ? "Refunded" : "Success",
  date: adminOrders[i].placedAt,
}));

export const adminUsers = [
  { id: "u1", name: "Owais Bhat", email: "owais@bakestudio.com", role: "Super Admin", lastActive: "Just now" },
  { id: "u2", name: "Meera Kapoor", email: "meera@bakestudio.com", role: "Order Manager", lastActive: "2 hours ago" },
  { id: "u3", name: "Chef Antoine", email: "antoine@bakestudio.com", role: "Baker / Kitchen Staff", lastActive: "1 hour ago" },
  { id: "u4", name: "Liam Fischer", email: "liam@bakestudio.com", role: "Delivery Coordinator", lastActive: "5 hours ago" },
  { id: "u5", name: "Divya Rao", email: "divya@bakestudio.com", role: "Marketing", lastActive: "Yesterday" },
];

export const auditLog = [
  { time: "2026-07-27 09:12", user: "Meera Kapoor", action: "Updated order BS480037 status to Baking" },
  { time: "2026-07-27 08:45", user: "Owais Bhat", action: "Created coupon SUMMER25" },
  { time: "2026-07-26 17:20", user: "Divya Rao", action: "Published blog post 'Choosing the Right Cake for a Summer Wedding'" },
  { time: "2026-07-26 14:02", user: "Liam Fischer", action: "Assigned rider Vikram S. to zone Downtown" },
];

export const kitchenQueue = adminOrders
  .filter((o) => o.status === "Confirmed" || o.status === "Baking")
  .map((o) => ({
    id: o.id,
    time: o.deliverySlot,
    items: o.items,
    status: o.status === "Baking" ? "In Progress" : "Not Started",
  }));

export const dashboardStats = {
  revenueToday: 1842.5,
  revenueChangePct: 12.4,
  ordersToday: 37,
  ordersChangePct: 8.1,
  avgOrderValue: 49.8,
  avgOrderChangePct: -2.3,
  newCustomersToday: 9,
  newCustomersChangePct: 15.0,
};

export const salesTrend = [420, 510, 380, 610, 700, 640, 890];
export const orderStatusBreakdown = [
  { label: "Delivered", value: 62, color: "#6B3A2F" },
  { label: "Baking", value: 14, color: "#E7B6A4" },
  { label: "Out for Delivery", value: 10, color: "#C98A3B" },
  { label: "Pending", value: 8, color: "#D9636B" },
  { label: "Cancelled", value: 6, color: "#7A6459" },
];
export const topProducts = [
  { name: "Chocolate Dream", sold: 214, revenue: 963 },
  { name: "Red Velvet Romance", sold: 176, revenue: 915 },
  { name: "Strawberry Delight", sold: 132, revenue: 594 },
  { name: "Double Choc Chip Cookies", sold: 205, revenue: 574 },
];
export const lowStock = [
  { name: "Fondant (White) — 5kg", current: 2, threshold: 5, unit: "kg" },
  { name: "Edible Gold Leaf", current: 6, threshold: 10, unit: "sheets" },
  { name: "Red Velvet Mix", current: 4, threshold: 8, unit: "kg" },
];
