import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  plan: "starter" | "pro" | "enterprise";
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [plan, setPlan] = useState<"starter" | "pro" | "enterprise">("starter");

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setLoading(true);
          await checkUserExtras(session.user.id, session.user.email);
        } else {
          setIsAdmin(false);
          setPlan("starter");
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        setLoading(true);
        await checkUserExtras(session.user.id, session.user.email);
      } else {
        setIsAdmin(false);
        setPlan("starter");
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const checkUserExtras = async (userId: string, email?: string) => {
    // Hardcoded fallback for special emails
    const specialEmails = [
      'djoual.abdelhamid1@gmail.com',
      'abdorenouni@gmail.com',
      'mohammedbouzidi25@gmail.com'
    ];

    if (email && specialEmails.includes(email.toLowerCase())) {
      setIsAdmin(true);
      setPlan("enterprise");
      return;
    }

    const rolesPromise = supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    const planPromise = supabase
      .from("profiles")
      .select("subscription_plan")
      .eq("id", userId)
      .maybeSingle();

    const [rolesRes, planRes] = await Promise.all([rolesPromise, planPromise]);

    setIsAdmin(!!rolesRes.data);
    if (planRes.data?.subscription_plan) {
      setPlan(planRes.data.subscription_plan as any);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, plan, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
