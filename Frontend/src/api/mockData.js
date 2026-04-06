export const categories = [
  { _id: "cat_makeup", name: "Makeup", slug: "makeup" },
  { _id: "cat_skincare", name: "Skincare", slug: "skincare" },
  { _id: "cat_haircare", name: "Haircare", slug: "haircare" },
  { _id: "cat_fragrance", name: "Fragrance", slug: "fragrance" },
  { _id: "cat_tools", name: "Tools", slug: "tools" },
];

export const products = [
  {
    _id: "p1",
    title: "Velvet Matte Lipstick",
    brand: "GlowMuse",
    category: "makeup",
    price: 1799,
    stock: 22,
    rating: 4.6,
    reviewCount: 128,
    shortDesc: "Comfortable matte finish with rich pigment.",
    description:
      "A long-wear velvet matte lipstick that glides smoothly and stays comfortable for hours. Perfect for daily wear and special occasions.",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=70",
      "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=900&q=70",
    ],
    featured: true,
  },
  {
    _id: "p2",
    title: "Hydra Boost Serum",
    brand: "DermaPure",
    category: "skincare",
    price: 2499,
    stock: 15,
    rating: 4.7,
    reviewCount: 94,
    shortDesc: "Hyaluronic hydration for plump, fresh skin.",
    description:
      "Lightweight hyaluronic serum that absorbs fast and provides deep hydration. Helps improve texture and glow without feeling sticky.",
    images: [
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=70",
      "https://images.unsplash.com/photo-1585232351009-aa87416fca90?auto=format&fit=crop&w=900&q=70",
    ],
    featured: true,
  },
  {
    _id: "p3",
    title: "Silk Shine Shampoo",
    brand: "HairLuxe",
    category: "haircare",
    price: 1399,
    stock: 33,
    rating: 4.4,
    reviewCount: 61,
    shortDesc: "Smooth, frizz-control cleanse for daily use.",
    description:
      "A gentle shampoo infused with plant proteins for silky shine. Helps reduce frizz and maintain a healthy scalp balance.",
    images: [
      "https://images.unsplash.com/photo-1615396899839-c99c121888b0?auto=format&fit=crop&w=900&q=70",
      "https://images.unsplash.com/photo-1615397349754-cfa2066a298b?auto=format&fit=crop&w=900&q=70",
    ],
    featured: false,
  },
  {
    _id: "p4",
    title: "Rose Mist Toner",
    brand: "Botanica",
    category: "skincare",
    price: 1199,
    stock: 0,
    rating: 4.2,
    reviewCount: 39,
    shortDesc: "Refreshing mist toner for instant calm.",
    description:
      "A soothing rose toner mist to refresh, tone, and calm skin throughout the day. Great for post-cleanse or mid-day hydration.",
    images: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=70",
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=900&q=70",
    ],
    featured: false,
  },
  {
    _id: "p5",
    title: "Eau de Parfum — Amber Bloom",
    brand: "Sillage",
    category: "fragrance",
    price: 4999,
    stock: 9,
    rating: 4.8,
    reviewCount: 212,
    shortDesc: "Warm amber with soft floral notes.",
    description:
      "A balanced amber fragrance with floral top notes and a cozy woody dry-down. Designed for day-to-night wear.",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=70",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=70",
    ],
    featured: true,
  },
  {
    _id: "p6",
    title: "Pro Blender Sponge Set",
    brand: "StudioTools",
    category: "tools",
    price: 899,
    stock: 40,
    rating: 4.5,
    reviewCount: 73,
    shortDesc: "Soft blending sponges for flawless base.",
    description:
      "A set of ultra-soft blender sponges to apply foundation, concealer, and cream products seamlessly. Latex-free and washable.",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=70",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=70",
    ],
    featured: false,
  },
];
