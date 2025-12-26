import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import {
  Zap,
  Shield,
  BarChart3,
  Bot,
  Globe,
  Code2,
  ArrowRight,
  Terminal,
  Cpu,
  Database,
  ChevronRight,
  Eye,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Analysis",
    description: "Advanced machine learning models analyze your website for performance, security, and accessibility issues.",
  },
  {
    icon: Shield,
    title: "Security Scanning",
    description: "Detect vulnerabilities, missing headers, and security misconfigurations before they become problems.",
  },
  {
    icon: BarChart3,
    title: "Performance Metrics",
    description: "Get detailed insights on load times, resource optimization, and actionable improvement suggestions.",
  },
  {
    icon: Eye,
    title: "Accessibility Testing",
    description: "WCAG compliance checking, screen reader compatibility, and inclusive design recommendations.",
  },
  {
    icon: Code2,
    title: "SEO Optimization",
    description: "Meta tag analysis, semantic HTML validation, and search engine ranking improvements.",
  },
  {
    icon: Database,
    title: "Test History",
    description: "Track your progress over time with saved results and improvement metrics.",
  },
];

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0 hex-grid opacity-50" />
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-2s" }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-4s" }} />

        {/* Scanner Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scanner" />
        </div>

        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-mono mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>AI-POWERED TESTING</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">REAL-TIME ANALYSIS</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-6 animate-fade-in-up">
              <span className="text-foreground">NEXT-GEN</span>
              <br />
              <span className="text-gradient-cyber text-glow-cyan">WEB TESTING</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up font-sans" style={{ animationDelay: "0.2s" }}>
              Analyze your website with <span className="text-primary">artificial intelligence</span>. 
              Get instant insights on performance, security, and accessibility.
            </p>

            {/* Terminal Preview */}
            <div className="max-w-xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="cyber-card rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-primary/20 bg-muted/30">
                  <div className="w-3 h-3 rounded-full bg-destructive/50" />
                  <div className="w-3 h-3 rounded-full bg-warning/50" />
                  <div className="w-3 h-3 rounded-full bg-success/50" />
                  <span className="ml-2 text-xs text-muted-foreground font-mono">webtester.io</span>
                </div>
                <div className="p-4 font-mono text-sm text-left">
                  <p className="text-muted-foreground">
                    <span className="text-primary">$</span> webtester analyze https://yoursite.com
                  </p>
                  <p className="text-success mt-2">
                    ✓ Performance Score: 94/100
                  </p>
                  <p className="text-primary mt-1">
                    ✓ Security: No vulnerabilities detected
                  </p>
                  <p className="text-secondary mt-1">
                    ✓ Accessibility: WCAG 2.1 AA compliant
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              {user ? (
                <Button 
                  size="lg" 
                  onClick={() => navigate("/testing")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon-cyan font-display tracking-wider text-lg px-8 pulse-border"
                >
                  START ANALYSIS
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              ) : (
                <>
                  <Link to="/testing">
                    <Button 
                      size="lg" 
                      className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon-cyan font-display tracking-wider text-lg px-8 pulse-border"
                    >
                      TRY IT FREE
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-primary/30 text-primary hover:bg-primary/10 font-display tracking-wider text-lg px-8"
                    >
                      LEARN MORE
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary font-mono text-sm mb-4">// CAPABILITIES</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-foreground">WHAT WE </span>
              <span className="text-gradient-cyber">ANALYZE</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-sans">
              Comprehensive testing powered by advanced AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="cyber-card group hover:border-primary/50 transition-all duration-500 cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:shadow-neon-cyan transition-all duration-300">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground font-sans">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative border-y border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <p className="text-primary font-mono text-sm mb-4">// PROCESS</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-foreground">HOW IT </span>
              <span className="text-gradient-cyber">WORKS</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "ENTER URL",
                description: "Paste any website URL you want to analyze.",
                icon: Globe,
              },
              {
                step: "02",
                title: "AI ANALYZES",
                description: "Our AI scans performance, security, and accessibility.",
                icon: Cpu,
              },
              {
                step: "03",
                title: "GET RESULTS",
                description: "Receive detailed scores and actionable recommendations.",
                icon: BarChart3,
              },
            ].map((item, index) => (
              <div key={index} className="relative text-center group">
                <div className="text-8xl font-display font-bold text-primary/10 mb-4 group-hover:text-primary/20 transition-colors">
                  {item.step}
                </div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:shadow-neon-cyan transition-all duration-300">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground font-sans">{item.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/4 right-0 w-1/2 border-t border-dashed border-primary/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 hex-grid opacity-30" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-neon-cyan">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              <span className="text-foreground">READY TO </span>
              <span className="text-gradient-cyber">ANALYZE?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 font-sans">
              Start testing your website for free. No credit card required.
            </p>
            <Link to="/testing">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon-cyan font-display tracking-wider text-lg px-12 pulse-border"
              >
                <Zap className="mr-2 w-5 h-5" />
                START FREE ANALYSIS
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
