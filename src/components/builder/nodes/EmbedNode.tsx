import { memo } from "react";
import { Handle, Position, NodeProps, useReactFlow } from "@xyflow/react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export type EmbedNodeData = {
  model?: string;
};

const EmbedNode = ({ id, data }: NodeProps) => {
  const { setNodes } = useReactFlow();
  const d = data as EmbedNodeData;

  const update = (patch: Partial<EmbedNodeData>) =>
    setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)));

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-3 text-sm font-medium">Embed</div>
      <div className="grid gap-2">
        <Label className="text-xs">Model</Label>
        <Select value={d?.model || "text-embedding-3-small"} onValueChange={(v) => update({ model: v })}>
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text-embedding-3-small">OpenAI: text-embedding-3-small</SelectItem>
            <SelectItem value="text-embedding-3-large">OpenAI: text-embedding-3-large</SelectItem>
            <SelectItem value="bge-small">BGE small</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(EmbedNode);
