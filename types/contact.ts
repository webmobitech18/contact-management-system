export type Contact = {
  id: string;
  fullName: string;
  mobileNumber: string;
  whatsappNumber: string;
  personalEmail: string;
  linkedinUrl: string;
  organizationName: string;
  designation: string;
  officeLandline: string;
  officialEmail: string;
  institute: string;
  sectors: string[];
  industries: string[];
};

export type ContactInput = Omit<Contact, 'id'>;

export type ContactFilters = Partial<Record<keyof ContactInput, string>>;
