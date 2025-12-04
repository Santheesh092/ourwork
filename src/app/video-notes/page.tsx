
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
import { PlusCircle, Voicemail, MoreHorizontal, Edit, Trash2, Download, Share2 } from "lucide-react";
import { useVideoNotes } from "@/lib/video-notes-data";
import { useSpaces } from "@/lib/spaces-data";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function VideoNotesPage() {
  const router = useRouter();
  const { videoNotes, isLoading: isNotesLoading, deleteVideoNote } = useVideoNotes();
  const { spaces, isLoading: isSpacesLoading } = useSpaces();
  const { toast } = useToast();

  const getSpaceName = (spaceId: string | null) => {
    if (!spaceId) return "General";
    return spaces.find((s) => s.id === spaceId)?.name || "Unknown Space";
  };
  
  const handleDownload = (note: typeof videoNotes[0]) => {
    if (!note.videoUrl) {
        toast({ title: "No video to download", variant: "destructive"});
        return;
    };
    const a = document.createElement('a');
    a.href = note.videoUrl;
    a.download = `${note.title.replace(/\s+/g, '_')}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const handleShare = (note: typeof videoNotes[0]) => {
      const url = `${window.location.origin}/video-notes/${note.id}`;
      navigator.clipboard.writeText(url);
      toast({
          title: "Link Copied!",
          description: "A shareable link to this video note has been copied to your clipboard.",
      });
  }

  const isLoading = isNotesLoading || isSpacesLoading;

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Video Notes
          </h1>
          <p className="text-muted-foreground">
            Your team's central hub for asynchronous updates.
          </p>
        </div>
        <Button asChild>
          <Link href="/video-notes/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Video Note
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
      ) : videoNotes.length === 0 ? (
        <Card className="col-span-full flex flex-col items-center justify-center p-12 text-center">
          <Voicemail className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="mt-4 text-xl font-semibold">No Video Notes Yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Click "New Video Note" to create your first one.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videoNotes.map((note) => (
            <Card key={note.id} className="flex flex-col">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="font-headline text-xl">
                                <Link href={`/video-notes/${note.id}`} className="hover:underline">{note.title}</Link>
                            </CardTitle>
                             <CardDescription>
                                In <span className="font-medium text-foreground">{getSpaceName(note.spaceId)}</span>
                            </CardDescription>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/video-notes/edit/${note.id}`)}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleShare(note)}>
                                    <Share2 className="mr-2 h-4 w-4" /> Share
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDownload(note)}>
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
                                                This will permanently delete this video note.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => deleteVideoNote(note.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-2">{note.description || "No description."}</p>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                    <span>{formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}</span>
                </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
