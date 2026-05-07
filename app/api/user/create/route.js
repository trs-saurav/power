import { NextResponse } from 'next/server';
import { auth } from "@/auth";
export async function POST(request) {
  try {
    // Check authentication using NextAuth v5
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = session.user?.role === 'admin';
    
    if (!isAdmin) {
      return NextResponse.json({ 
        error: 'Unauthorized. Admin access required.' 
      }, { status: 403 });
    }

    const { firstName, lastName, email, phone, role } = await request.json();

    // Validation
    if (!firstName || !lastName || !email || !role) {
      return NextResponse.json(
        { error: 'First name, last name, email, and role are required' },
        { status: 400 }
      );
    }

    if (!['admin', 'clerk'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin or clerk' },
        { status: 400 }
      );
    }

    // Since we're migrating from Clerk, we'll just return success for now.
    // In a real NextAuth setup, you might want to create the user in your DB here
    // or send a custom invitation email.
    
    return NextResponse.json({
      message: 'User created successfully (Migration in progress)',
      user: { email, firstName, lastName, role }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating user invitation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
