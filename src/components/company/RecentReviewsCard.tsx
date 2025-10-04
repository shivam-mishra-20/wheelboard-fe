'use client';

import React from 'react';
import Image from 'next/image';
import { MessageSquare, Star } from 'lucide-react';
import { Driver } from '@/lib/mockApi';

interface RecentReviewsCardProps {
  driver: Driver;
}

export default function RecentReviewsCard({ driver }: RecentReviewsCardProps) {
  const hasReviews = driver.reviews && driver.reviews.length > 0;

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Recent Reviews</h3>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <MessageSquare className="h-4 w-4" />
          <span>{driver.reviews?.length || 0} reviews</span>
        </div>
      </div>

      {hasReviews ? (
        <div className="space-y-4">
          {driver.reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-lg border border-gray-100 p-4 transition-shadow hover:shadow-md"
            >
              {/* Reviewer Info */}
              <div className="mb-3 flex items-start gap-3">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
                  {review.reviewerAvatar ? (
                    <Image
                      src={review.reviewerAvatar}
                      alt={review.reviewerName}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-semibold text-gray-500">
                      {review.reviewerName.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">
                      {review.reviewerName}
                    </h4>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(review.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-sm leading-relaxed text-gray-700">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-gray-50 p-4">
            <MessageSquare className="h-12 w-12 text-gray-400" />
          </div>
          <h4 className="mb-2 text-lg font-semibold text-gray-900">
            No Reviews Yet
          </h4>
          <p className="max-w-xs text-sm text-gray-500">
            This driver hasn&apos;t received any reviews yet. Reviews will
            appear here once customers provide feedback.
          </p>
        </div>
      )}
    </div>
  );
}
