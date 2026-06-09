// app/api/issues/[id]/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Issue from '@/lib/models/Issue';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

// 1. Update the type definition: params is now a Promise
export async function PATCH(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== 'staff') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    const { status } = await request.json();

    // Make sure your validation array matches your exact database schema
    if (!['Reported', 'Working On', 'Resolved'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await connectDB();

    // 2. Await the params before trying to read the ID
    const { id } = await params;

    // 3. Find the issue by the resolved ID and update it
    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      { status },
      // 4. Use the new Mongoose syntax to clear the console warning
      { returnDocument: 'after' } 
    );

    if (!updatedIssue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, issue: updatedIssue }, { status: 200 });

  } catch (error) {
    console.error('Failed to update issue:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}