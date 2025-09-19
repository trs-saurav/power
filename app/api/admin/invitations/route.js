import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { createClerkClient } from '@clerk/nextjs/server';

// Initialize clerkClient with your secret key
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if current user is admin
    const currentUser = await clerkClient.users.getUser(userId);
    if (currentUser.publicMetadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get all invitations
    const response = await clerkClient.invitations.getInvitationList();
    
    // Handle different response formats
    let invitationList = [];
    if (Array.isArray(response)) {
      invitationList = response;
    } else if (response.data && Array.isArray(response.data)) {
      invitationList = response.data;
    } else if (response.invitations && Array.isArray(response.invitations)) {
      invitationList = response.invitations;
    } else {
      console.warn('Unexpected invitations response format:', response);
      invitationList = [];
    }

    return NextResponse.json({ 
      invitations: invitationList,
      total: invitationList.length 
    });

  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message
    }, { status: 500 });
  }
}
