import type { Contact, ContactInput } from '@/types/contact';

export const contactDefaults: ContactInput = {
  fullName: '',
  mobileNumber: '',
  whatsappNumber: '',
  personalEmail: '',
  linkedinUrl: '',
  organizationName: '',
  designation: '',
  officeLandline: '',
  officialEmail: '',
  institute: '',
  sectors: [],
  industries: []
};

export const contactFields: Array<{ key: keyof ContactInput; label: string; type?: string }> = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'mobileNumber', label: 'Mobile Number' },
  { key: 'whatsappNumber', label: 'Whatsapp Number' },
  { key: 'personalEmail', label: 'Email (Personal)', type: 'email' },
  { key: 'linkedinUrl', label: 'Personal LinkedIn URL' },
  { key: 'organizationName', label: 'Organization Name' },
  { key: 'designation', label: 'Designation' },
  { key: 'officeLandline', label: 'Office Landline' },
  { key: 'officialEmail', label: 'Email (Official)', type: 'email' },
  { key: 'institute', label: 'Relevant Institute / Affiliate' }
];

export const searchableFields: Array<{ key: keyof Contact; label: string }> = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'mobileNumber', label: 'Mobile Number' },
  { key: 'whatsappNumber', label: 'Whatsapp Number' },
  { key: 'personalEmail', label: 'Personal Email' },
  { key: 'linkedinUrl', label: 'LinkedIn URL' },
  { key: 'organizationName', label: 'Organization Name' },
  { key: 'designation', label: 'Designation' },
  { key: 'officeLandline', label: 'Office Landline' },
  { key: 'officialEmail', label: 'Official Email' },
  { key: 'institute', label: 'Institute' },
  { key: 'sectors', label: 'Sectors' },
  { key: 'industries', label: 'Industries' }
];
