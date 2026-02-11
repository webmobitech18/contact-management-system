import { NextResponse } from 'next/server';
import { fetchLookups } from '@/lib/wpgraphql';

export async function GET() {
  try {
    const lookups = await fetchLookups();
    return NextResponse.json(lookups);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
