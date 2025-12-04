
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PlusCircle, FileText, MoreHorizontal, Edit, Trash2, Download, Share2 } from "lucide-react";
import { useDocs } from "@/lib/docs-data";
import { useSpaces } from "@/lib/spaces-data";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function DocsPage() {
  const router = useRouter();
  const { docs, isLoading: isDocsLoading, deleteDoc } = useDocs();
  const { spaces, isLoading: isSpacesLoading } = useSpaces();
  const { toast } = useToast();

  const getSpaceName = (spaceId: string | null) => {
    if (!spaceId) return "General";
    return spaces.find((s) => s.id === spaceId)?.name || "Unknown Space";
  };
  
  const handleDownload = (doc: typeof docs[0]) => {
    const blob = new Blob([doc.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleShare = (doc: typeof docs[0]) => {
      const url = `${window.location.origin}/docs/${doc.id}`;
      navigator.clipboard.writeText(url);
      toast({
          title: "Link Copied!",
          description: "A shareable link to this document has been copied to your clipboard.",
      });
  }

  const isLoading = isDocsLoading || isSpacesLoading;

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Documents
          </h1>
          <p className="text-muted-foreground">
            Your team's central knowledge base.
          </p>
        </div>
        <Button asChild>
          <Link href="/docs/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Document
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-4 w-24" />
                </CardFooter>
            </Card>
          ))}
        </div>
      ) : docs.length === 0 ? (
        <Card className="col-span-full flex flex-col items-center justify-center p-12 text-center">
          <FileText className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="mt-4 text-xl font-semibold">No Documents Yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Click "New Document" to create your first one.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => (
            <Card key={doc.id} className="flex flex-col">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="font-headline text-xl">
                                <Link href={`/docs/${doc.id}`} className="hover:underline">{doc.title}</Link>
                            </CardTitle>
                             <CardDescription>
                                In <span className="font-medium text-foreground">{getSpaceName(doc.spaceId)}</span>
                            </CardDescription>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/docs/edit/${doc.id}`)}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleShare(doc)}>
                                    <Share2 className="mr-2 h-4 w-4" /> Share
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDownload(doc)}>
                                    <Download className="mr-2 h-4 w-4" /> Download
                                </DropdownMenuItem>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete this document.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => deleteDoc(doc.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-2">{doc.description || "No description."}</p>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                    <span>{formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true })}</span>
                </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
