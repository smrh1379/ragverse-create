import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-lg text-muted-foreground mb-6">Oops! Page not found</p>
        <a href="/" className="inline-block">
          {/* Using button styles via semantic tokens */}
          <span className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-primary-foreground hover:bg-primary/90">Return to Home</span>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
