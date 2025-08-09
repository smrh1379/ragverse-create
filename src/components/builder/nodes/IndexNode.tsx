import { memo } from "react";
import { Handle, Position, NodeProps, useReactFlow } from "@xyflow/react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export type IndexNodeData = {
  provider?: "supabase" | "pinecone";
  namespace?: string;
  topK?: number;
};

const IndexNode = ({ id, data }: NodeProps) => {
  const { setNodes } = useReactFlow();
  const d = data as IndexNodeData;

  const update = (patch: Partial<IndexNodeData>) =>
    setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)));

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-3 text-sm font-medium">Index</div>
      <div className="grid gap-3">
        <div className="grid gap-1">
          <Label className="text-xs">Provider</Label>
          <Select value={d?.provider || "supabase"} onValueChange={(v: any) => update({ provider: v })}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="supabase">Supabase (pgvector)</SelectItem>
              <SelectItem value="pinecone" disabled>Pinecone (coming)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1">
          <Label htmlFor={`ns-${id}`} className="text-xs">Namespace</Label>
          <Input id={`ns-${id}`} className="h-8" value={d?.namespace ?? "default"} onChange={(e) => update({ namespace: e.target.value })} />
        </div>
        <div className="grid gap-1">
          <Label htmlFor={`topk-${id}`} className="text-xs">Top K (default results)</Label>
          <Input id={`topk-${id}`} type="number" className="h-8" value={d?.topK ?? 5} onChange={(e) => update({ topK: Number(e.target.value) })} />
        </div>
      </div>
      <Handle type="target" position={Position.Left} />
    </div>
  );
};

export default memo(IndexNode);
