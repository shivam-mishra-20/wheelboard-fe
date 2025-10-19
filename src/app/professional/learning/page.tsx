'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Play,
  Clock,
  CheckCircle2,
  TrendingUp,
  Award,
  Search,
  Filter,
} from 'lucide-react';
import Headers from '@/components/Header';
import { professionalLearningData, LearningModule } from '@/lib/mockApi';

export default function LearningPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredModules = professionalLearningData.modules.filter((module) => {
    const matchesCategory =
      selectedCategory === 'all' || module.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const completedModules = filteredModules.filter((m) => m.isCompleted);
  const inProgressModules = filteredModules.filter(
    (m) => m.progress > 0 && !m.isCompleted
  );
  const notStartedModules = filteredModules.filter((m) => m.progress === 0);

  const getStatusBadge = (module: LearningModule) => {
    if (module.isCompleted) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </span>
      );
    }
    if (module.progress > 0) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#f36969]/10 px-2 py-1 text-xs font-semibold text-[#f36969]">
          <Play className="h-3 w-3" />
          In Progress
        </span>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <Headers />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-3 py-4 pt-16 lg:px-6 lg:py-6 lg:pt-20">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between lg:mb-6">
          <div className="flex items-center gap-3 lg:gap-4">
            <button
              onClick={() => router.back()}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 hover:shadow-md lg:h-12 lg:w-12 lg:rounded-xl"
            >
              <ArrowLeft className="h-4 w-4 lg:h-6 lg:w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#535353] lg:text-4xl">
                My Learning
              </h1>
              <p className="mt-0.5 text-sm text-gray-600 lg:mt-1 lg:text-base">
                Enhance your skills with our training modules
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-4 grid grid-cols-2 gap-3 lg:mb-6 lg:grid-cols-4 lg:gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm lg:p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 lg:h-10 lg:w-10">
                <CheckCircle2 className="h-4 w-4 text-green-600 lg:h-5 lg:w-5" />
              </div>
              <p className="text-xs font-medium text-gray-600 lg:text-sm">
                Completed
              </p>
            </div>
            <p className="text-2xl font-bold text-green-600 lg:text-3xl">
              {professionalLearningData.stats.modulesCompleted}
            </p>
            <p className="mt-1 text-xs text-gray-500">Modules</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm lg:p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f36969]/10 lg:h-10 lg:w-10">
                <TrendingUp className="h-4 w-4 text-[#f36969] lg:h-5 lg:w-5" />
              </div>
              <p className="text-xs font-medium text-gray-600 lg:text-sm">
                In Progress
              </p>
            </div>
            <p className="text-2xl font-bold text-[#f36969] lg:text-3xl">
              {professionalLearningData.stats.inProgress}
            </p>
            <p className="mt-1 text-xs text-gray-500">Modules</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm lg:p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 lg:h-10 lg:w-10">
                <Play className="h-4 w-4 text-blue-600 lg:h-5 lg:w-5" />
              </div>
              <p className="text-xs font-medium text-gray-600 lg:text-sm">
                Total
              </p>
            </div>
            <p className="text-2xl font-bold text-blue-600 lg:text-3xl">
              {professionalLearningData.stats.totalModules}
            </p>
            <p className="mt-1 text-xs text-gray-500">Modules</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm lg:p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-50 lg:h-10 lg:w-10">
                <Award className="h-4 w-4 text-yellow-600 lg:h-5 lg:w-5" />
              </div>
              <p className="text-xs font-medium text-gray-600 lg:text-sm">
                Certificates
              </p>
            </div>
            <p className="text-2xl font-bold text-yellow-600 lg:text-3xl">
              {professionalLearningData.stats.certificatesEarned}
            </p>
            <p className="mt-1 text-xs text-gray-500">Earned</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-4 flex gap-3 lg:mb-6 lg:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 lg:h-5 lg:w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search modules..."
              className="w-full rounded-xl border border-gray-300 py-2 pl-10 pr-4 text-sm transition-all focus:border-[#f36969] focus:outline-none focus:ring-2 focus:ring-[#f36969]/20 lg:py-3 lg:text-base"
            />
          </div>
          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-600 transition-all hover:border-[#f36969] hover:text-[#f36969] lg:h-12 lg:w-12">
            <Filter className="h-4 w-4 lg:h-5 lg:w-5" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 lg:mb-6 lg:gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`whitespace-nowrap rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-all lg:px-6 lg:py-2.5 lg:text-base ${
              selectedCategory === 'all'
                ? 'border-[#f36969] bg-[#f36969] text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:border-[#f36969]/50'
            }`}
          >
            All ({professionalLearningData.modules.length})
          </button>
          {professionalLearningData.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-all lg:px-6 lg:py-2.5 lg:text-base ${
                selectedCategory === category.id
                  ? 'border-[#f36969] bg-[#f36969] text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-[#f36969]/50'
              }`}
            >
              <span>{category.icon}</span>
              <span>
                {category.name} ({category.count})
              </span>
            </button>
          ))}
        </div>

        {/* Module Lists */}
        <div className="space-y-4 lg:space-y-6">
          {/* In Progress Modules */}
          {inProgressModules.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-bold text-[#535353] lg:mb-4 lg:text-xl">
                Continue Learning ({inProgressModules.length})
              </h2>
              <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
                {inProgressModules.map((module) => (
                  <div
                    key={module.id}
                    onClick={() =>
                      router.push(`/professional/learning/${module.id}`)
                    }
                    className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-lg lg:p-5"
                  >
                    <div className="mb-3 flex items-start gap-3">
                      <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 lg:h-20 lg:w-32">
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#f36969] to-[#f36565]">
                          <Play className="h-8 w-8 text-white lg:h-10 lg:w-10" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 text-sm font-bold text-[#535353] group-hover:text-[#f36969] lg:text-base">
                          {module.title}
                        </h3>
                        <p className="mb-2 line-clamp-2 text-xs text-gray-600 lg:text-sm">
                          {module.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{module.duration}</span>
                          <span>•</span>
                          <span>{module.lastWatched}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#f36969]">
                          {module.progress}% Complete
                        </span>
                        <span className="text-gray-500">
                          {module.modulesCompleted}/{module.totalModules}{' '}
                          Modules
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full bg-gradient-to-r from-[#f36969] to-[#f36565] transition-all"
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {module.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {getStatusBadge(module)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Modules */}
          {completedModules.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-bold text-[#535353] lg:mb-4 lg:text-xl">
                Completed ({completedModules.length})
              </h2>
              <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
                {completedModules.map((module) => (
                  <div
                    key={module.id}
                    onClick={() =>
                      router.push(`/professional/learning/${module.id}`)
                    }
                    className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-lg lg:p-5"
                  >
                    <div className="mb-3 flex items-start gap-3">
                      <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 lg:h-20 lg:w-32">
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-green-500 to-green-600">
                          <CheckCircle2 className="h-8 w-8 text-white lg:h-10 lg:w-10" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 text-sm font-bold text-[#535353] group-hover:text-[#f36969] lg:text-base">
                          {module.title}
                        </h3>
                        <p className="mb-2 line-clamp-2 text-xs text-gray-600 lg:text-sm">
                          {module.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{module.duration}</span>
                          <span>•</span>
                          <span>{module.lastWatched}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {module.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {getStatusBadge(module)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Not Started Modules */}
          {notStartedModules.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-bold text-[#535353] lg:mb-4 lg:text-xl">
                Available Modules ({notStartedModules.length})
              </h2>
              <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
                {notStartedModules.map((module) => (
                  <div
                    key={module.id}
                    onClick={() =>
                      router.push(`/professional/learning/${module.id}`)
                    }
                    className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-lg lg:p-5"
                  >
                    <div className="mb-3 flex items-start gap-3">
                      <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 lg:h-20 lg:w-32">
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-400 to-gray-500">
                          <Play className="h-8 w-8 text-white lg:h-10 lg:w-10" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 text-sm font-bold text-[#535353] group-hover:text-[#f36969] lg:text-base">
                          {module.title}
                        </h3>
                        <p className="mb-2 line-clamp-2 text-xs text-gray-600 lg:text-sm">
                          {module.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{module.duration}</span>
                          <span>•</span>
                          <span>{module.totalModules} Modules</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {module.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button className="rounded-lg bg-gradient-to-r from-[#f36969] to-[#f36565] px-4 py-1.5 text-xs font-semibold text-white transition-all hover:shadow-lg lg:text-sm">
                        Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredModules.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm lg:p-12">
              <Play className="mx-auto mb-4 h-16 w-16 text-gray-300 lg:h-20 lg:w-20" />
              <h3 className="mb-2 text-lg font-bold text-gray-600 lg:text-xl">
                No modules found
              </h3>
              <p className="text-sm text-gray-500 lg:text-base">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
