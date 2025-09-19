"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Users, 
  Shield, 
  User, 
  Mail, 
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

const UsersPage = () => {
  const { getToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsersAndInvitations();
  }, []);

  const fetchUsersAndInvitations = async () => {
    try {
      const token = await getToken();
      
      const [usersResponse, invitationsResponse] = await Promise.all([
        fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/invitations', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users);
      }

      if (invitationsResponse.ok) {
        const invitationsData = await invitationsResponse.json();
        setInvitations(invitationsData.invitations);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return <Badge variant="destructive" className="text-xs">Admin</Badge>;
    }
    return <Badge variant="secondary" className="text-xs">Clerk</Badge>;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="default" className="text-xs bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-xs text-orange-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'revoked':
        return <Badge variant="outline" className="text-xs text-red-600"><XCircle className="w-3 h-3 mr-1" />Revoked</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Unknown</Badge>;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage team members and their access levels
          </p>
        </div>
        
        <Button asChild>
          <Link href="/admin/users/create" className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Invite User
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {invitations.filter(inv => inv.status === 'pending').length}
                </p>
                <p className="text-sm text-muted-foreground">Pending Invitations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {users.filter(user => user.role === 'admin').length}
                </p>
                <p className="text-sm text-muted-foreground">Administrators</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users and Invitations */}
      <div className="space-y-6">
        {/* Active Users */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Users</h2>
          <div className="grid gap-4">
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          {user.role === 'admin' ? (
                            <Shield className="w-6 h-6 text-primary" />
                          ) : (
                            <User className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">
                              {user.firstName} {user.lastName}
                            </h3>
                            {getRoleBadge(user.role)}
                            {getStatusBadge('accepted')}
                          </div>
                          
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {user.emailAddresses?.[0]?.emailAddress || 'No email'}
                            </div>
                            {user.phoneNumbers?.[0]?.phoneNumber && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                {user.phoneNumbers[0].phoneNumber}
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Joined {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pending Invitations */}
        {invitations.filter(inv => inv.status === 'pending').length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Pending Invitations</h2>
            <div className="grid gap-4">
              {invitations
                .filter(inv => inv.status === 'pending')
                .map((invitation, index) => (
                  <motion.div
                    key={invitation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-orange-200 bg-orange-50">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                              <Clock className="w-6 h-6 text-orange-600" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg">
                                  Invitation Sent
                                </h3>
                                {getRoleBadge(invitation.publicMetadata?.role)}
                                {getStatusBadge(invitation.status)}
                              </div>
                              
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  {invitation.emailAddress}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  Sent {new Date(invitation.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading users...</p>
          </div>
        )}

        {!loading && users.length === 0 && invitations.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No users found</h3>
              <p className="text-muted-foreground mb-6">
                Invite your first team member to get started
              </p>
              <Button asChild>
                <Link href="/admin/users/create">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite User
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
