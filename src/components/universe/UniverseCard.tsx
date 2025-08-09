import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Users, Lock, Globe, Calendar } from "lucide-react";
import { Universe } from "@/lib/ragverse";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

interface UniverseCardProps {
  universe: Universe;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
}

export const UniverseCard = ({ universe, onDelete, onShare }: UniverseCardProps) => {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg line-clamp-1">{universe.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {universe.is_public ? (
                <><Globe className="h-3 w-3" /> Public</>
              ) : (
                <><Lock className="h-3 w-3" /> Private</>
              )}
              <span>•</span>
              <Calendar className="h-3 w-3" />
              {formatDistanceToNow(new Date(universe.updated_at), { addSuffix: true })}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onShare?.(universe.id)}>
                Share
              </DropdownMenuItem>
              <DropdownMenuItem>
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => onDelete?.(universe.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <CardDescription className="line-clamp-2 mb-3">
          {universe.description || "No description provided"}
        </CardDescription>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <Users className="h-3 w-3 mr-1" />
            3 collaborators
          </Badge>
          <Badge variant="outline" className="text-xs">
            12 documents
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Link to={`/universe/${universe.id}`} className="flex-1">
            <Button variant="default" size="sm" className="w-full">
              Open
            </Button>
          </Link>
          <Link to={`/universe/${universe.id}/chat`}>
            <Button variant="outline" size="sm">
              Chat
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};