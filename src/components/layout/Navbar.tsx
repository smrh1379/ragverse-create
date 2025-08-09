import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/builder", label: "Builder" },
  { href: "/chat", label: "Chat" },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <nav className="container mx-auto flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-block h-6 w-6 rounded bg-[hsl(var(--brand))]" aria-hidden />
          <span>RAGverse</span>
        </Link>
        <div className="flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={`text-sm ${pathname.startsWith(l.href) ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Button variant="outline" size="sm" onClick={signOut}>Log out</Button>
          ) : (
            <>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">Log in</Link>
              <Link to="/dashboard"><Button variant="hero" size="sm">Get Started</Button></Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
