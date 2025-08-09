import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/universe/FileUpload";
import { RAGService, Universe } from "@/lib/ragverse";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { ArrowLeft, MessageSquare, Settings, Upload, Users, BarChart3 } from "lucide-react";

const UniverseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [universe, setUniverse] = useState<Universe | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const ragService = RAGService.getInstance();

  useEffect(() => {
    const loadUniverse = async () => {
      if (!id || !user) return;
      
      try {
        // TODO: Implement getUniverse method
        // const data = await ragService.getUniverse(id);
        // setUniverse(data);
        
        // Mock data for now
        setUniverse({
          id,
          name: "Sample Universe",
          description: "A sample universe for testing",
          owner_id: user.id,
          is_public: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      } catch (error) {
        toast.error("Failed to load universe");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadUniverse();
  }, [id, user]);

  if (loading) {
    return (
      <main className="container mx-auto py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-2/3 mb-8"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </main>
    );
  }

  if (!universe) {
    return (
      <main className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Universe not found</h1>
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-10">
      <Seo 
        title={`${universe.name} — RAGverse`}
        description={universe.description}
      />
      
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-2">{universe.name}</h1>
            <p className="text-muted-foreground mb-4">{universe.description}</p>
            <div className="flex items-center gap-2">
              <Badge variant={universe.is_public ? "default" : "secondary"}>
                {universe.is_public ? "Public" : "Private"}
              </Badge>
              <Badge variant="outline">12 documents</Badge>
              <Badge variant="outline">3 collaborators</Badge>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link to={`/universe/${id}/chat`}>
              <Button variant="hero">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </Link>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="documents">
            <Upload className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="collaborators">
            <Users className="h-4 w-4 mr-2" />
            Collaborators
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>
                Add documents to your universe. Supported formats: PDF, TXT, MD, CSV, DOCX
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload universeId={id!} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Documents</CardTitle>
              <CardDescription>
                Manage your uploaded documents and their processing status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No documents uploaded yet. Upload your first document above.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collaborators">
          <Card>
            <CardHeader>
              <CardTitle>Collaborators</CardTitle>
              <CardDescription>
                Invite others to collaborate on this universe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Collaboration features coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                View usage statistics and query insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Analytics dashboard coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default UniverseDetail;