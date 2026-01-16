import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Users, Shield, Stethoscope, User as UserIcon, Clock, Activity, Trash2, RefreshCcw } from "lucide-react";
import { supabase } from "../utils/supabase/client";
import { toast } from "sonner@2.0.3";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface User {
  id: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  name: string;
  metadata?: any;
}

interface UserManagementProps {
  user: User;
}

export function UserManagement({ user }: UserManagementProps) {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loginLogs, setLoginLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch all users from Supabase Auth
      const { data: authUsers, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
        return;
      }

      // Fetch user profiles to get role information
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('*');

      // Combine auth data with profile data
      const usersWithRoles = authUsers.users.map((authUser: any) => {
        const profile = profiles?.find((p: any) => p.user_id === authUser.id);
        return {
          id: authUser.id,
          email: authUser.email,
          name: profile?.name || authUser.user_metadata?.name || 'Unknown User',
          role: profile?.role || authUser.user_metadata?.role || 'patient',
          createdAt: authUser.created_at,
          metadata: authUser.user_metadata
        };
      });

      // Separate by role
      setPatients(usersWithRoles.filter((u: any) => u.role === 'patient'));
      setDoctors(usersWithRoles.filter((u: any) => u.role === 'doctor'));
      setAdmins(usersWithRoles.filter((u: any) => u.role === 'admin'));
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const fetchLoginLogs = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('auth_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setLoginLogs(data || []);
      setSelectedUserId(userId);
    } catch (error) {
      console.error('Error fetching login logs:', error);
      toast.error('Failed to fetch activity logs');
    }
  };

  const clearAllHistory = async () => {
    try {
      setClearing(true);
      
      // Clear auth logs
      const { error: logsError } = await supabase
        .from('auth_logs')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except impossible ID

      if (logsError) {
        console.error('Error clearing auth logs:', logsError);
      }

      // Add a marker for when history was cleared
      await supabase
        .from('auth_logs')
        .insert({
          user_id: user.id,
          action: 'history_cleared',
          ip_address: 'system',
          user_agent: 'Admin Action',
          metadata: { cleared_by: user.email, cleared_at: new Date().toISOString() }
        });

      toast.success('All login and registration history has been cleared successfully');
      toast.info('New activity will be tracked from now on');
      
      // Refresh data
      setLoginLogs([]);
      setSelectedUserId(null);
      await fetchUserData();
    } catch (error) {
      console.error('Error clearing history:', error);
      toast.error('Failed to clear history');
    } finally {
      setClearing(false);
    }
  };

  const deleteUser = async (userId: string, userName: string) => {
    try {
      // Delete user from Supabase Auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) throw authError;

      // Delete associated profile
      await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);

      // Delete associated logs
      await supabase
        .from('auth_logs')
        .delete()
        .eq('user_id', userId);

      toast.success(`User ${userName} has been deleted`);
      await fetchUserData();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'patient': return <UserIcon className="h-4 w-4" />;
      case 'doctor': return <Stethoscope className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      default: return <UserIcon className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'patient': return 'bg-blue-100 text-blue-800';
      case 'doctor': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const UserTable = ({ users, role }: { users: any[], role: string }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getRoleIcon(role)}
          <h3 className="text-lg font-semibold capitalize">{role}s ({users.length})</h3>
        </div>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No {role}s found
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(role)}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchLoginLogs(u.id)}
                      >
                        <Activity className="h-4 w-4 mr-1" />
                        View Logs
                      </Button>
                      {user.id !== u.id && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {u.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteUser(u.id, u.name)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage system users across all roles
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={fetchUserData}
            disabled={loading}
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All Login & Registration History</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all historical login and registration data. 
                  User accounts will remain, but all activity logs will be cleared. 
                  New activity will be tracked from this point forward.
                  <br /><br />
                  <strong>This action cannot be undone.</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={clearAllHistory}
                  disabled={clearing}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {clearing ? 'Clearing...' : 'Clear History'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <UserIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{patients.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered patient accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            <Stethoscope className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{doctors.length}</div>
            <p className="text-xs text-muted-foreground">
              Active medical professionals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{admins.length}</div>
            <p className="text-xs text-muted-foreground">
              System administrators
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Registrations</CardTitle>
                <CardDescription>
                  Latest user accounts created in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...patients, ...doctors, ...admins]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map((u) => (
                      <div key={u.id} className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(u.role || 'patient')}
                          <div>
                            <p className="font-medium">{u.name}</p>
                            <p className="text-sm text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                        <div className="ml-auto">
                          <Badge className={getRoleBadgeColor(u.role || 'patient')}>
                            {(u.role || 'patient').charAt(0).toUpperCase() + (u.role || 'patient').slice(1)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>
                  Overall system statistics and health metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Users</span>
                    <span className="font-medium">{patients.length + doctors.length + admins.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Sessions</span>
                    <span className="font-medium">--</span>
                  </div>
                  <div className="flex justify-between">
                    <span>System Uptime</span>
                    <span className="font-medium">99.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Backup</span>
                    <span className="font-medium">2 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients">
          <UserTable users={patients} role="patient" />
        </TabsContent>

        <TabsContent value="doctors">
          <UserTable users={doctors} role="doctor" />
        </TabsContent>

        <TabsContent value="admins">
          <UserTable users={admins} role="admin" />
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>User Activity Logs</span>
              </CardTitle>
              <CardDescription>
                {selectedUserId ? 'Login activity for selected user' : 'Select a user to view their activity logs'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedUserId ? (
                <div className="space-y-4">
                  {loginLogs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No activity logs found for this user
                    </div>
                  ) : (
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Action</TableHead>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>IP Address</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loginLogs.map((log: any) => (
                            <TableRow key={log.id}>
                              <TableCell>
                                <Badge variant={log.action === 'login' || log.action === 'register' ? 'default' : 'secondary'}>
                                  {log.action}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(log.created_at).toLocaleString()}
                              </TableCell>
                              <TableCell>{log.ip_address || 'N/A'}</TableCell>
                              <TableCell>
                                <Badge variant={log.success ? 'default' : 'destructive'}>
                                  {log.success ? 'Success' : 'Failed'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Select a user from the other tabs to view their activity logs
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}