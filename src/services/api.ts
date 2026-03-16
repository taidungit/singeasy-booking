import shop1Img from "@/assets/shop-1.jpg";
import shop2Img from "@/assets/shop-2.jpg";
import shop3Img from "@/assets/shop-3.jpg";
import roomBlueImg from "@/assets/room-blue.jpg";
import roomVipImg from "@/assets/room-vip.jpg";
import roomCozyImg from "@/assets/room-cozy.jpg";
import roomGallery1Img from "@/assets/room-gallery-1.jpg";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Shop {
  id: string;
  name: string;
  address: string;
  location: string;
  rating: number;
  reviewCount: number;
  priceFrom: number;
  image: string;
  tags: string[];
  description: string;
  openHours: string;
  phone: string;
}

export interface Room {
  id: string;
  shopId: string;
  name: string;
  capacity: string;
  pricePerHour: number;
  image: string;
  available: boolean;
  amenities: string[];
}

export interface Booking {
  id: string;
  shopId: string;
  shopName: string;
  roomId: string;
  roomName: string;
  date: string;
  startTime: string;
  hours: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}

export interface Review {
  id: string;
  shopId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const SHOPS: Shop[] = [
  {
    id: "1",
    name: "Echo Shibuya",
    address: "2-3-1 Dogenzaka, Shibuya City, Tokyo",
    location: "Tokyo",
    rating: 4.9,
    reviewCount: 248,
    priceFrom: 25,
    image: shop1Img,
    tags: ["Premium", "VIP Rooms", "Bar Service"],
    description:
      "Tokyo's most acclaimed karaoke destination. Eight meticulously designed private rooms with state-of-the-art acoustics, a curated cocktail bar, and song libraries spanning 80,000+ titles.",
    openHours: "Mon–Sun: 12:00 PM – 5:00 AM",
    phone: "+81 3-1234-5678",
  },
  {
    id: "2",
    name: "Melody House",
    address: "15 Orchard Road, Singapore",
    location: "Singapore",
    rating: 4.7,
    reviewCount: 182,
    priceFrom: 18,
    image: shop2Img,
    tags: ["Family-Friendly", "Snack Menu", "HD Screens"],
    description:
      "A welcoming karaoke venue in the heart of Orchard, perfect for families and groups. Spacious rooms with modern equipment and a wide selection of Asian and Western hits.",
    openHours: "Mon–Sun: 11:00 AM – 2:00 AM",
    phone: "+65 6234-5678",
  },
  {
    id: "3",
    name: "Noir Sessions",
    address: "88 Itaewon-ro, Yongsan-gu, Seoul",
    location: "Seoul",
    rating: 4.8,
    reviewCount: 311,
    priceFrom: 30,
    image: shop3Img,
    tags: ["Luxury", "Late Night", "K-Pop Specials"],
    description:
      "Seoul's most sophisticated late-night karaoke lounge. Dark, atmospheric interiors with premium sound systems, a curated spirits menu, and exclusive K-Pop performance packages.",
    openHours: "Wed–Sun: 6:00 PM – 6:00 AM",
    phone: "+82 2-3456-7890",
  },
  {
    id: "4",
    name: "Studio Serenade",
    address: "45 Queen St, Melbourne VIC 3000",
    location: "Melbourne",
    rating: 4.6,
    reviewCount: 134,
    priceFrom: 22,
    image: shop1Img,
    tags: ["Rooftop", "All-Inclusive", "Birthday Packages"],
    description:
      "Melbourne's hidden gem for karaoke enthusiasts. Rooftop terrace access, all-inclusive snack packages, and dedicated birthday celebration setups available.",
    openHours: "Tue–Sun: 5:00 PM – 1:00 AM",
    phone: "+61 3-9012-3456",
  },
  {
    id: "5",
    name: "Vocal Vault",
    address: "321 Sukhumvit Rd, Bangkok",
    location: "Bangkok",
    rating: 4.5,
    reviewCount: 97,
    priceFrom: 15,
    image: shop2Img,
    tags: ["Budget Friendly", "Group Deals", "Thai Songs"],
    description:
      "The best value karaoke experience in Bangkok. Bright, clean rooms with a vast selection of Thai, English, Chinese, and Japanese songs. Perfect for large groups.",
    openHours: "Mon–Sun: 10:00 AM – 3:00 AM",
    phone: "+66 2-123-4567",
  },
  {
    id: "6",
    name: "Amplify NYC",
    address: "240 W 36th St, New York, NY",
    location: "New York",
    rating: 4.7,
    reviewCount: 204,
    priceFrom: 35,
    image: shop3Img,
    tags: ["Cocktail Bar", "Hip-Hop", "Corporate Events"],
    description:
      "Midtown Manhattan's premier private karaoke venue. Twelve private rooms, a full cocktail bar, and a song catalogue of 100,000+ tracks spanning every genre.",
    openHours: "Mon–Sun: 5:00 PM – 4:00 AM",
    phone: "+1 212-345-6789",
  },
];

const ROOMS: Room[] = [
  { id: "r1", shopId: "1", name: "Sapphire Suite", capacity: "2–4", pricePerHour: 25, image: roomBlueImg, available: true, amenities: ["HD Screen", "Premium Sound", "iPad Controller", "Snack Menu"] },
  { id: "r2", shopId: "1", name: "Gold VIP Hall", capacity: "8–15", pricePerHour: 80, image: roomVipImg, available: true, amenities: ["4K Projector", "Pro Sound System", "Bar Service", "Dedicated Host", "Food Menu"] },
  { id: "r3", shopId: "1", name: "Rose Studio", capacity: "2–3", pricePerHour: 20, image: roomCozyImg, available: false, amenities: ["Smart TV", "Wireless Mic", "Snack Menu"] },
  { id: "r4", shopId: "1", name: "Teal Chamber", capacity: "4–8", pricePerHour: 45, image: roomGallery1Img, available: true, amenities: ["HD Screen", "Surround Sound", "iPad Controller", "Snack Menu"] },
  { id: "r5", shopId: "2", name: "Indigo Room", capacity: "2–4", pricePerHour: 18, image: roomBlueImg, available: true, amenities: ["HD Screen", "Wireless Mic", "Snack Menu"] },
  { id: "r6", shopId: "2", name: "Grand Hall", capacity: "10–20", pricePerHour: 70, image: roomVipImg, available: true, amenities: ["Projector", "Pro Sound", "Buffet Service"] },
  { id: "r7", shopId: "3", name: "Midnight Suite", capacity: "4–6", pricePerHour: 35, image: roomGallery1Img, available: true, amenities: ["OLED Display", "Premium Sound", "Cocktail Service"] },
  { id: "r8", shopId: "3", name: "Noir VIP", capacity: "8–12", pricePerHour: 95, image: roomVipImg, available: true, amenities: ["4K Projector", "Dolby Sound", "Private Bar", "Butler Service"] },
];

const BOOKINGS: Booking[] = [
  { id: "b1", shopId: "1", shopName: "Echo Shibuya", roomId: "r1", roomName: "Sapphire Suite", date: "2026-03-20", startTime: "19:00", hours: 2, totalPrice: 50, status: "confirmed", createdAt: "2026-03-10T10:00:00Z" },
  { id: "b2", shopId: "2", shopName: "Melody House", roomId: "r5", roomName: "Indigo Room", date: "2026-03-25", startTime: "20:00", hours: 3, totalPrice: 54, status: "pending", createdAt: "2026-03-12T14:30:00Z" },
  { id: "b3", shopId: "1", shopName: "Echo Shibuya", roomId: "r2", roomName: "Gold VIP Hall", date: "2026-02-14", startTime: "21:00", hours: 4, totalPrice: 320, status: "confirmed", createdAt: "2026-02-01T09:00:00Z" },
  { id: "b4", shopId: "3", shopName: "Noir Sessions", roomId: "r7", roomName: "Midnight Suite", date: "2026-01-28", startTime: "22:00", hours: 2, totalPrice: 70, status: "cancelled", createdAt: "2026-01-20T18:00:00Z" },
];

const REVIEWS: Review[] = [
  { id: "rv1", shopId: "1", userId: "u1", userName: "Jamie L.", rating: 5, comment: "Absolutely stunning rooms and incredible sound quality. The Gold VIP Hall was worth every penny for our group of 10. Highly recommend!", createdAt: "2026-03-01T10:00:00Z" },
  { id: "rv2", shopId: "1", userId: "u2", userName: "Priya M.", rating: 5, comment: "The Sapphire Suite was perfect for a date night. Staff were incredibly attentive, drinks arrived fast, and the song selection is enormous.", createdAt: "2026-02-20T18:30:00Z" },
  { id: "rv3", shopId: "1", userId: "u3", userName: "Chris T.", rating: 4, comment: "Great experience overall. The room was clean, sound system was excellent. Only minor issue was a slight wait at check-in. Would come back!", createdAt: "2026-02-15T21:00:00Z" },
  { id: "rv4", shopId: "1", userId: "u4", userName: "Sofia R.", rating: 5, comment: "Best karaoke venue in Tokyo without a doubt. The atmosphere, the music library, the cocktails — everything was top tier. Already booked again.", createdAt: "2026-02-10T20:00:00Z" },
  { id: "rv5", shopId: "2", userId: "u5", userName: "David K.", rating: 5, comment: "Perfect family outing. Kids loved it and the snack menu was amazing. Rooms are clean and well-maintained.", createdAt: "2026-03-05T15:00:00Z" },
];

// ─── API Functions ────────────────────────────────────────────────────────────

export const fetchShops = async (params?: {
  query?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  capacity?: string;
}): Promise<Shop[]> => {
  await delay(600);
  let results = [...SHOPS];
  if (params?.query) {
    const q = params.query.toLowerCase();
    results = results.filter(
      (s) => s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)
    );
  }
  if (params?.location && params.location !== "all") {
    results = results.filter((s) => s.location.toLowerCase().includes(params.location!.toLowerCase()));
  }
  if (params?.minPrice) results = results.filter((s) => s.priceFrom >= params.minPrice!);
  if (params?.maxPrice) results = results.filter((s) => s.priceFrom <= params.maxPrice!);
  if (params?.minRating) results = results.filter((s) => s.rating >= params.minRating!);
  return results;
};

