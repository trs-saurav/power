import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { createClerkClient } from '@clerk/nextjs/server';

// Initialize clerkClient with your secret key
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function POST(request) {
  console.log('POST /api/admin/users/create - Request received');
  
  try {
    // Check authentication
    const { userId } = getAuth(request);
    console.log('User ID from auth:', userId);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized - No user ID' }, { status: 401 });
    }

    // Verify clerkClient is initialized
    if (!clerkClient || !clerkClient.users) {
      console.error('clerkClient is not properly initialized');
      return NextResponse.json({ 
        error: 'Server configuration error: Clerk client not initialized' 
      }, { status: 500 });
    }

    // Get current user to check admin status
    let currentUser;
    try {
      currentUser = await clerkClient.users.getUser(userId);
      console.log('Current user fetched:', currentUser.id);
      console.log('Current user role:', currentUser.publicMetadata?.role);
    } catch (clerkUserError) {
      console.error('Error fetching current user:', clerkUserError);
      return NextResponse.json({ 
        error: 'Failed to verify user permissions: ' + clerkUserError.message 
      }, { status: 500 });
    }
    
    const isAdmin = currentUser.publicMetadata?.role === 'admin';
    
    if (!isAdmin) {
      return NextResponse.json({ 
        error: 'Unauthorized. Admin access required. Current role: ' + (currentUser.publicMetadata?.role || 'none')
      }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { firstName, lastName, email, phone, role } = body;
    
    console.log('Parsed request data:', { firstName, lastName, email, role });

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

    console.log('Creating invitation...');
    
    try {
      // Create invitation
      const invitationData = {
        emailAddress: email,
        publicMetadata: {
          role: role,
          createdBy: userId,
          createdAt: new Date().toISOString(),
          firstName: firstName,
          lastName: lastName
        }
      };

      // Add optional fields
      if (phone) {
        invitationData.privateMetadata = { phone };
      }

      const redirectUrl = process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL;
      if (redirectUrl) {
        invitationData.redirectUrl = redirectUrl;
      }

      console.log('Creating invitation with data:', invitationData);

      const invitation = await clerkClient.invitations.createInvitation(invitationData);

      console.log('Invitation created successfully:', {
        id: invitation.id,
        status: invitation.status,
        emailAddress: invitation.emailAddress
      });

      return NextResponse.json({
        message: 'User invitation sent successfully',
        invitation: {
          id: invitation.id,
          emailAddress: invitation.emailAddress,
          status: invitation.status
        }
      }, { status: 201 });

    } catch (clerkError) {
      console.error('Clerk invitation error:', clerkError);
      
      // Handle specific Clerk errors
      if (clerkError.errors && clerkError.errors.length > 0) {
        const errorMessage = clerkError.errors[0].message;
        const errorCode = clerkError.errors[0].code;
        
        if (errorCode === 'form_identifier_exists') {
          return NextResponse.json({ 
            error: 'A user with this email address already exists' 
          }, { status: 400 });
        }
        
        return NextResponse.json({ 
          error: `Clerk error: ${errorMessage}` 
        }, { status: 400 });
      }

      return NextResponse.json({
        error: 'Failed to send invitation: ' + clerkError.message
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Unexpected error in user creation API:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
