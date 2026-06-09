'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import StudentFeed from './StudentFeed';
import StaffQueue from './StaffQueue';

export default function DashboardPage() {
  const { data: session } = useSession();
  
  // Safely extract the role
  const role = (session?.user as any)?.role;

  // The Traffic Cop Logic
  if (role === 'staff') {
    return <StaffQueue />;
  }

  // Default to student view
  return <StudentFeed />;
}