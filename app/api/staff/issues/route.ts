// app/api/staff/issues/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Issue from '@/lib/models/Issue';
import User from '@/lib/models/User';

export const dynamic = 'force-dynamic';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Block non-staff members
    if (!session || (session.user as any).role !== 'staff') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    // Fetch ALL issues, no filters, sorted newest to oldest
    const issues = await Issue.find({})
      .populate('reporterId', 'fullName')
      .sort({ createdAt: -1 });

    return NextResponse.json(issues, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load issues' }, { status: 500 });
  }
}