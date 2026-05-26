import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import RatingStars from "@/components/shared/RatingStars";
import { Button } from "@/components/ui/button";
import { createReview, getReviewsByShop } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Review } from "@/services/api";

interface ReviewListProps {
  reviews: Review[]; 
  shopId: string;
  onReviewAdded?: (review: Review) => void;
}

const ReviewList = ({ reviews, shopId, onReviewAdded }: ReviewListProps) => {
  const { state: authState } = useAuth();
  const { toast } = useToast();
  
  // Quản lý danh sách review cục bộ và trạng thái loading dữ liệu ban đầu
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Tự động gọi API lấy danh sách review khi shopId thay đổi hoặc khi component mount
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoadingData(true);
      try {
        const data = await getReviewsByShop(shopId);
        setLocalReviews(data);
      } catch (error) {
        toast({ 
          title: "Failed to load reviews", 
          description: "Could not fetch reviews for this shop.",
          variant: "destructive" 
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    if (shopId) {
      fetchReviews();
    }
  }, [shopId, toast]);

  // Xử lý gửi review mới lên hệ thống
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setIsSubmitting(true);
    
    try {
      const newReview = await createReview({
        shopId,
        rating,
        comment,
      });

      // Đẩy review mới vừa tạo lên đầu danh sách hiển thị
      setLocalReviews((prev) => [newReview, ...prev]);
      
      // Reset form trạng thái ban đầu
      setComment("");
      setRating(5);
      setShowForm(false);
      
      toast({ title: "Review submitted!", description: "Thank you for your feedback." });
    } catch {
      toast({ title: "Failed to submit review", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tính toán số sao trung bình dựa trên localReviews
  const avgRating = localReviews.length
    ? localReviews.reduce((sum, r) => sum + r.rating, 0) / localReviews.length
    : 0;

  return (
    <div>
      {/* 1. Phần Tổng Quan Điểm Đánh Giá (Summary) */}
      {!isLoadingData && localReviews.length > 0 && (
        <div className="flex items-center gap-4 mb-8 p-6 bg-surface rounded-2xl">
          <div className="text-5xl font-bold text-foreground">{avgRating.toFixed(1)}</div>
          <div>
            <RatingStars rating={avgRating} size="lg" />
            <p className="text-sm text-muted-foreground mt-1">{localReviews.length} reviews</p>
          </div>
        </div>
      )}

      {/* 2. Nút Mở Form Viết Đánh Giá */}
      {authState.isAuthenticated && !showForm && (
        <Button variant="outline" className="mb-6" onClick={() => setShowForm(true)}>
          Write a Review
        </Button>
      )}

      {/* 3. Form Điền Thông Tin Đánh Giá */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-5 border border-border rounded-2xl space-y-4 animate-fade-in">
          <h3 className="font-semibold text-foreground">Share your experience</h3>
          <div>
            <label className="field-label block text-sm font-medium mb-1">Your rating</label>
            <RatingStars rating={rating} size="lg" interactive onChange={setRating} />
          </div>
          <div>
            <label className="field-label block text-sm font-medium mb-1">Your comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Tell others about your visit..."
              className="w-full text-sm rounded-xl border border-border px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* 4. Phần Hiển Thị Danh Sách Đánh Giá (Review List / Loading) */}
      <div className="space-y-6">
        {isLoadingData ? (
          // Hiển thị trạng thái đang tải dữ liệu
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mb-2" />
            <p className="text-sm">Loading reviews...</p>
          </div>
        ) : (
          // Bản đồ render mảng review
          localReviews.map((review) => (
            <div key={review.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm">
                  {review.userName ? review.userName.charAt(0).toUpperCase() : "G"}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-foreground">{review.userName || "Guest"}</span>
                  <RatingStars rating={review.rating} size="sm" />
                  <span className="text-xs text-muted-foreground ml-auto">
                    {review.createdAt 
                      ? new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                      : "Recently"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
              </div>
            </div>
          ))
        )}

        {/* Nếu không có đánh giá nào */}
        {!isLoadingData && localReviews.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-8">
            No reviews yet. Be the first to review!
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewList;