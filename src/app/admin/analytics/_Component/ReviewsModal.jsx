"use client";

import { Button, Modal } from "antd";
import { ChevronDown, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const mockReviews = [
  {
    id: "1",
    name: "John D.",
    date: "Aug 21, 2025",
    version: "iOS v2.3.1",
    content:
      "Great app! Coupons load fast and saved me $50 on Amazon. Just add more categories.",
    rating: 4,
    avatar: "/thoughtful-man.png",
  },
  {
    id: "2",
    name: "Sarah M.",
    date: "Aug 20, 2025",
    version: "iOS v2.3.0",
    content:
      "Love the interface but the app crashes when I try to apply certain coupons. Please fix this bug.",
    rating: 3,
    avatar: "/diverse-woman-portrait.png",
  },
  {
    id: "3",
    name: "Mike R.",
    date: "Aug 19, 2025",
    version: "iOS v2.2.9",
    content:
      "Decent app but the UI could be more intuitive. Sometimes it's hard to find specific store coupons.",
    rating: 3,
    avatar: "/man-beard.png",
  },
];

const ratingDistribution = [
  { stars: 5, percentage: 62, color: "bg-green-500" },
  { stars: 4, percentage: 25, color: "bg-lime-400" },
  { stars: 3, percentage: 7, color: "bg-yellow-500" },
  { stars: 2, percentage: 4, color: "bg-orange-500" },
  { stars: 1, percentage: 2, color: "bg-red-500" },
];

function StarRating({ rating, size = "sm" }) {
  const sizeClass = size === "lg" ? "w-6 h-6" : "w-4 h-4";

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

export function ReviewsComponent({ open, setOpen }) {
  const [selectedRegion, setSelectedRegion] = useState("All Regions");

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      footer={null}
      onCancel={() => {
        setOpen(false);
      }}
      title="Reviews"
      width={1000}
    >
      <div className="space-y-8">
        {/* Rating Overview */}
        <div className="rounded-lg border p-6">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Left side - Overall rating */}
            <div className="flex flex-col items-center space-y-2 lg:items-start">
              <div className="text-6xl font-bold text-foreground">4.3</div>
              <StarRating rating={4} size="lg" />
              <div className="text-muted-foreground text-sm">
                Average Rating
              </div>
              <div className="text-lg font-semibold text-foreground">
                12,340 Total Reviews
              </div>
            </div>

            {/* Right side - Rating distribution */}
            <div className="flex-1 space-y-2">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <div className="flex w-8 items-center gap-1">
                    <span className="text-sm font-medium">{item.stars}</span>
                    <Star className="h-3 w-3 fill-current text-yellow-400" />
                  </div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full ${item.color} transition-all duration-300`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="text-muted-foreground w-8 text-right text-sm">
                    {item.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Recent Reviews
            </h2>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              {selectedRegion}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {mockReviews.map((review) => (
              <div key={review.id} className="rounded-lg border p-4">
                <div className="flex gap-4">
                  {/* <Image
                  width={40}
                  height={40}
                  src={review.avatar || "/placeholder.svg"}
                  alt={review.name}
                  className="h-10 w-10 rounded-full object-cover"
                /> */}

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="font-medium text-foreground">
                          {review.name}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {review.date} • {review.version}
                        </div>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>

                    <p className="text-sm leading-relaxed text-foreground">
                      {review.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
