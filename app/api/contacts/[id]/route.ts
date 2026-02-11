import { NextResponse } from 'next/server';
import { z } from 'zod';
import { deleteContact, updateContact } from '@/lib/wpgraphql';

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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const parsed = contactSchema.parse(await request.json());
    const updated = await updateContact(params.id, parsed);
    return NextResponse.json({ contact: updated });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await deleteContact(params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 400 });
  }
}
