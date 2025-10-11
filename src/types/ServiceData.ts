// Shared ServiceData type for service listings
export interface ServiceData {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  description: string;
  detailedDescription?: string;
  status: 'Published' | 'Draft';
  createdAt: string;
  updatedAt: string;
  images?: string[];
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  completedJobs?: number;
  pricing?: {
    amount?: string;
    currency: string;
    details?: string;
    type?: 'Fixed' | 'Hourly' | 'On Request';
  };
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  availability?: {
    days?: string[];
    hours?: string;
  };
  location?: string;
}

// Assignment/Booking related interfaces
export interface ServiceBooking {
  id: string;
  serviceId: string;
  serviceName: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  companyPhone: string;
  assignedBy: string;
  assignedDate: string;
  scheduledDate?: string;
  scheduledTime?: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  location: string;
  serviceType: string;
  category: string;
  pricing: {
    amount: string;
    currency: string;
  };
  duration?: string;
  bookedBy: 'Customer' | 'Company';
  notes?: string;
  internalNotes?: string;
}
