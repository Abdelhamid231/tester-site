import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Zap, Mail, Lock, Github, Eye, EyeOff, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Authentication Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Access Granted",
        description: "Welcome back, operator.",
      });
      navigate("/dashboard");
    }
  };

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0 hex-grid opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />

        <Card className="w-full max-w-md relative cyber-card rounded-xl overflow-hidden animate-scale-in">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
          
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-neon-cyan">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
              </Link>
              <h1 className="text-2xl font-display font-bold text-foreground">SYSTEM ACCESS</h1>
              <p className="text-muted-foreground font-mono text-sm mt-2">// authenticate to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-primary font-mono text-xs tracking-wider">EMAIL_ADDRESS</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="operator@webtester.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-muted/50 border-primary/20 focus:border-primary/50 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-primary font-mono text-xs tracking-wider">PASSWORD</Label>
                  <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-primary font-mono">
                    RECOVER_ACCESS
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-muted/50 border-primary/20 focus:border-primary/50 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon-cyan font-display tracking-wider"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 animate-pulse" />
                    AUTHENTICATING...
                  </span>
                ) : (
                  "INITIALIZE SESSION"
                )}
              </Button>
            </form>

            <div className="relative my-8">
              <Separator className="bg-primary/20" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-4 text-xs text-muted-foreground font-mono">
                OR
              </span>
            </div>

            <Button
              variant="outline"
              className="w-full border-primary/20 hover:border-primary/50 hover:bg-primary/5 font-mono"
              onClick={() => toast({ title: "OAuth", description: "OAuth integration coming soon" })}
            >
              <Github className="w-4 h-4 mr-2" />
              CONTINUE WITH GITHUB
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-8 font-mono">
              NEW OPERATOR?{" "}
              <Link to="/signup" className="text-primary hover:text-glow-cyan font-semibold">
                CREATE_ACCOUNT
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
