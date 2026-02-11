import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createContact, fetchContacts } from '@/lib/wpgraphql';

const contactSchema = z.object({
  fullName: z.string().min(1),
  mobileNumber: z.string(),
  whatsappNumber: z.string(),
  personalEmail: z.string().email().or(z.literal('')),
  linkedinUrl: z.string(),
  organizationName: z.string(),
  designation: z.string(),
  officeLandline: z.string(),
  officialEmail: z.string().email().or(z.literal('')),
  institute: z.string(),
  sectors: z.array(z.string()),
  industries: z.array(z.string())
});

export async function GET() {
  try {
    const contacts = await fetchContacts();
    return NextResponse.json({ contacts });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const parsed = contactSchema.parse(await request.json());
    const created = await createContact(parsed);
    return NextResponse.json({ contact: created });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}
