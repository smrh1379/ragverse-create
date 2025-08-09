import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <main className="container mx-auto py-10">
      <Seo
        title="Dashboard — RAGverse"
        description="Manage your universes and collaborate with your team."
      />
      <section className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Your Universes</h1>
        <Button variant="hero" size="sm">New Universe</Button>
      </section>
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1,2,3].map((i) => (
          <article key={i} className="rounded-lg border bg-card p-5 shadow-sm">
            <h2 className="mb-2 text-lg font-medium">Universe #{i}</h2>
            <p className="mb-4 text-sm text-muted-foreground">A collaborative RAG space. Upload files, embed, and query.</p>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary">Open</Button>
              <Button size="sm" variant="outline">Share</Button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Dashboard;
