import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, Activity, Shield, Database, BarChart3, Trash2, 
  Crown, UserCheck, AlertTriangle, Globe, Calendar, Eye
} from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  role?: string;
}

interface TestResult {
  id: string;
  url: string;
  user_id: string;
  performance_score: number | null;
  security_score: number | null;
  accessibility_score: number | null;
  seo_score: number | null;
  created_at: string;
  user_email?: string;
}

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, tests: 0, admins: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/");
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
    }
  }, [isAdmin]);

  const fetchAllData = async () => {
    setLoadingData(true);
    try {
      // Fetch users with their roles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: roles } = await supabase
        .from("user_roles")
        .select("*");

      const usersWithRoles = (profiles || []).map(profile => ({
        ...profile,
        role: roles?.find(r => r.user_id === profile.id)?.role || 'user'
      }));

      setUsers(usersWithRoles);

      // Fetch all test results
      const { data: tests } = await supabase
        .from("test_results")
        .select("*")
        .order("created_at", { ascending: false });

      // Attach user emails to test results
      const testsWithEmails = (tests || []).map(test => ({
        ...test,
        user_email: profiles?.find(p => p.id === test.user_id)?.email || 'Unknown'
      }));

      setTestResults(testsWithEmails);

      // Calculate stats
      const adminCount = roles?.filter(r => r.role === 'admin').length || 0;
      setStats({
        users: profiles?.length || 0,
        tests: tests?.length || 0,
        admins: adminCount
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load admin data");
    } finally {
      setLoadingData(false);
    }
  };

  const promoteToAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: 'admin' })
        .eq("user_id", userId);

      if (error) throw error;
      toast.success("User promoted to admin");
      fetchAllData();
    } catch (error) {
      console.error("Error promoting user:", error);
      toast.error("Failed to promote user");
    }
  };

  const demoteToUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: 'user' })
        .eq("user_id", userId);

      if (error) throw error;
      toast.success("User demoted to regular user");
      fetchAllData();
    } catch (error) {
      console.error("Error demoting user:", error);
      toast.error("Failed to demote user");
    }
  };

  const deleteTestResult = async (testId: string) => {
    try {
      const { error } = await supabase
        .from("test_results")
        .delete()
        .eq("id", testId);

      if (error) throw error;
      toast.success("Test result deleted");
      fetchAllData();
    } catch (error) {
      console.error("Error deleting test:", error);
      toast.error("Failed to delete test result");
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-muted-foreground";
    if (score >= 80) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-accent font-mono">VERIFYING ADMIN ACCESS...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen pt-8 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <p className="text-accent font-mono text-sm mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              // ADMIN CONTROL CENTER
            </p>
            <h1 className="text-4xl font-display font-bold text-accent mb-2">
              SYSTEM ADMINISTRATION
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.email}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Users", value: stats.users, icon: Users, color: "text-blue-400" },
              { label: "Admin Users", value: stats.admins, icon: Crown, color: "text-yellow-400" },
              { label: "Total Tests", value: stats.tests, icon: Activity, color: "text-green-400" },
              { label: "System Status", value: "ONLINE", icon: Database, color: "text-accent" },
            ].map((stat, i) => (
              <Card key={i} className="cyber-card border-accent/20 hover:border-accent/40 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-xs font-mono uppercase tracking-wider">{stat.label}</p>
                      <p className={`text-3xl font-display font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color} opacity-50`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="bg-muted/30 border border-accent/20">
              <TabsTrigger value="users" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground font-mono">
                <Users className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="tests" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground font-mono">
                <BarChart3 className="w-4 h-4 mr-2" />
                Test Results
              </TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card className="cyber-card border-accent/20">
                <CardHeader>
                  <CardTitle className="font-display text-accent flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    REGISTERED USERS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  ) : users.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No users registered yet</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-accent/20 hover:bg-transparent">
                            <TableHead className="text-accent font-mono">Email</TableHead>
                            <TableHead className="text-accent font-mono">Name</TableHead>
                            <TableHead className="text-accent font-mono">Role</TableHead>
                            <TableHead className="text-accent font-mono">Joined</TableHead>
                            <TableHead className="text-accent font-mono text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((u) => (
                            <TableRow key={u.id} className="border-accent/10 hover:bg-accent/5">
                              <TableCell className="font-mono text-sm">{u.email}</TableCell>
                              <TableCell>{u.full_name || "—"}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={u.role === 'admin' ? 'default' : 'secondary'}
                                  className={u.role === 'admin' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : ''}
                                >
                                  {u.role === 'admin' && <Crown className="w-3 h-3 mr-1" />}
                                  {u.role?.toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(u.created_at).toLocaleDateString()}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                {u.id !== user?.id && (
                                  u.role === 'admin' ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => demoteToUser(u.id)}
                                      className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                                    >
                                      <AlertTriangle className="w-3 h-3 mr-1" />
                                      Demote
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => promoteToAdmin(u.id)}
                                      className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                                    >
                                      <Crown className="w-3 h-3 mr-1" />
                                      Promote
                                    </Button>
                                  )
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Test Results Tab */}
            <TabsContent value="tests">
              <Card className="cyber-card border-accent/20">
                <CardHeader>
                  <CardTitle className="font-display text-accent flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    ALL TEST RESULTS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  ) : testResults.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No test results yet</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-accent/20 hover:bg-transparent">
                            <TableHead className="text-accent font-mono">URL</TableHead>
                            <TableHead className="text-accent font-mono">User</TableHead>
                            <TableHead className="text-accent font-mono text-center">Perf</TableHead>
                            <TableHead className="text-accent font-mono text-center">Sec</TableHead>
                            <TableHead className="text-accent font-mono text-center">A11y</TableHead>
                            <TableHead className="text-accent font-mono text-center">SEO</TableHead>
                            <TableHead className="text-accent font-mono">Date</TableHead>
                            <TableHead className="text-accent font-mono text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {testResults.map((test) => (
                            <TableRow key={test.id} className="border-accent/10 hover:bg-accent/5">
                              <TableCell className="font-mono text-sm max-w-[200px] truncate">
                                {test.url}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {test.user_email}
                              </TableCell>
                              <TableCell className={`text-center font-bold ${getScoreColor(test.performance_score)}`}>
                                {test.performance_score ?? "—"}
                              </TableCell>
                              <TableCell className={`text-center font-bold ${getScoreColor(test.security_score)}`}>
                                {test.security_score ?? "—"}
                              </TableCell>
                              <TableCell className={`text-center font-bold ${getScoreColor(test.accessibility_score)}`}>
                                {test.accessibility_score ?? "—"}
                              </TableCell>
                              <TableCell className={`text-center font-bold ${getScoreColor(test.seo_score)}`}>
                                {test.seo_score ?? "—"}
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {new Date(test.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="bg-background border-accent/20">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="text-accent">Delete Test Result?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete this test result. This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="border-accent/20">Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteTestResult(test.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
