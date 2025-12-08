'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  TrendingUp,
} from 'lucide-react';
import Headers from '@/components/Header';
import { wheelboardApi } from '@/lib/wheelboardApi';
import { api } from '@/lib/apiAdapter';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function CalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalActiveDays: 0,
    totalEventsScheduled: 0,
    thisMonthAvailability: 0,
  });

  const currentMonth = MONTHS[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  // Fetch calendar events and assigned trips from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('🔍 Fetching calendar events and trips...');
        setLoading(true);

        // Get current user
        const user = api.getCurrentUser();
        const userId = user?.id || '99b58c17-1812-4816-b2fd-20cfb386346c';

        console.log('👤 User ID for calendar:', userId);

        // Fetch both calendar events and assigned trips
        const [calendarResponse, tripsResponse] = await Promise.all([
          wheelboardApi.trip.getCalendarEvents(userId),
          wheelboardApi.trip.getAssignedTrips(userId),
        ]);

        console.log(
          '📅 Calendar events RAW response:',
          JSON.stringify(calendarResponse, null, 2)
        );
        console.log(
          '🚚 Assigned trips RAW response:',
          JSON.stringify(tripsResponse, null, 2)
        );

        // Process calendar events - handle all possible response structures
        let calendarEvents: any[] = [];
        if (Array.isArray(calendarResponse)) {
          calendarEvents = calendarResponse;
        } else if (
          calendarResponse?.data &&
          Array.isArray(calendarResponse.data)
        ) {
          calendarEvents = calendarResponse.data;
        } else if (calendarResponse && typeof calendarResponse === 'object') {
          // Check if it's wrapped in another property
          const keys = Object.keys(calendarResponse);
          console.log('📋 Response keys:', keys);
          for (const key of keys) {
            if (Array.isArray((calendarResponse as any)[key])) {
              calendarEvents = (calendarResponse as any)[key];
              console.log(`✅ Found array in property: ${key}`);
              break;
            }
          }
        }

        // Process assigned trips
        let tripsData: any[] = [];
        if (Array.isArray(tripsResponse)) {
          tripsData = tripsResponse;
        } else if (tripsResponse?.data && Array.isArray(tripsResponse.data)) {
          tripsData = tripsResponse.data;
        }

        console.log(
          '📊 Processed calendar events:',
          calendarEvents.length,
          calendarEvents
        );
        console.log('📊 Processed trips:', tripsData.length, tripsData);

        // Convert assigned trips to calendar events format
        const tripEvents = tripsData.map((trip: any) => {
          let startTime: string;
          let endTime: string;

          try {
            // pickupDate comes as "2025-12-26T00:00:00"
            // pickupTime comes as "11:42:00"
            if (trip.pickupDate && trip.pickupTime) {
              // Extract date part from pickupDate
              const datePart = trip.pickupDate.split('T')[0]; // "2025-12-26"
              // Combine with pickupTime
              const dateTimeString = `${datePart}T${trip.pickupTime}`; // "2025-12-26T11:42:00"
              startTime = new Date(dateTimeString).toISOString();
              endTime = startTime; // Same as start for trips
            } else if (trip.pickupDate) {
              // Only date available
              startTime = new Date(trip.pickupDate).toISOString();
              endTime = startTime;
            } else {
              // Fallback to current date
              startTime = new Date().toISOString();
              endTime = startTime;
            }
          } catch (error) {
            console.error('Error parsing trip date/time:', error, trip);
            startTime = new Date().toISOString();
            endTime = startTime;
          }

          return {
            eventId: `trip-${trip.tripId}`,
            eventName: `Trip: ${trip.pickupLocation} → ${trip.deliveryLocation}`,
            startTime,
            endTime,
            note: `${trip.tripStatus} - ${trip.tripCode || 'No code'}`,
            category: 'trip',
            isActive:
              trip.tripStatus === 'Assigned' ||
              trip.tripStatus === 'Inprogress',
            isTripEvent: true,
            tripData: trip,
          };
        });

        // Combine both types of events
        const allEvents = [...calendarEvents, ...tripEvents];
        setEvents(allEvents);

        console.log('📅 Total combined events:', allEvents.length);
        console.log('📋 All events:', allEvents);

        // Calculate stats using combined events
        const activeEvents = allEvents.filter((e: any) => e.isActive);
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        const thisMonthEvents = activeEvents.filter((e: any) => {
          const eventDate = new Date(e.startTime);
          return (
            eventDate.getMonth() === thisMonth &&
            eventDate.getFullYear() === thisYear
          );
        });

        const calculatedStats = {
          totalActiveDays: activeEvents.length,
          totalEventsScheduled: allEvents.length,
          thisMonthAvailability:
            thisMonthEvents.length > 0
              ? Math.round(
                  (thisMonthEvents.length /
                    new Date(thisYear, thisMonth + 1, 0).getDate()) *
                    100
                )
              : 0,
        };

        console.log('📊 Calculated stats:', calculatedStats);
        setStats(calculatedStats);

        console.log(
          '✅ Events loaded:',
          allEvents.length,
          '(Calendar:',
          calendarEvents.length,
          ', Trips:',
          tripEvents.length,
          ')'
        );
      } catch (error) {
        console.error('❌ Error fetching events:', error);
        // Show error details
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek =
      firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const days: Array<{
      date: number;
      isCurrentMonth: boolean;
      fullDate: string;
    }> = [];

    // Previous month days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = prevMonthDays - i;
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        fullDate: `${year}-${String(month).padStart(2, '0')}-${String(prevDate).padStart(2, '0')}`,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        fullDate: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        fullDate: `${year}-${String(month + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      });
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);

  const getDateInfo = (fullDate: string) => {
    // Find events for this date
    const dateEvents = events.filter((event) => {
      const eventDate = new Date(event.startTime).toISOString().split('T')[0];
      return eventDate === fullDate;
    });

    if (dateEvents.length === 0) return null;

    return {
      date: fullDate,
      hasEvent: true,
      isActive: dateEvents.some((e) => e.isActive),
      events: dateEvents.map((e) => ({
        id: e.eventId,
        title: e.eventName,
        time: `${new Date(e.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${new Date(e.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
        location: e.note || '',
        category: e.category || 'General',
        isTripEvent: e.isTripEvent || false,
        tripData: e.tripData || null,
      })),
    };
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (fullDate: string) => {
    setSelectedDate(fullDate);
  };

  const getSelectedDateEvents = () => {
    if (!selectedDate) return [];
    const dateInfo = getDateInfo(selectedDate);
    return dateInfo?.events || [];
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <Headers />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-3 py-4 pt-16 lg:px-6 lg:py-6 lg:pt-20">
        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <div className="rounded-lg bg-white p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-[#F36969]" />
                <p className="text-sm font-medium text-gray-700">
                  Loading calendar...
                </p>
              </div>
            </div>
          </div>
        )}

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
                MY Calendar
              </h1>
              <p className="mt-0.5 text-sm text-gray-600 lg:mt-1 lg:text-base">
                Mark your availability for trips and jobs
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push('/professional/calendar/mark')}
            className="flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-[#f36969] to-[#f36565] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition-all hover:shadow-xl lg:h-12 lg:rounded-xl lg:px-6 lg:text-base"
          >
            <Plus className="h-4 w-4 lg:h-5 lg:w-5" />
            <span className="hidden sm:inline">Mark Date</span>
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:p-6">
              {/* Calendar Header */}
              <div className="mb-4 flex items-center justify-between lg:mb-6">
                <button
                  onClick={handlePrevMonth}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-all hover:bg-gray-50 lg:h-10 lg:w-10"
                >
                  <ChevronLeft className="h-4 w-4 lg:h-5 lg:w-5" />
                </button>

                <div className="text-center">
                  <h2 className="text-lg font-bold text-[#535353] lg:text-2xl">
                    {currentMonth}
                  </h2>
                  <p className="text-xs text-gray-500 lg:text-sm">
                    {currentYear}
                  </p>
                </div>

                <button
                  onClick={handleNextMonth}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-all hover:bg-gray-50 lg:h-10 lg:w-10"
                >
                  <ChevronRight className="h-4 w-4 lg:h-5 lg:w-5" />
                </button>
              </div>

              {/* Days Header */}
              <div className="mb-2 grid grid-cols-7 gap-1 lg:gap-2">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="py-2 text-center text-xs font-semibold text-gray-500 lg:text-sm"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 lg:gap-2">
                {days.map((day, index) => {
                  const dateInfo = getDateInfo(day.fullDate);
                  const isSelected = selectedDate === day.fullDate;
                  const hasEvent = dateInfo?.hasEvent;
                  const isActive = dateInfo?.isActive;
                  const isInactive = dateInfo && !dateInfo.isActive;

                  return (
                    <button
                      key={index}
                      onClick={() =>
                        day.isCurrentMonth && handleDateClick(day.fullDate)
                      }
                      disabled={!day.isCurrentMonth}
                      className={`relative aspect-square rounded-lg p-1 text-center text-sm transition-all lg:p-2 lg:text-base ${
                        !day.isCurrentMonth
                          ? 'cursor-not-allowed text-gray-300'
                          : isSelected
                            ? 'bg-[#f36969] text-white shadow-lg'
                            : isActive
                              ? 'bg-green-50 text-green-700 hover:bg-green-100'
                              : isInactive
                                ? 'bg-gray-100 text-gray-400'
                                : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-semibold">{day.date}</div>

                      {/* Event Indicators */}
                      {hasEvent && day.isCurrentMonth && (
                        <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5">
                          {dateInfo.events?.map((_, idx) => (
                            <div
                              key={idx}
                              className={`h-1 w-1 rounded-full ${
                                isSelected ? 'bg-white' : 'bg-[#f36969]'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stats Cards - Mobile */}
            <div className="mt-4 grid grid-cols-2 gap-3 lg:hidden">
              <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                <div className="mb-1 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-xs font-medium text-gray-600">
                    Active Days
                  </p>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalActiveDays}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                <div className="mb-1 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                    <CalendarIcon className="h-4 w-4 text-gray-600" />
                  </div>
                  <p className="text-xs font-medium text-gray-600">Events</p>
                </div>
                <p className="text-2xl font-bold text-[#535353]">
                  {stats.totalEventsScheduled}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Stats Cards - Desktop */}
            <div className="hidden lg:block">
              <div className="space-y-3">
                <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-green-100 p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Days
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.totalActiveDays}
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    {stats.thisMonthAvailability}% availability
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                      <CalendarIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Events
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-[#535353]">
                    {stats.totalEventsScheduled}
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Date Events */}
            {selectedDate && getSelectedDateEvents().length > 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:p-6">
                <h3 className="mb-3 text-base font-bold text-[#535353] lg:mb-4 lg:text-lg">
                  Events on{' '}
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </h3>
                <div className="space-y-3">
                  {getSelectedDateEvents().map((event) => (
                    <div
                      key={event.id}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-3 lg:p-4"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <h4 className="text-sm font-semibold text-[#535353] lg:text-base">
                          {event.title}
                        </h4>
                        <div className="flex flex-col items-end gap-1">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              event.category.toLowerCase() === 'trip'
                                ? 'bg-blue-100 text-blue-700'
                                : event.category.toLowerCase() === 'job'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-teal-100 text-teal-700'
                            }`}
                          >
                            {event.category}
                          </span>
                        </div>
                      </div>

                      <div className="mb-2 flex items-center gap-2 text-xs text-gray-600 lg:text-sm">
                        <Clock className="h-3 w-3 lg:h-4 lg:w-4" />
                        <span>{event.time}</span>
                      </div>

                      {event.location && (
                        <div className="mb-2 rounded-lg bg-white p-2 text-xs text-gray-700 lg:text-sm">
                          <div className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0 text-gray-400 lg:h-4 lg:w-4" />
                            <span className="font-medium text-gray-600">
                              Note:
                            </span>
                          </div>
                          <p className="ml-5 mt-1 text-gray-700">
                            {event.location}
                          </p>
                        </div>
                      )}

                      {/* Show trip details and action button for trip events */}
                      {event.isTripEvent && event.tripData && (
                        <div className="mt-3 border-t border-gray-200 pt-3">
                          <div className="mb-2 flex items-center gap-2 text-xs text-gray-600">
                            <MapPin className="h-3 w-3" />
                            <span className="font-medium">Route:</span>
                          </div>
                          <div className="mb-2 ml-5 text-xs text-gray-700">
                            <div>From: {event.tripData.pickupLocation}</div>
                            <div>To: {event.tripData.deliveryLocation}</div>
                          </div>
                          {event.tripData.tripStatus && (
                            <div className="mb-2 flex items-center gap-2">
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-medium ${
                                  event.tripData.tripStatus === 'Completed'
                                    ? 'bg-green-100 text-green-700'
                                    : event.tripData.tripStatus === 'Inprogress'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {event.tripData.tripStatus}
                              </span>
                            </div>
                          )}
                          <button
                            onClick={() =>
                              router.push(
                                `/professional/trips/${event.tripData.tripId}/progress`
                              )
                            }
                            className="mt-2 w-full rounded-lg bg-[#f36969] px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-[#e55555] lg:text-sm"
                          >
                            View Trip Details
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm lg:p-6">
                <CalendarIcon className="mx-auto mb-3 h-12 w-12 text-gray-300 lg:h-16 lg:w-16" />
                <p className="text-sm font-medium text-gray-500 lg:text-base">
                  {selectedDate
                    ? 'No events on this date'
                    : 'Select a date to view events'}
                </p>
              </div>
            )}

            {/* Legend */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:p-6">
              <h3 className="mb-3 text-sm font-bold text-[#535353] lg:text-base">
                Legend
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg border-2 border-green-200 bg-green-50"></div>
                  <span className="text-xs text-gray-600 lg:text-sm">
                    Active Day
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg border-2 border-gray-300 bg-gray-100"></div>
                  <span className="text-xs text-gray-600 lg:text-sm">
                    Inactive Day
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative h-6 w-6 rounded-lg border-2 border-gray-200 bg-white">
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                      <div className="h-1 w-1 rounded-full bg-[#f36969]"></div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 lg:text-sm">
                    Has Events
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
