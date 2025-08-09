import { memo } from "react";
import { Handle, Position, NodeProps, useReactFlow } from "@xyflow/react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export type IngestNodeData = {
  label?: string;
  source?: "file" | "url";
};

const IngestNode = ({ id, data }: NodeProps) => {
  const { setNodes } = useReactFlow();
  const d = data as IngestNodeData;

  const update = (patch: Partial<IngestNodeData>) =>
    setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)));

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-3 text-sm font-medium">Ingest</div>
      <div className="grid gap-2">
        <Label className="text-xs">Source</Label>
        <Select value={d?.source || "file"} onValueChange={(v) => update({ source: v as "file" | "url" })}>
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Select source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="file">File Upload</SelectItem>
            <SelectItem value="url">Public URL</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(IngestNode);
