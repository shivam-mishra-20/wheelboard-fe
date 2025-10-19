'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Clock,
  Calendar,
  BookOpen,
  Star,
  Users,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import Headers from '@/components/Header';
import { professionalLearningData } from '@/lib/mockApi';

export default function LearningDetailPage() {
  const router = useRouter();
  const params = useParams();
  const moduleId = params.id as string;

  const learningModule = professionalLearningData.modules.find(
    (m) => m.id === moduleId
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(420); // 7 minutes in seconds

  useEffect(() => {
    let interval: number | undefined;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            if (interval) {
              clearInterval(interval);
            }
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, duration]);

  if (!learningModule) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Headers />
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Module not found
            </h1>
            <button
              onClick={() => router.back()}
              className="mt-4 text-[#f36969] hover:underline"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const progressPercentage = (currentTime / duration) * 100;

  const relatedModules = professionalLearningData.modules
    .filter(
      (m) =>
        m.category === learningModule.category && m.id !== learningModule.id
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <Headers />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-3 py-4 pt-16 lg:px-6 lg:py-6 lg:pt-20">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3 lg:mb-6 lg:gap-4">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 hover:shadow-md lg:h-12 lg:w-12 lg:rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 lg:h-6 lg:w-6" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold text-[#535353] lg:text-3xl">
              {learningModule.title}
            </h1>
            <p className="mt-0.5 text-xs text-gray-600 lg:mt-1 lg:text-sm">
              {learningModule.category.charAt(0).toUpperCase() +
                learningModule.category.slice(1)}{' '}
              Module
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="mb-4 lg:mb-6">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-lg">
                {/* Mock Video Display */}
                <div className="relative flex h-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#f36969]/20 backdrop-blur-sm lg:h-24 lg:w-24">
                      {isPlaying ? (
                        <Pause className="h-10 w-10 text-white lg:h-12 lg:w-12" />
                      ) : (
                        <Play className="h-10 w-10 text-white lg:h-12 lg:w-12" />
                      )}
                    </div>
                    <p className="text-lg font-semibold text-white lg:text-xl">
                      {learningModule.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-300 lg:text-base">
                      {isPlaying ? 'Playing...' : 'Click to play'}
                    </p>
                  </div>
                </div>

                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="h-1 w-full cursor-pointer overflow-hidden rounded-full bg-white/30">
                      <div
                        className="h-full bg-[#f36969] transition-all"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePlayPause}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/30"
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={handleMuteToggle}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/30"
                      >
                        {isMuted ? (
                          <VolumeX className="h-5 w-5" />
                        ) : (
                          <Volume2 className="h-5 w-5" />
                        )}
                      </button>
                      <span className="text-sm font-medium text-white">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/30">
                      <Maximize className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Module Info */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:p-6">
              <h2 className="mb-3 text-lg font-bold text-[#535353] lg:text-xl">
                About This Module
              </h2>
              <p className="mb-4 text-sm text-gray-600 lg:text-base">
                {learningModule.description}
              </p>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                  <Clock className="h-5 w-5 text-[#f36969]" />
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-semibold text-[#535353]">
                      {learningModule.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">Modules</p>
                    <p className="text-sm font-semibold text-[#535353]">
                      {learningModule.totalModules}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-xs text-gray-500">Rating</p>
                    <p className="text-sm font-semibold text-[#535353]">
                      {learningModule.rating} / 5
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Enrolled</p>
                    <p className="text-sm font-semibold text-[#535353]">
                      {learningModule.enrolledCount?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructor Info */}
              {learningModule.instructor && (
                <div className="mt-4 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 lg:p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f36969] to-[#f36565] text-lg font-bold text-white lg:h-14 lg:w-14">
                    {learningModule.instructor.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Instructor</p>
                    <p className="text-sm font-semibold text-[#535353] lg:text-base">
                      {learningModule.instructor}
                    </p>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {learningModule.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    learningModule.difficulty === 'beginner'
                      ? 'border-green-300 bg-green-50 text-green-700'
                      : learningModule.difficulty === 'intermediate'
                        ? 'border-yellow-300 bg-yellow-50 text-yellow-700'
                        : 'border-red-300 bg-red-50 text-red-700'
                  }`}
                >
                  {learningModule.difficulty.charAt(0).toUpperCase() +
                    learningModule.difficulty.slice(1)}
                </span>
              </div>
            </div>

            {/* Action Buttons - Mobile */}
            <div className="mt-4 flex gap-3 lg:hidden">
              <button
                onClick={() => router.back()}
                className="flex-1 rounded-xl border-2 border-gray-300 bg-white py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50"
              >
                Back
              </button>
              <button className="flex-1 rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] py-3 font-semibold text-white shadow-lg shadow-pink-500/30 transition-all hover:shadow-xl">
                {learningModule.isCompleted
                  ? 'Watch Again'
                  : learningModule.progress > 0
                    ? 'Continue'
                    : 'Start Learning'}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Progress Card */}
            {learningModule.progress > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:p-6">
                <h3 className="mb-3 text-base font-bold text-[#535353] lg:text-lg">
                  Your Progress
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#f36969]">
                      {learningModule.progress}% Complete
                    </span>
                    <span className="text-gray-500">
                      {learningModule.modulesCompleted}/
                      {learningModule.totalModules}
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-gradient-to-r from-[#f36969] to-[#f36565]"
                      style={{ width: `${learningModule.progress}%` }}
                    ></div>
                  </div>
                  {learningModule.lastWatched && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>Last watched: {learningModule.lastWatched}</span>
                    </div>
                  )}
                  {learningModule.isCompleted && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-semibold text-green-700">
                        Module Completed!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Button - Desktop */}
            <div className="hidden lg:block">
              <button className="w-full rounded-xl bg-gradient-to-r from-[#f36969] to-[#f36565] py-4 text-lg font-semibold text-white shadow-lg shadow-pink-500/30 transition-all hover:shadow-xl">
                {learningModule.isCompleted
                  ? 'Watch Again'
                  : learningModule.progress > 0
                    ? 'Continue Learning'
                    : 'Start Learning'}
              </button>
            </div>

            {/* Related Modules */}
            {relatedModules.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:p-6">
                <h3 className="mb-4 text-base font-bold text-[#535353] lg:text-lg">
                  Related Modules
                </h3>
                <div className="space-y-3">
                  {relatedModules.map((relModule) => (
                    <div
                      key={relModule.id}
                      onClick={() =>
                        router.push(`/professional/learning/${relModule.id}`)
                      }
                      className="group cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-3 transition-all hover:border-[#f36969] hover:bg-[#f36969]/5"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="line-clamp-1 text-sm font-semibold text-[#535353] group-hover:text-[#f36969]">
                          {relModule.title}
                        </h4>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#f36969]" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{relModule.duration}</span>
                        {relModule.isCompleted && (
                          <>
                            <span>•</span>
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificate Info */}
            {learningModule.isCompleted && (
              <div className="rounded-2xl border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 shadow-sm lg:p-6">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-200">
                    <CheckCircle2 className="h-6 w-6 text-yellow-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-yellow-900 lg:text-base">
                      Certificate Earned!
                    </h3>
                    <p className="text-xs text-yellow-700">
                      Download your certificate
                    </p>
                  </div>
                </div>
                <button className="w-full rounded-lg bg-yellow-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-yellow-700">
                  Download Certificate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
