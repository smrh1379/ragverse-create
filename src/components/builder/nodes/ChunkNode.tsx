import { memo } from "react";
import { Handle, Position, NodeProps, useReactFlow } from "@xyflow/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export type ChunkNodeData = {
  chunkSize?: number;
  overlap?: number;
};

const ChunkNode = ({ id, data }: NodeProps) => {
  const { setNodes } = useReactFlow();
  const d = data as ChunkNodeData;

  const update = (patch: Partial<ChunkNodeData>) =>
    setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)));

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-3 text-sm font-medium">Chunk</div>
      <div className="grid gap-3">
        <div className="grid gap-1">
          <Label htmlFor={`size-${id}`} className="text-xs">Chunk size</Label>
          <Input id={`size-${id}`} type="number" className="h-8" value={d?.chunkSize ?? 800} onChange={(e) => update({ chunkSize: Number(e.target.value) })} />
        </div>
        <div className="grid gap-1">
          <Label htmlFor={`overlap-${id}`} className="text-xs">Overlap</Label>
          <Input id={`overlap-${id}`} type="number" className="h-8" value={d?.overlap ?? 100} onChange={(e) => update({ overlap: Number(e.target.value) })} />
        </div>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(ChunkNode);
