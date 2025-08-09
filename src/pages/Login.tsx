import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";

const Login = () => {
  return (
    <main className="container mx-auto py-10">
      <Seo title="Login — RAGverse" description="Access your RAGverse account." />
      <section className="mx-auto max-w-md rounded-lg border bg-card p-6">
        <h1 className="mb-2 text-2xl font-semibold">Welcome back</h1>
        <p className="mb-6 text-sm text-muted-foreground">Sign in to continue to your universes.</p>
        <form className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm">Email</label>
            <input id="email" type="email" className="rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm">Password</label>
            <input id="password" type="password" className="rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <Button variant="hero" size="lg" type="button">Sign in</Button>
        </form>
        <p className="mt-4 text-xs text-muted-foreground">Authentication requires connecting Supabase in this project.</p>
      </section>
    </main>
  );
};

export default Login;
