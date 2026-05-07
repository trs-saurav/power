import { NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if current user is admin
    if (session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Since we're migrating from Clerk, we don't have Clerk invitations anymore.
    // If you implemented a custom invitation system in MongoDB, fetch those here.
    
    return NextResponse.json({ 
      invitations: [],
      total: 0,
      message: "Clerk invitations system is no longer used. Migrate to a custom system if needed."
    });

  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message
    }, { status: 500 });
  }
}
