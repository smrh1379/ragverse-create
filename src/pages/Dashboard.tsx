import Seo from "@/components/Seo";
import { useState, useEffect } from "react";
import { CreateUniverseDialog } from "@/components/universe/CreateUniverseDialog";
import { UniverseCard } from "@/components/universe/UniverseCard";
import { RAGService, Universe } from "@/lib/ragverse";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const ragService = RAGService.getInstance();

  const loadUniverses = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await ragService.getUserUniverses(user.id);
      setUniverses(data);
    } catch (error) {
      toast.error("Failed to load universes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUniverses();
  }, [user]);

  const handleDelete = async (id: string) => {
    // TODO: Implement delete functionality
    toast.success("Universe deleted");
  };

  const handleShare = async (id: string) => {
    // TODO: Implement share functionality
    toast.success("Share link copied to clipboard");
  };

  return (
    <main className="container mx-auto py-10">
      <Seo
        title="Dashboard — RAGverse"
        description="Manage your universes and collaborate with your team."
      />
      <section className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Your Universes</h1>
        <CreateUniverseDialog onUniverseCreated={loadUniverses} />
      </section>
      
      {loading ? (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border bg-card p-5">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
        </section>
      ) : universes.length === 0 ? (
        <section className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-medium mb-2">No universes yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first universe to start building your RAG-powered knowledge base.
            </p>
            <CreateUniverseDialog onUniverseCreated={loadUniverses} />
          </div>
        </section>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {universes.map((universe) => (
            <UniverseCard
              key={universe.id}
              universe={universe}
              onDelete={handleDelete}
              onShare={handleShare}
            />
          ))}
        </section>
      )}
      </section>
    </main>
  );
};

export default Dashboard;
