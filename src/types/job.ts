export interface JobApplication {
  applicationId?: string;
  applicantName?: string;
  email?: string;
  phone?: string;
  location?: string;
  experience?: string;
  appliedAt?: string;
  status?: string;
  coverLetter?: string;
  avatar?: string;
}

export interface BusinessJob {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  image: string;
  createdAt: string;
  status: 'Active' | 'Paused' | 'Closed';
  views: number;
  applications: JobApplication[];
  urgent?: boolean;
}
