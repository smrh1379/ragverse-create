import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isSignUp) {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });
        if (error) throw error;
        toast({ title: "Check your email", description: "We sent you a confirmation link to finish signing up." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Signed in", description: "Welcome back!" });
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      toast({ title: "Authentication error", description: err.message, variant: "destructive" as any });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto py-10">
      <Seo title="Login — RAGverse" description="Access your RAGverse account." />
      <section className="mx-auto max-w-md rounded-lg border bg-card p-6">
        <h1 className="mb-2 text-2xl font-semibold">{isSignUp ? "Create your account" : "Welcome back"}</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          {isSignUp ? "Sign up to start building your universes." : "Sign in to continue to your universes."}
        </p>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <Button variant="hero" size="lg" type="button" onClick={handleAuth} disabled={loading}>
            {loading ? (isSignUp ? "Creating..." : "Signing in...") : (isSignUp ? "Create account" : "Sign in")}
          </Button>
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-foreground text-left"
            onClick={() => setIsSignUp((v) => !v)}
          >
            {isSignUp ? "Have an account? Sign in" : "New here? Create an account"}
          </button>
        </div>
      </section>
    </main>
  );
};

export default Login;
