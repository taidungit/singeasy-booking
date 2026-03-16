import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Clock, Phone, Star, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchShopById, fetchRoomsByShop, fetchReviews } from "@/services/api";
import type { Shop, Room, Review } from "@/services/api";
import RoomCard from "@/components/shop/RoomCard";
import ReviewList from "@/components/shop/ReviewList";
import RatingStars from "@/components/shared/RatingStars";
import BookingForm from "@/components/booking/BookingForm";
import roomBlueImg from "@/assets/room-blue.jpg";
import roomVipImg from "@/assets/room-vip.jpg";
import roomCozyImg from "@/assets/room-cozy.jpg";
import roomGallery1Img from "@/assets/room-gallery-1.jpg";

const GALLERY_IMGS = [roomBlueImg, roomVipImg, roomCozyImg, roomGallery1Img];

const ShopDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shop, setShop] = useState<Shop | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"rooms" | "reviews">("rooms");

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetchShopById(id),
      fetchRoomsByShop(id),
      fetchReviews(id),
    ]).then(([shopData, roomsData, reviewsData]) => {
      setShop(shopData);
      setRooms(roomsData);
      setReviews(reviewsData);
    }).finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="skeleton h-[400px] rounded-3xl" />
        <div className="skeleton h-8 w-64 rounded" />
        <div className="skeleton h-4 w-48 rounded" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-xl font-semibold mb-2">Venue not found</h2>
        <Button onClick={() => navigate("/shops")}>Back to search</Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All venues
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Gallery grid */}
        <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[360px] sm:h-[480px] rounded-3xl overflow-hidden mb-8">
          <div className="col-span-2 row-span-2">
            <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
          </div>
          {GALLERY_IMGS.slice(0, 4).map((img, i) => (
            <div key={i} className="overflow-hidden">
              <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <header className="mb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {shop.tags.map((tag) => (
                  <span key={tag} className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-3">{shop.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />{shop.address}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />{shop.openHours}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />{shop.phone}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <RatingStars rating={shop.rating} size="md" />
                <span className="font-bold text-foreground">{shop.rating}</span>
                <span className="text-muted-foreground text-sm">({shop.reviewCount} reviews)</span>
              </div>
            </header>

            <p className="text-muted-foreground leading-relaxed mb-8">{shop.description}</p>

            {/* Tabs */}
            <div className="flex border-b border-border mb-6">
              {["rooms", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className={`px-4 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "rooms" ? `Rooms (${rooms.length})` : `Reviews (${reviews.length})`}
                </button>
              ))}
            </div>

            {activeTab === "rooms" && (
              <div className="space-y-4">
                {rooms.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No rooms listed for this venue.</p>
                ) : (
                  rooms.map((room) => (
                    <RoomCard key={room.id} room={room} shopId={shop.id} shopName={shop.name} />
                  ))
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <ReviewList
                reviews={reviews}
                shopId={shop.id}
                onReviewAdded={(review) => setReviews((prev) => [review, ...prev])}
              />
            )}
          </div>

          {/* Sticky booking sidebar */}
          <aside>
            <div className="sticky top-24 bg-background card-shadow-elevated rounded-2xl p-6 border border-border">
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-2xl font-bold text-foreground">${shop.priceFrom}</span>
                <span className="text-sm text-muted-foreground">/ hour</span>
              </div>
              <div className="flex items-center gap-1.5 mb-6">
                <RatingStars rating={shop.rating} size="sm" />
                <span className="text-sm text-muted-foreground">{shop.reviewCount} reviews</span>
              </div>

              {rooms.filter((r) => r.available).length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-sm">No rooms currently available.</p>
                </div>
              ) : (
                <>
                  <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                    Select a room to book
                  </p>
                  <div className="space-y-2 mb-4 max-h-52 overflow-y-auto">
                    {rooms.filter((r) => r.available).map((room) => (
                      <RoomCard key={room.id} room={room} shopId={shop.id} shopName={shop.name} />
                    ))}
                  </div>
                  <BookingForm />
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
