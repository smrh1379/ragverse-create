import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import BackgroundGlow from "@/components/BackgroundGlow";
import heroAurora from "@/assets/hero-aurora.jpg";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <main>
      <Seo
        title="RAGverse — No‑Code RAG Builder"
        description="Build, collaborate, and share RAG-powered knowledge universes without code."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "RAGverse",
          description: "No-code platform for RAG-powered knowledge universes",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
        }}
      />
      <section className="relative overflow-hidden">
        <div className="container mx-auto grid min-h-[70vh] items-center gap-10 py-16 md:grid-cols-2">
          <div className="relative">
            <BackgroundGlow />
            <h1 className="mb-4 text-5xl font-semibold leading-tight">Create RAG universes without code</h1>
            <p className="mb-8 max-w-prose text-lg text-muted-foreground">
              Upload data, generate embeddings, and query with citations. Collaborate in real time and share your universes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/dashboard"><Button variant="hero" size="xl">Start building</Button></Link>
              <Link to="/builder"><Button variant="soft" size="xl">Try the builder</Button></Link>
            </div>
          </div>
          <div className="relative">
            <img
              src={heroAurora}
              alt="RAGverse no-code RAG builder hero illustration"
              loading="lazy"
              className="w-full rounded-lg border shadow"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
