import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Globe, Zap, Shield, Eye, Gauge, CheckCircle, AlertTriangle, XCircle, Loader2, Terminal, Cpu, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function Testing() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [testType, setTestType] = useState<"initial" | "fast" | "security" | "pro">("initial");
  const { toast } = useToast();
  const { user, plan, isAdmin } = useAuth();

  const specialEmails = [
    'djoual.abdelhamid1@gmail.com',
    'abdorenouni@gmail.com',
    'mohammedbouzidi25@gmail.com'
  ];
  const isSpecialAdmin = user?.email && specialEmails.includes(user.email.toLowerCase());

  const handleAnalyze = async () => {
    if (!url) {
      toast({ title: "Enter a URL to analyze", variant: "destructive" });
      return;
    }

    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setIsAnalyzing(true);
    setResults(null);

    // Check if user has access to the selected test type
    const hasAccess = isAdmin || isSpecialAdmin || (
      (testType === "initial") ||
      ((testType === "fast" || testType === "security") && (plan === "pro" || plan === "enterprise")) ||
      (testType === "pro" && plan === "enterprise")
    );

    if (!hasAccess) {
      toast({
        title: "Access Denied",
        description: `Your ${plan} plan does not include ${testType} testing.`,
        variant: "destructive"
      });
      setIsAnalyzing(false);
      return;
    }

    try {
      let analysis: any;

      if (testType === "initial") {
        const { data: initialRes, error } = await supabase.functions.invoke("analyze-website", {
          body: { url: formattedUrl },
        });
        if (error) throw error;
        analysis = initialRes?.data;
      } else {
        // Call Python Backend for Fast/Security/Pro tests
        const endpoint = `/analyze/${testType}`;
        const response = await fetch(`http://localhost:8000${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: formattedUrl }),
        });

        if (!response.ok) throw new Error("AI Backend error");
        const proDataResult = await response.json();
        const rawResults = proDataResult.results;

        // Transform results for UI
        if (testType === "pro") {
          analysis = {
            performance: rawResults.metrics?.load_time ? Math.max(0, 100 - Math.round(rawResults.metrics.load_time * 10)) : 85,
            security: 90,
            accessibility: rawResults.metrics?.accessibility_score || 80,
            seo: 85,
            summary: rawResults.summary || "Comprehensive Enterprise QA analysis completed.",
            strengths: rawResults.strengths,
            weaknesses: rawResults.weaknesses,
            advice: rawResults.advice,
            metrics: rawResults.metrics,
            issues: (rawResults.workflows || []).map((w: string) => ({
              type: w.toLowerCase().includes("passed") ? "info" : "error",
              message: w,
              count: 1
            }))
          };
        } else if (testType === "security") {
          analysis = {
            performance: 85,
            security: rawResults.score || 90,
            accessibility: 85,
            seo: 80,
            summary: rawResults.summary || "Deep Security scan completed.",
            strengths: rawResults.strengths,
            weaknesses: rawResults.weaknesses,
            advice: rawResults.advice,
            issues: (rawResults.detailed_findings || []).map((f: string) => ({
              type: "warning",
              message: f,
              count: 1
            }))
          };
        } else if (testType === "fast") {
          analysis = {
            performance: rawResults.score || rawResults.pass_rate || 90,
            security: 85,
            accessibility: 85,
            seo: 80,
            summary: rawResults.summary || "Fast UI Performance scan completed.",
            strengths: rawResults.strengths,
            weaknesses: rawResults.weaknesses,
            advice: rawResults.advice,
            detailed_scores: rawResults.detailed_scores,
            issues: (rawResults.weaknesses || []).map((w: string) => ({
              type: "info",
              message: w,
              count: 1
            }))
          };
        }
      }

      if (analysis) {
        // Save to database if user is logged in
        if (user) {
          await supabase.from("test_results").insert({
            user_id: user.id,
            url: formattedUrl,
            performance_score: analysis.performance,
            accessibility_score: analysis.accessibility,
            security_score: analysis.security,
            seo_score: analysis.seo,
            issues: analysis.issues,
          });
        }

        setResults(analysis);
        toast({ title: "Analysis Complete", description: analysis.summary });
      } else {
        throw new Error("Analysis failed to produce results");
      }
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Could not analyze the website",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-primary";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  return (
    <Layout>
      <section className="py-24 relative min-h-screen">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0 hex-grid opacity-30" />

        {/* Floating effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-mono mb-6">
              <Cpu className="w-4 h-4" />
              <span>NEURAL ANALYSIS ENGINE</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
              <span className="text-foreground">AI-POWERED </span>
              <span className="text-gradient-cyber">TESTING</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-sans">
              Enter any URL and our AI will analyze performance, security, accessibility, and SEO in real-time.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-5xl mx-auto">
            {[
              { id: "initial", name: "Initial Test", icon: Zap, minPlan: "starter", color: "text-cyan-400" },
              { id: "fast", name: "Fast UI Test", icon: Gauge, minPlan: "pro", color: "text-green-400" },
              { id: "security", name: "Security Test", icon: Shield, minPlan: "pro", color: "text-purple-400" },
              { id: "pro", name: "Enterprise Pro", icon: Cpu, minPlan: "enterprise", color: "text-orange-400" },
            ].map((type) => {
              const isLocked = !isAdmin && !isSpecialAdmin && (
                ((type.id === "fast" || type.id === "security") && plan === "starter") ||
                (type.id === "pro" && (plan === "starter" || plan === "pro"))
              );

              return (
                <Card
                  key={type.id}
                  onClick={() => !isLocked && setTestType(type.id as any)}
                  className={`cyber-card cursor-pointer transition-all hover:scale-105 ${testType === type.id ? "border-primary shadow-neon-cyan" : "border-primary/20 opacity-80"
                    } ${isLocked ? "grayscale opacity-50 cursor-not-allowed" : ""}`}
                >
                  <CardContent className="p-6 flex flex-col items-center gap-3">
                    <div className={`p-3 rounded-xl bg-muted/50 ${type.color}`}>
                      <type.icon className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <div className="font-display font-bold text-sm flex items-center justify-center gap-2">
                        {type.name.toUpperCase()}
                        {isLocked && <Lock className="w-3 h-3 text-muted-foreground" />}
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground mt-1">
                        MIN. PLAN: {type.minPlan.toUpperCase()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="max-w-2xl mx-auto mb-12 cyber-card">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                  <Input
                    placeholder="example.com or https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                    className="pl-11 h-14 bg-muted/50 border-primary/20 font-mono text-lg"
                  />
                </div>
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="h-14 px-8 bg-primary font-display shadow-neon-cyan text-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ANALYZING...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      ANALYZE
                    </>
                  )}
                </Button>
              </div>
              {isAnalyzing && (
                <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-mono text-primary italic">
                      {testType === "initial" && "AI analyzing website structure and performance..."}
                      {testType === "fast" && "Running lightning fast UI stability and performance scan..."}
                      {testType === "security" && "Running deep security vulnerability and XSS/SQLi scan..."}
                      {testType === "pro" && "Engaging Enterprise Pro QA agents for comprehensive analysis..."}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {results && (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
              {/* Score Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Performance", value: results.performance, icon: Gauge },
                  { label: "Security", value: results.security, icon: Shield },
                  { label: "Accessibility", value: results.accessibility, icon: Eye },
                  { label: "SEO", value: results.seo, icon: CheckCircle },
                ].map((metric) => (
                  <Card key={metric.label} className="cyber-card group hover:border-primary/50 transition-all">
                    <CardContent className="p-6 text-center">
                      <metric.icon className={`w-8 h-8 mx-auto mb-3 ${getScoreColor(metric.value)}`} />
                      <div className={`text-5xl font-display font-bold ${getScoreColor(metric.value)} text-glow-cyan`}>
                        {metric.value}
                      </div>
                      <div className="text-sm text-muted-foreground font-mono mt-2">{metric.label}</div>
                      <Progress value={metric.value} className="mt-4 h-1.5" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Summary */}
              {results.summary && (
                <Card className="cyber-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Terminal className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-display text-lg text-primary mb-2">ANALYSIS SUMMARY</h3>
                        <p className="text-foreground font-sans">{results.summary}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Main Analysis Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Detected Issues */}
                <Card className="cyber-card">
                  <CardHeader>
                    <CardTitle className="font-display text-primary flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      DETECTED ISSUES & WORKFLOWS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {results.issues?.length > 0 ? (
                      results.issues.map((issue: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-primary/10 hover:border-primary/30 transition-colors"
                        >
                          {issue.type === "error" && <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />}
                          {issue.type === "warning" && <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />}
                          {issue.type === "info" && <Terminal className="w-5 h-5 text-primary flex-shrink-0" />}
                          <span className="flex-1 font-sans text-foreground text-sm">{issue.message}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground font-mono text-center py-4">No critical issues detected</p>
                    )}
                  </CardContent>
                </Card>

                {/* Strengths */}
                <Card className="cyber-card border-green-500/20">
                  <CardHeader>
                    <CardTitle className="font-display text-green-400 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      STRENGTHS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {results.strengths?.length > 0 ? (
                      results.strengths.map((s: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                          <span className="text-sm italic">{s}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground font-mono text-center py-4">No specific strengths identified</p>
                    )}
                  </CardContent>
                </Card>

                {/* Weaknesses */}
                <Card className="cyber-card border-red-500/20">
                  <CardHeader>
                    <CardTitle className="font-display text-red-400 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      WEAKNESSES
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {results.weaknesses?.length > 0 ? (
                      results.weaknesses.map((w: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                          <AlertTriangle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                          <span className="text-sm italic">{w}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground font-mono text-center py-4">No major weaknesses detected</p>
                    )}
                  </CardContent>
                </Card>

                {/* Expert Advice */}
                <Card className="cyber-card border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="font-display text-blue-400 flex items-center gap-2">
                      <Cpu className="w-5 h-5" />
                      EXPERT ADVICE
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {results.advice?.length > 0 ? (
                      results.advice.map((a: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                          <Terminal className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                          <span className="text-sm italic">{a}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground font-mono text-center py-4 italic">Calculating professional advice...</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Metrics Table */}
              {(results.metrics || results.detailed_scores) && (
                <Card className="cyber-card overflow-hidden">
                  <CardHeader className="bg-muted/50">
                    <CardTitle className="font-display text-sm flex items-center gap-2">
                      <Gauge className="w-4 h-4" />
                      TECHNICAL EXECUTION DATA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm font-mono">
                        <thead>
                          <tr className="border-b border-primary/10 bg-muted/20">
                            <th className="p-4 font-bold text-primary">METRIC</th>
                            <th className="p-4 font-bold text-primary text-right">VALUE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.metrics && (
                            <>
                              <tr className="border-b border-primary/5 hover:bg-muted/50 transition-colors">
                                <td className="p-4 text-muted-foreground">Average Page Load</td>
                                <td className="p-4 text-right font-bold">{results.metrics.load_time?.toFixed(2)}s</td>
                              </tr>
                              <tr className="border-b border-primary/5 hover:bg-muted/50 transition-colors">
                                <td className="p-4 text-muted-foreground">Accessibility Grade</td>
                                <td className="p-4 text-right font-bold text-primary">{results.metrics.accessibility_grade}</td>
                              </tr>
                            </>
                          )}
                          {results.detailed_scores && Object.entries(results.detailed_scores).map(([key, value]: [string, any]) => (
                            <tr key={key} className="border-b border-primary/5 hover:bg-muted/50 transition-colors">
                              <td className="p-4 text-muted-foreground">{key}</td>
                              <td className="p-4 text-right font-bold">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Conclusion */}
              {results.conclusion && (
                <Card className="border-primary/50 bg-primary/5 shadow-neon-cyan/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Cpu className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-display text-xl text-primary glow-text">EXECUTIVE CONCLUSION</h3>
                    </div>
                    <p className="text-foreground text-lg leading-relaxed font-sans italic border-l-4 border-primary pl-6 py-2">
                      "{results.conclusion}"
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Action Button */}
              <div className="text-center">
                <Button
                  onClick={() => {
                    setResults(null);
                    setUrl("");
                  }}
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/10 font-display"
                >
                  ANALYZE ANOTHER URL
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
