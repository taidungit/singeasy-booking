import { useState } from "react";
import { Loader2 } from "lucide-react";
import RatingStars from "@/components/shared/RatingStars";
import { Button } from "@/components/ui/button";
import { createReview } from "@/services/api";
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
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setIsSubmitting(true);
    try {
      const review = await createReview({
        shopId,
        userId: authState.user?.id ?? "guest",
        userName: authState.user?.name ?? "Guest",
        rating,
        comment,
      });
      onReviewAdded?.(review);
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

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div>
      {/* Summary */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-4 mb-8 p-6 bg-surface rounded-2xl">
          <div className="text-5xl font-bold text-foreground">{avgRating.toFixed(1)}</div>
          <div>
            <RatingStars rating={avgRating} size="lg" />
            <p className="text-sm text-muted-foreground mt-1">{reviews.length} reviews</p>
          </div>
        </div>
      )}

      {/* Write review button */}
      {authState.isAuthenticated && !showForm && (
        <Button variant="outline" className="mb-6" onClick={() => setShowForm(true)}>
          Write a Review
        </Button>
      )}

      {/* Review form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-5 border border-border rounded-2xl space-y-4 animate-fade-in">
          <h3 className="font-semibold text-foreground">Share your experience</h3>
          <div>
            <label className="field-label">Your rating</label>
            <RatingStars rating={rating} size="lg" interactive onChange={setRating} />
          </div>
          <div>
            <label className="field-label">Your comment</label>
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
              {isSubmitting ? <><Loader2 className="w-3 h-3 animate-spin mr-1" />Submitting...</> : "Submit Review"}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Review list */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-sm">{review.userName.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-foreground">{review.userName}</span>
                <RatingStars rating={review.rating} size="sm" />
                <span className="text-xs text-muted-foreground ml-auto">
                  {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-8">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
