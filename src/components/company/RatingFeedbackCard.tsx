'use client';

import React, { useState } from 'react';
import { Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Driver } from '@/lib/mockApi';

interface RatingFeedbackCardProps {
  driver: Driver;
  onSaveFeedback: (rating: number, feedback: string) => void;
}

export default function RatingFeedbackCard({
  driver,
  onSaveFeedback,
}: RatingFeedbackCardProps) {
  const [rating, setRating] = useState(driver.rating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState(driver.feedback || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSaveFeedback(rating, feedback);
    setTimeout(() => setIsSaving(false), 500);
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h3 className="mb-6 text-xl font-bold text-gray-900">
        Rating & Feedback
      </h3>

      {/* Star Rating */}
      <div className="mb-6">
        <label className="mb-3 block text-sm font-semibold text-gray-700">
          Overall Rating
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="transition-transform hover:scale-110 focus:outline-none"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-lg font-bold text-gray-700">
            {rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Current Feedback Display */}
      {driver.feedback && (
        <div className="mb-6 rounded-lg border-l-4 border-[#3B82F6] bg-blue-50 p-4">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#3B82F6]" />
            <div>
              <p className="mb-1 text-sm font-semibold text-[#3B82F6]">
                Current Feedback
              </p>
              <p className="text-sm text-gray-700">{driver.feedback}</p>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Input */}
      <div className="mb-6">
        <label
          htmlFor="feedback"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Update Feedback
        </label>
        <Textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your thoughts about this driver's performance..."
          className="min-h-[120px] resize-none"
        />
        <p className="mt-2 text-xs text-gray-500">
          💡 Tip: Provide specific examples to help the driver improve
        </p>
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full bg-gradient-to-r from-[#F36565] to-[#3B82F6] py-6 font-semibold text-white transition-all hover:from-[#d54d4d] hover:to-[#2563eb]"
      >
        {isSaving ? 'Saving...' : 'Save Feedback'}
      </Button>
    </div>
  );
}
