import { NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { firstName, lastName, email, phone, role } = body;
    
    // Validation
    if (!firstName || !lastName || email || !role) {
      return NextResponse.json(
        { error: 'First name, last name, email, and role are required' },
        { status: 400 }
      );
    }

    // Since we're migrating from Clerk, we don't use Clerk invitations anymore.
    // In a NextAuth setup, you'd usually create the user record in your DB here
    // with a placeholder password, or send a custom onboarding email.
    
    return NextResponse.json({
      message: 'User creation initiated (Migration in progress). Clerk invitations are disabled.',
      user: { firstName, lastName, email, role }
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error in user creation API:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error.message
    }, { status: 500 });
  }
}
