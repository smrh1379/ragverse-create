import Seo from "@/components/Seo";
import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import IngestNode from "@/components/builder/nodes/IngestNode";
import ChunkNode from "@/components/builder/nodes/ChunkNode";
import EmbedNode from "@/components/builder/nodes/EmbedNode";
import IndexNode from "@/components/builder/nodes/IndexNode";

const initialNodes: Node[] = [
  { id: 'ingest-1', position: { x: 0, y: 80 }, data: { source: 'file' }, type: 'ingest' as any },
  { id: 'chunk-1', position: { x: 220, y: 80 }, data: { chunkSize: 800, overlap: 100 }, type: 'chunk' as any },
  { id: 'embed-1', position: { x: 440, y: 80 }, data: { model: 'text-embedding-3-small' }, type: 'embed' as any },
  { id: 'index-1', position: { x: 660, y: 80 }, data: { provider: 'supabase', namespace: 'default', topK: 5 }, type: 'index' as any },
];

const initialEdges: Edge[] = [
  { id: 'e-ingest-chunk', source: 'ingest-1', target: 'chunk-1', animated: true },
  { id: 'e-chunk-embed', source: 'chunk-1', target: 'embed-1' },
  { id: 'e-embed-index', source: 'embed-1', target: 'index-1' },
];

const nodeTypes = {
  ingest: IngestNode,
  chunk: ChunkNode,
  embed: EmbedNode,
  index: IndexNode,
};


const Builder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), []);

  return (
    <main className="container mx-auto py-10">
      <Seo title="Builder — RAGverse" description="Visual no-code RAG pipeline builder." />
      <h1 className="mb-2 text-3xl font-semibold">Universe Builder</h1>
      <p className="mb-6 text-muted-foreground">Drag and connect steps to configure your RAG pipeline.</p>

      <div className="h-[60vh] rounded-lg border">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          style={{ backgroundColor: 'hsl(var(--background))' }}
          attributionPosition="top-right"
          nodeTypes={nodeTypes}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </main>
  );
};

export default Builder;
