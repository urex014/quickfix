import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '@/lib/models/User';

// Helper function to connect to DB (you might want to move this to a shared lib file)
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function POST(request: Request) {
  try {
    const { fullName, email, password, role } = await request.json();

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email is already in use' },
        { status: 400 }
      );
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: role || 'student', // Fallback to student just in case
    });

    return NextResponse.json(
      { message: 'User registered successfully', userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}