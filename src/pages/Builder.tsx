import Seo from "@/components/Seo";
import { useCallback } from "react";
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

const initialNodes: Node[] = [
  { id: 'ingest', position: { x: 0, y: 80 }, data: { label: 'Ingest' }, type: 'input' },
  { id: 'embed', position: { x: 200, y: 80 }, data: { label: 'Embed' } },
  { id: 'index', position: { x: 400, y: 80 }, data: { label: 'Index' }, type: 'output' },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'ingest', target: 'embed', animated: true },
  { id: 'e2-3', source: 'embed', target: 'index' },
];

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
