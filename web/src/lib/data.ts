export type Category = {
  slug: string;
  name: string;
  icon: string;
};

export const categories: Category[] = [
  { slug: "birthday", name: "Birthday", icon: "cake" },
  { slug: "wedding", name: "Wedding", icon: "heart-handshake" },
  { slug: "anniversary", name: "Anniversary", icon: "heart" },
  { slug: "cupcakes", name: "Cupcakes", icon: "cupcake" },
  { slug: "cookies", name: "Cookies", icon: "cookie" },
  { slug: "custom", name: "Custom Cakes", icon: "paintbrush" },
  { slug: "eggless", name: "Eggless", icon: "leaf" },
  { slug: "gluten-free", name: "Gluten-Free", icon: "wheat-off" },
];

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  flavor: string;
  price: number;
  rating: number;
  reviewCount: number;
  eggless: boolean;
  glutenFree: boolean;
  weights: { label: string; priceDelta: number }[];
  illustration: string;
  image: string;
  badge?: string;
};

export const products: Product[] = [
  {
    id: "p1",
    slug: "strawberry-delight",
    name: "Strawberry Delight",
    category: "birthday",
    description: "Light sponge, fresh strawberries, and whipped cream.",
    flavor: "Strawberry & Vanilla",
    price: 4.5,
    rating: 4.8,
    reviewCount: 132,
    eggless: true,
    glutenFree: false,
    weights: [
      { label: "0.5kg", priceDelta: 0 },
      { label: "1kg", priceDelta: 6 },
      { label: "1.5kg", priceDelta: 12 },
      { label: "2kg", priceDelta: 18 },
    ],
    illustration: "slice-berry",
    image: "/images/products/strawberry-delight.jpg",
  },
  {
    id: "p2",
    slug: "chocolate-dream",
    name: "Chocolate Dream",
    category: "birthday",
    description: "Rich chocolate layers with creamy ganache.",
    flavor: "Belgian Chocolate",
    price: 4.5,
    rating: 4.9,
    reviewCount: 214,
    eggless: false,
    glutenFree: false,
    weights: [
      { label: "0.5kg", priceDelta: 0 },
      { label: "1kg", priceDelta: 6 },
      { label: "1.5kg", priceDelta: 12 },
      { label: "2kg", priceDelta: 18 },
    ],
    illustration: "slice-choc",
    image: "/images/products/chocolate-dream.jpg",
    badge: "Bestseller",
  },
  {
    id: "p3",
    slug: "berry-bliss-cake",
    name: "Berry Bliss Cake",
    category: "anniversary",
    description: "Soft vanilla sponge with berry mousse & fresh berries.",
    flavor: "Mixed Berry",
    price: 4.5,
    rating: 4.7,
    reviewCount: 98,
    eggless: true,
    glutenFree: false,
    weights: [
      { label: "0.5kg", priceDelta: 0 },
      { label: "1kg", priceDelta: 6 },
      { label: "1.5kg", priceDelta: 12 },
      { label: "2kg", priceDelta: 18 },
    ],
    illustration: "whole-berry",
    image: "/images/products/berry-bliss-cake.jpg",
  },
  {
    id: "p4",
    slug: "special-of-the-day",
    name: "Special of the Day",
    category: "custom",
    description: "Baker's daily pick — a rotating seasonal favourite.",
    flavor: "Seasonal",
    price: 4.5,
    rating: 4.6,
    reviewCount: 51,
    eggless: false,
    glutenFree: false,
    weights: [
      { label: "0.5kg", priceDelta: 0 },
      { label: "1kg", priceDelta: 6 },
    ],
    illustration: "tart",
    image: "/images/products/special-of-the-day.jpg",
    badge: "Today Only",
  },
  {
    id: "p5",
    slug: "red-velvet-romance",
    name: "Red Velvet Romance",
    category: "wedding",
    description: "Classic red velvet with cream cheese frosting.",
    flavor: "Red Velvet",
    price: 5.2,
    rating: 4.9,
    reviewCount: 176,
    eggless: true,
    glutenFree: false,
    weights: [
      { label: "0.5kg", priceDelta: 0 },
      { label: "1kg", priceDelta: 7 },
      { label: "1.5kg", priceDelta: 14 },
      { label: "2kg", priceDelta: 21 },
    ],
    illustration: "slice-red-velvet",
    image: "/images/products/red-velvet-romance.jpg",
  },
  {
    id: "p6",
    slug: "salted-caramel-crunch",
    name: "Salted Caramel Crunch",
    category: "birthday",
    description: "Caramel sponge, salted caramel drip, toffee crunch.",
    flavor: "Salted Caramel",
    price: 5.0,
    rating: 4.8,
    reviewCount: 89,
    eggless: false,
    glutenFree: false,
    weights: [
      { label: "0.5kg", priceDelta: 0 },
      { label: "1kg", priceDelta: 6 },
      { label: "1.5kg", priceDelta: 12 },
    ],
    illustration: "slice-caramel",
    image: "/images/products/salted-caramel-crunch.jpg",
  },
  {
    id: "p7",
    slug: "eggless-vanilla-bean",
    name: "Eggless Vanilla Bean",
    category: "eggless",
    description: "Pure vanilla bean sponge, light buttercream.",
    flavor: "Vanilla Bean",
    price: 4.2,
    rating: 4.5,
    reviewCount: 64,
    eggless: true,
    glutenFree: false,
    weights: [
      { label: "0.5kg", priceDelta: 0 },
      { label: "1kg", priceDelta: 5 },
    ],
    illustration: "whole-vanilla",
    image: "/images/products/eggless-vanilla-bean.jpg",
  },
  {
    id: "p8",
    slug: "gluten-free-almond-cake",
    name: "Gluten-Free Almond Cake",
    category: "gluten-free",
    description: "Almond flour sponge with citrus glaze.",
    flavor: "Almond & Orange",
    price: 5.5,
    rating: 4.6,
    reviewCount: 42,
    eggless: false,
    glutenFree: true,
    weights: [
      { label: "0.5kg", priceDelta: 0 },
      { label: "1kg", priceDelta: 7 },
    ],
    illustration: "whole-citrus",
    image: "/images/products/gluten-free-almond-cake.jpg",
  },
  {
    id: "p9",
    slug: "classic-butter-cupcakes",
    name: "Classic Butter Cupcakes (Box of 6)",
    category: "cupcakes",
    description: "Buttery vanilla cupcakes with swirled frosting.",
    flavor: "Vanilla",
    price: 3.2,
    rating: 4.7,
    reviewCount: 120,
    eggless: false,
    glutenFree: false,
    weights: [{ label: "Box of 6", priceDelta: 0 }],
    illustration: "cupcake",
    image: "/images/products/classic-butter-cupcakes.jpg",
  },
  {
    id: "p10",
    slug: "double-choc-chip-cookies",
    name: "Double Choc Chip Cookies (Box of 8)",
    category: "cookies",
    description: "Chewy centre, crisp edge, loaded with chocolate chips.",
    flavor: "Chocolate Chip",
    price: 2.8,
    rating: 4.8,
    reviewCount: 205,
    eggless: false,
    glutenFree: false,
    weights: [{ label: "Box of 8", priceDelta: 0 }],
    illustration: "cookie",
    image: "/images/products/double-choc-chip-cookies.jpg",
  },
  {
    id: "p11",
    slug: "corporate-logo-cake",
    name: "Corporate Logo Cake",
    category: "custom",
    description: "Fully custom cake with edible print of your brand.",
    flavor: "Your Choice",
    price: 8.0,
    rating: 4.9,
    reviewCount: 33,
    eggless: false,
    glutenFree: false,
    weights: [
      { label: "1kg", priceDelta: 0 },
      { label: "2kg", priceDelta: 10 },
      { label: "3kg", priceDelta: 22 },
    ],
    illustration: "tiered-logo",
    image: "/images/products/corporate-logo-cake.jpg",
    badge: "Corporate",
  },
  {
    id: "p12",
    slug: "wedding-tiered-elegance",
    name: "Tiered Elegance",
    category: "wedding",
    description: "3-tier fondant wedding cake with sugar flowers.",
    flavor: "Vanilla & Chocolate Marble",
    price: 32.0,
    rating: 5.0,
    reviewCount: 27,
    eggless: false,
    glutenFree: false,
    weights: [
      { label: "3kg", priceDelta: 0 },
      { label: "5kg", priceDelta: 20 },
    ],
    illustration: "tiered-wedding",
    image: "/images/products/wedding-tiered-elegance.jpg",
    badge: "Premium",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, count = 4) {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, count);
}

