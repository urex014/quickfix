export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { v2 as cloudinary } from 'cloudinary';
import Issue from '@/lib/models/Issue';
import User from '@/lib/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

// ... keep your existing GET method exactly as it was ...
export async function GET() {
  try {
    await connectDB();
    const issues = await Issue.find({ status: { $ne: 'Resolved' } })
      .populate('reporterId', 'fullName') 
      .sort({ createdAt: -1 });
    return NextResponse.json(issues, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load issues' }, { status: 500 });
  }
}

// 2. Updated POST method with Cloudinary Upload
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const formData = await request.formData();
    const venue = formData.get('venue');
    const description = formData.get('description');
    const severity = formData.get('severity');
    const file = formData.get('image') as File | null;

    if (!venue || !description || !severity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let imageUrl = null;

    // --- CLOUDINARY UPLOAD LOGIC ---
    if (file && file.size > 0) {
      // A. Convert the File to a Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // B. Convert Buffer to a Base64 string with the correct MIME type
      const base64Data = buffer.toString('base64');
      const fileUri = `data:${file.type};base64,${base64Data}`;

      // C. Upload to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(fileUri, {
        folder: 'quick_fix_issues', // Keeps your Cloudinary dashboard organized
      });

      // D. Grab the secure URL they send back
      imageUrl = uploadResponse.secure_url;
    }
    // --------------------------------

    const newIssue = await Issue.create({
      venue,
      description,
      severity,
      imageUrl,
      reporterId: (session.user as any).id, 
    });

    return NextResponse.json({ success: true, issue: newIssue }, { status: 201 });

  } catch (error) {
    console.error('Failed to create issue:', error);
    return NextResponse.json(
      { error: 'Server error. Could not report issue.' },
      { status: 500 }
    );
  }
}