export const fetchShopById = async (id: string): Promise<Shop | null> => {
  await delay(400);
  return SHOPS.find((s) => s.id === id) ?? null;
};

export const fetchRoomsByShop = async (shopId: string): Promise<Room[]> => {
  await delay(400);
  return ROOMS.filter((r) => r.shopId === shopId);
};

export const createBooking = async (data: Omit<Booking, "id" | "createdAt">): Promise<Booking> => {
  await delay(800);
  return {
    ...data,
    id: `b${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
};

export const fetchUserBookings = async (): Promise<Booking[]> => {
  await delay(600);
  return BOOKINGS;
};

export const cancelBooking = async (id: string): Promise<void> => {
  await delay(500);
  const b = BOOKINGS.find((b) => b.id === id);
  if (b) b.status = "cancelled";
};

export const fetchReviews = async (shopId: string): Promise<Review[]> => {
  await delay(400);
  return REVIEWS.filter((r) => r.shopId === shopId);
};

export const createReview = async (data: Omit<Review, "id" | "createdAt">): Promise<Review> => {
  await delay(600);
  return { ...data, id: `rv${Date.now()}`, createdAt: new Date().toISOString() };
};

export const getFeaturedShops = async (): Promise<Shop[]> => {
  await delay(500);
  return SHOPS.slice(0, 4);
};
