'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { ProfessionalProtected } from '../../../components/ProtectedRoute';
import {
  Phone,
  MapPin,
  AlertTriangle,
  Shield,
  Clock,
  Car,
  ChevronRight,
  X,
  CheckCircle2,
  Navigation,
} from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  type: 'Police' | 'Ambulance' | 'Fire' | 'Roadside Assistance' | 'Company';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface SOSAlert {
  id: string;
  timestamp: string;
  location: string;
  type: string;
  status: 'Active' | 'Resolved';
}

export default function SOSPage() {
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedEmergency, setSelectedEmergency] =
    useState<EmergencyContact | null>(null);
  const [sosActivated, setSosActivated] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(
    'Loading your location...'
  );

  // Mock current trip and driver data
  const currentTrip = {
    id: 'TRP-1029',
    route: 'Delhi to Mumbai',
    vehicleNumber: 'DL-01-AB-1234',
    startTime: '08:00 AM',
  };

  // Emergency contacts
  const emergencyContacts: EmergencyContact[] = [
    {
      id: '1',
      name: 'Police',
      number: '100',
      type: 'Police',
      icon: Shield,
      color: 'blue',
    },
    {
      id: '2',
      name: 'Ambulance',
      number: '108',
      type: 'Ambulance',
      icon: AlertTriangle,
      color: 'red',
    },
    {
      id: '3',
      name: 'Fire',
      number: '101',
      type: 'Fire',
      icon: AlertTriangle,
      color: 'orange',
    },
    {
      id: '4',
      name: 'Roadside Assistance',
      number: '1800-123-4567',
      type: 'Roadside Assistance',
      icon: Car,
      color: 'teal',
    },
    {
      id: '5',
      name: 'Company Emergency',
      number: '+91 98765 43210',
      type: 'Company',
      icon: Phone,
      color: 'purple',
    },
  ];

  // Recent SOS history
  const sosHistory: SOSAlert[] = [
    {
      id: 'sos-1',
      timestamp: '2025-10-15 02:30 PM',
      location: 'NH-44, Near Panipat, Haryana',
      type: 'Vehicle Breakdown',
      status: 'Resolved',
    },
    {
      id: 'sos-2',
      timestamp: '2025-09-28 11:15 AM',
      location: 'NH-48, Vadodara, Gujarat',
      type: 'Medical Emergency',
      status: 'Resolved',
    },
  ];

  // Get current location (mock)
  const getCurrentLocation = () => {
    // In production, use Geolocation API
    setTimeout(() => {
      setCurrentLocation('NH-44, Near Sonipat, Haryana');
    }, 1000);
  };

  // Activate main SOS alert
  const handleSOSActivation = () => {
    setSosActivated(true);
    getCurrentLocation();
    // In production: Send alert to company, emergency contacts, and authorities
    console.log('SOS ACTIVATED - Alerting emergency contacts...');
  };

  // Handle emergency contact call
  const handleEmergencyCall = (contact: EmergencyContact) => {
    setSelectedEmergency(contact);
    setShowConfirmation(true);
  };

  // Confirm call
  const confirmCall = () => {
    if (selectedEmergency) {
      console.log(
        `Calling ${selectedEmergency.name}: ${selectedEmergency.number}`
      );
      // In production: Trigger phone call
      window.location.href = `tel:${selectedEmergency.number}`;
    }
    setShowConfirmation(false);
  };

  const getColorClasses = (color: string) => {
    const colors: Record<
      string,
      { bg: string; text: string; border: string; hover: string }
    > = {
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
        hover: 'hover:bg-blue-100',
      },
      red: {
        bg: 'bg-red-50',
        text: 'text-red-600',
        border: 'border-red-200',
        hover: 'hover:bg-red-100',
      },
      orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        border: 'border-orange-200',
        hover: 'hover:bg-orange-100',
      },
      teal: {
        bg: 'bg-teal-50',
        text: 'text-teal-600',
        border: 'border-teal-200',
        hover: 'hover:bg-teal-100',
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-200',
        hover: 'hover:bg-purple-100',
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <ProfessionalProtected>
      <Header />

      <div className="min-h-screen bg-gray-50 pt-16 font-poppins">
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Page Header */}
          <div className="mb-6 lg:mb-8">
            <button
              onClick={() => router.back()}
              className="mb-4 flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              <ChevronRight className="mr-1 h-4 w-4 rotate-180" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 lg:h-14 lg:w-14">
                <AlertTriangle className="h-6 w-6 text-red-600 lg:h-7 lg:w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
                  Emergency SOS
                </h1>
                <p className="text-sm text-gray-600 lg:text-base">
                  Quick access to emergency services
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            {/* Main SOS Section - Left Column */}
            <div className="space-y-6 lg:col-span-2">
              {/* Main SOS Alert Button */}
              <div className="rounded-2xl bg-white p-6 shadow-sm lg:p-8">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 lg:text-xl">
                  Emergency Alert
                </h2>

                {!sosActivated ? (
                  <div className="text-center">
                    <button
                      onClick={handleSOSActivation}
                      className="group relative mx-auto mb-4 flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 lg:h-48 lg:w-48"
                    >
                      <div className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-20"></div>
                      <div className="relative flex flex-col items-center">
                        <AlertTriangle className="mb-2 h-12 w-12 text-white lg:h-16 lg:w-16" />
                        <span className="text-xl font-bold text-white lg:text-2xl">
                          SOS
                        </span>
                      </div>
                    </button>
                    <p className="mb-2 text-base font-medium text-gray-900 lg:text-lg">
                      Tap to activate emergency alert
                    </p>
                    <p className="text-sm text-gray-600 lg:text-base">
                      This will notify your company and emergency contacts
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl bg-red-50 p-6 lg:p-8">
                    <div className="mb-4 flex items-center justify-center">
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-red-600 lg:h-32 lg:w-32">
                        <div className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-75"></div>
                        <AlertTriangle className="relative h-12 w-12 text-white lg:h-16 lg:w-16" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="mb-2 text-xl font-bold text-red-900 lg:text-2xl">
                        SOS ACTIVATED
                      </h3>
                      <p className="mb-4 text-sm text-red-700 lg:text-base">
                        Emergency alert sent to all contacts
                      </p>
                      <div className="mb-4 flex items-center justify-center gap-2 text-gray-700">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm lg:text-base">
                          {currentLocation}
                        </span>
                      </div>
                      <button
                        onClick={() => setSosActivated(false)}
                        className="rounded-xl bg-white px-6 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-gray-50 lg:px-8 lg:py-3 lg:text-base"
                      >
                        Deactivate SOS
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Emergency Contacts */}
              <div className="rounded-2xl bg-white p-6 shadow-sm lg:p-8">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 lg:mb-6 lg:text-xl">
                  Emergency Contacts
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:gap-4">
                  {emergencyContacts.map((contact) => {
                    const Icon = contact.icon;
                    const colors = getColorClasses(contact.color);
                    return (
                      <button
                        key={contact.id}
                        onClick={() => handleEmergencyCall(contact)}
                        className={`flex items-center gap-4 rounded-xl border ${colors.border} ${colors.bg} p-4 text-left transition-all ${colors.hover} lg:p-5`}
                      >
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full ${colors.text} bg-white lg:h-14 lg:w-14`}
                        >
                          <Icon className="h-6 w-6 lg:h-7 lg:w-7" />
                        </div>
                        <div className="flex-1">
                          <h3 className="mb-0.5 font-semibold text-gray-900 lg:text-lg">
                            {contact.name}
                          </h3>
                          <p className="text-sm text-gray-600 lg:text-base">
                            {contact.number}
                          </p>
                        </div>
                        <Phone className="h-5 w-5 text-gray-400 lg:h-6 lg:w-6" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SOS History */}
              <div className="rounded-2xl bg-white p-6 shadow-sm lg:p-8">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 lg:mb-6 lg:text-xl">
                  Recent Alerts
                </h2>
                {sosHistory.length > 0 ? (
                  <div className="space-y-3 lg:space-y-4">
                    {sosHistory.map((alert) => (
                      <div
                        key={alert.id}
                        className="rounded-xl border border-gray-200 bg-gray-50 p-4 lg:p-5"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500 lg:h-5 lg:w-5" />
                            <span className="font-medium text-gray-900 lg:text-lg">
                              {alert.type}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 lg:px-3 lg:text-sm">
                            <CheckCircle2 className="h-3 w-3" />
                            {alert.status}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600 lg:text-base">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                            <span>{alert.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                            <span>{alert.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <CheckCircle2 className="mx-auto mb-2 h-12 w-12 text-gray-300 lg:h-14 lg:w-14" />
                    <p className="text-sm text-gray-500 lg:text-base">
                      No recent emergency alerts
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Current Trip & Safety Info */}
            <div className="space-y-6 lg:col-span-1">
              {/* Current Trip Info */}
              <div className="rounded-2xl bg-white p-6 shadow-sm lg:p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Current Trip
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                    <Car className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Trip ID</p>
                      <p className="font-medium text-gray-900">
                        {currentTrip.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                    <Navigation className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Route</p>
                      <p className="font-medium text-gray-900">
                        {currentTrip.route}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                    <Car className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Vehicle</p>
                      <p className="font-medium text-gray-900">
                        {currentTrip.vehicleNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Started At</p>
                      <p className="font-medium text-gray-900">
                        {currentTrip.startTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety Tips */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm lg:p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">
                    Safety Tips
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-blue-600">•</span>
                    <span>Always keep emergency contacts handy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-blue-600">•</span>
                    <span>Share your live location during trips</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-blue-600">•</span>
                    <span>Keep first aid kit in your vehicle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-blue-600">•</span>
                    <span>Regular vehicle maintenance checks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-blue-600">•</span>
                    <span>Stay alert and take regular breaks</span>
                  </li>
                </ul>
              </div>

              {/* Important Numbers Card */}
              <div className="rounded-2xl bg-white p-6 shadow-sm lg:p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Quick Dial
                </h3>
                <div className="space-y-2">
                  <a
                    href="tel:100"
                    className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3 text-blue-600 transition-colors hover:bg-blue-100"
                  >
                    <span className="font-medium">Police</span>
                    <span className="font-semibold">100</span>
                  </a>
                  <a
                    href="tel:108"
                    className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-red-600 transition-colors hover:bg-red-100"
                  >
                    <span className="font-medium">Ambulance</span>
                    <span className="font-semibold">108</span>
                  </a>
                  <a
                    href="tel:101"
                    className="flex items-center justify-between rounded-lg bg-orange-50 px-4 py-3 text-orange-600 transition-colors hover:bg-orange-100"
                  >
                    <span className="font-medium">Fire</span>
                    <span className="font-semibold">101</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedEmergency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl lg:p-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 lg:text-2xl">
                Confirm Call
              </h3>
              <button
                onClick={() => setShowConfirmation(false)}
                className="rounded-full p-1 transition-colors hover:bg-gray-100"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="mb-6 text-center">
              <div
                className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${getColorClasses(selectedEmergency.color).bg} lg:h-20 lg:w-20`}
              >
                <selectedEmergency.icon
                  className={`h-8 w-8 lg:h-10 lg:w-10 ${getColorClasses(selectedEmergency.color).text}`}
                />
              </div>
              <p className="mb-2 text-base text-gray-600 lg:text-lg">
                Call {selectedEmergency.name}?
              </p>
              <p className="text-2xl font-bold text-gray-900 lg:text-3xl">
                {selectedEmergency.number}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 lg:text-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmCall}
                className="flex-1 rounded-xl bg-[#f36969] px-4 py-3 font-medium text-white transition-colors hover:bg-[#f36565] lg:text-lg"
              >
                Call Now
              </button>
            </div>
          </div>
        </div>
      )}
    </ProfessionalProtected>
  );
}
