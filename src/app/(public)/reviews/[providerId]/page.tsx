"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { useAuth } from "@/context/AuthContext";
import { Star } from "lucide-react";

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId?: { name?: string };
}

export default function ReviewsPage() {
  const { providerId } = useParams<{ providerId: string }>();
  const { user, loading } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    if (!loading && !user) setShowForm(false);
  }, [user, loading]);

  function load() {
    fetch(`/api/reviews?providerId=${providerId}`)
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews || []));
  }

  useEffect(() => {
    load();
  }, [providerId]);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerId, ...form }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ rating: 5, comment: "" });
      load();
    } else {
      alert("Login required to write a review");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Reviews & Ratings</h1>
        {!loading && user ? (
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            Write a Review
          </Button>
        ) : !loading ? (
          <p className="text-sm text-zinc-400">
            <Link
              href={`/login?redirect=${encodeURIComponent(`/reviews/${providerId}`)}`}
              className="text-accent hover:underline"
            >
              Log in
            </Link>{" "}
            to write a review
          </p>
        ) : null}
      </div>

      {showForm && user && (
        <form
          onSubmit={submitReview}
          className="mb-8 space-y-4 rounded-xl border border-zinc-800 bg-surface p-6"
        >
          <div>
            <span className="mb-1 block text-sm text-zinc-400">
              Rating <span className="text-accent">*</span>
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`Rate ${n} stars`}
                  onClick={() => setForm({ ...form, rating: n })}
                >
                  <Star
                    className={
                      n <= form.rating
                        ? "fill-accent text-accent"
                        : "text-zinc-600"
                    }
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="review-comment" className="mb-1 block text-sm text-zinc-400">
              Your Review <span className="text-accent">*</span>
            </label>
            <textarea
              id="review-comment"
              required
              rows={4}
              className="w-full rounded-lg px-4 py-2.5"
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
            />
          </div>
          <Button type="submit">Submit Review</Button>
        </form>
      )}

      <div className="space-y-4">
        {reviews.map((r) => (
          <div
            key={r._id}
            className="rounded-xl border border-zinc-800 bg-surface p-6"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold">{r.userId?.name || "User"}</p>
              <span className="text-xs text-zinc-500">
                {new Date(r.createdAt).toLocaleDateString()}
              </span>
            </div>
            <StarRating rating={r.rating} size={14} />
            <p className="mt-3 text-zinc-300">{r.comment}</p>
          </div>
        ))}
        {!reviews.length && (
          <p className="text-center text-zinc-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
