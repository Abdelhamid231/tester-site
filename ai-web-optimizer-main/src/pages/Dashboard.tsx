import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Globe, Shield, Gauge, Clock, Trash2, ExternalLink } from "lucide-react";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tests, setTests] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate("/signin");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      supabase.from("test_results").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10)
        .then(({ data }) => setTests(data || []));
    }
  }, [user]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary font-mono">LOADING...</div></div>;

  return (
    <Layout>
      <div className="min-h-screen pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <p className="text-primary font-mono text-sm mb-2">// OPERATOR DASHBOARD</p>
            <h1 className="text-3xl font-display font-bold">Welcome, <span className="text-primary">{user?.email?.split("@")[0]}</span></h1>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Tests", value: tests.length, icon: Activity, color: "primary" },
              { label: "Avg Performance", value: tests.length ? Math.round(tests.reduce((a, t) => a + (t.performance_score || 0), 0) / tests.length) : 0, icon: Gauge, color: "secondary" },
              { label: "Avg Security", value: tests.length ? Math.round(tests.reduce((a, t) => a + (t.security_score || 0), 0) / tests.length) : 0, icon: Shield, color: "accent" },
              { label: "URLs Tested", value: new Set(tests.map(t => t.url)).size, icon: Globe, color: "success" },
            ].map((stat, i) => (
              <Card key={i} className="cyber-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-mono">{stat.label}</p>
                      <p className="text-3xl font-display font-bold text-primary">{stat.value}</p>
                    </div>
                    <stat.icon className="w-8 h-8 text-primary/50" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="cyber-card">
            <CardHeader><CardTitle className="font-display text-primary">RECENT TESTS</CardTitle></CardHeader>
            <CardContent>
              {tests.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground font-mono mb-4">No tests yet</p>
                  <Button onClick={() => navigate("/testing")} className="bg-primary font-display">RUN FIRST TEST</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {tests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-primary/10">
                      <div className="flex items-center gap-4">
                        <Globe className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-mono text-sm">{test.url}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(test.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-primary font-mono text-sm">P:{test.performance_score}</span>
                        <span className="text-secondary font-mono text-sm">S:{test.security_score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
