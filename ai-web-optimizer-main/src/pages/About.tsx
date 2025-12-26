import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Shield, BarChart3, Eye, Cpu, Database, Zap, Code2, Globe } from "lucide-react";

const capabilities = [
  {
    icon: Bot,
    title: "AI-Powered Analysis",
    description: "Advanced machine learning models analyze your website structure, code patterns, and potential vulnerabilities in real-time.",
  },
  {
    icon: Shield,
    title: "Security Scanning",
    description: "Detect security headers, HTTPS configuration, XSS vulnerabilities, and other security issues before attackers do.",
  },
  {
    icon: BarChart3,
    title: "Performance Metrics",
    description: "Comprehensive performance analysis including load time optimization, resource efficiency, and caching strategies.",
  },
  {
    icon: Eye,
    title: "Accessibility Testing",
    description: "WCAG compliance checking, screen reader compatibility, keyboard navigation, and color contrast analysis.",
  },
  {
    icon: Code2,
    title: "SEO Analysis",
    description: "Meta tag validation, semantic HTML structure, mobile-friendliness, and search engine optimization scoring.",
  },
  {
    icon: Database,
    title: "Test History",
    description: "Track your testing history, monitor improvements over time, and export detailed reports.",
  },
];

const techStack = [
  { name: "Neural AI", description: "Powered by advanced language models" },
  { name: "Real-time", description: "Instant analysis and results" },
  { name: "Secure", description: "Your data is never stored or shared" },
  { name: "Accurate", description: "Industry-standard testing criteria" },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0 hex-grid opacity-30" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-mono mb-6">
              <Cpu className="w-4 h-4" />
              <span>ABOUT WEBTESTER</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              <span className="text-foreground">NEXT-GEN </span>
              <span className="text-gradient-cyber">WEB TESTING</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-sans">
              WebTester combines artificial intelligence with comprehensive testing methodologies 
              to help developers build faster, more secure, and accessible web applications.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24 relative border-y border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-primary font-mono text-sm mb-4">// MISSION</p>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  <span className="text-foreground">WHAT </span>
                  <span className="text-gradient-cyber">WE DO</span>
                </h2>
                <p className="text-muted-foreground text-lg font-sans mb-6">
                  We provide intelligent web testing tools that analyze your applications for 
                  performance bottlenecks, security vulnerabilities, accessibility issues, 
                  and SEO optimization opportunities.
                </p>
                <p className="text-muted-foreground font-sans">
                  Our AI-powered platform processes your website in real-time, delivering 
                  actionable insights that help you build better applications faster.
                </p>
              </div>
              <Card className="cyber-card">
                <CardContent className="p-8">
                  <div className="w-20 h-20 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 shadow-neon-cyan">
                    <Zap className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-foreground mb-4">AI-First Approach</h3>
                  <p className="text-muted-foreground font-sans">
                    Every analysis is powered by advanced AI models that understand modern web 
                    development patterns, security best practices, and accessibility standards.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary font-mono text-sm mb-4">// CAPABILITIES</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              <span className="text-foreground">WHAT WE </span>
              <span className="text-gradient-cyber">ANALYZE</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-sans">
              Comprehensive testing across all critical aspects of web development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {capabilities.map((capability, index) => (
              <Card key={index} className="cyber-card group hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:shadow-neon-cyan transition-all">
                    <capability.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-2 text-foreground">{capability.title}</h3>
                  <p className="text-muted-foreground font-sans">{capability.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 relative border-y border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <p className="text-primary font-mono text-sm mb-4">// TECHNOLOGY</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              <span className="text-foreground">BUILT WITH </span>
              <span className="text-gradient-cyber">MODERN TECH</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {techStack.map((tech, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:shadow-neon-cyan transition-all">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground">{tech.name}</h3>
                <p className="text-sm text-muted-foreground font-mono">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              <span className="text-foreground">READY TO </span>
              <span className="text-gradient-cyber">TEST?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 font-sans">
              Start analyzing your web applications with our AI-powered testing platform.
            </p>
            <a
              href="/testing"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-display tracking-wider shadow-neon-cyan hover:opacity-90 transition-opacity"
            >
              <Zap className="w-5 h-5" />
              START TESTING
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