export const addOns = [
  { id: "candles", name: "Candles", price: 1.5 },
  { id: "greeting-card", name: "Greeting Card", price: 2.0 },
  { id: "photo-cake", name: "Photo Print Topper", price: 3.5 },
  { id: "toppers", name: "Themed Toppers", price: 2.5 },
];

export const testimonials = [
  {
    name: "Ananya Rao",
    rating: 5,
    quote: "The Chocolate Dream cake was the highlight of my daughter's birthday party. Everyone asked where we ordered from!",
    product: "Chocolate Dream",
  },
  {
    name: "Marcus Webb",
    rating: 5,
    quote: "Ordered a custom logo cake for our office anniversary — the print quality and taste were both perfect.",
    product: "Corporate Logo Cake",
  },
  {
    name: "Priya Nair",
    rating: 4,
    quote: "Delivery was right on time and the cake was beautifully packaged. Will definitely order again.",
    product: "Berry Bliss Cake",
  },
  {
    name: "Devika Menon",
    rating: 5,
    quote: "Best eggless cake I've had. Soft, moist, and not overly sweet.",
    product: "Eggless Vanilla Bean",
  },
];

export type Order = {
  id: string;
  date: string;
  status: "Delivered" | "Out for Delivery" | "Baking" | "Confirmed" | "Cancelled";
  total: number;
  items: { name: string; illustration: string; image: string; qty: number }[];
};

export const orderHistory: Order[] = [
  {
    id: "BS482913",
    date: "2026-07-20",
    status: "Delivered",
    total: 24.5,
    items: [
      { name: "Chocolate Dream", illustration: "slice-choc", image: "/images/products/chocolate-dream.jpg", qty: 1 },
      { name: "Candles", illustration: "cupcake", image: "/images/products/classic-butter-cupcakes.jpg", qty: 1 },
    ],
  },
  {
    id: "BS471820",
    date: "2026-07-08",
    status: "Delivered",
    total: 12.8,
    items: [{ name: "Double Choc Chip Cookies (Box of 8)", illustration: "cookie", image: "/images/products/double-choc-chip-cookies.jpg", qty: 1 }],
  },
  {
    id: "BS460213",
    date: "2026-06-22",
    status: "Cancelled",
    total: 9.0,
    items: [{ name: "Classic Butter Cupcakes (Box of 6)", illustration: "cupcake", image: "/images/products/classic-butter-cupcakes.jpg", qty: 1 }],
  },
];
