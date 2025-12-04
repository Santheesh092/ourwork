
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { useVideoNotes, type VideoNote } from "@/lib/video-notes-data";
import { useSpaces } from "@/lib/spaces-data";
import { ArrowLeft, Download, Tag, Edit, Share2, PlayCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function VideoNoteViewerPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { toast } = useToast();
    const { getVideoNoteById, isLoading: isNotesLoading } = useVideoNotes();
    const { getSpaceById, isLoading: isSpacesLoading } = useSpaces();
    const [note, setNote] = useState<VideoNote | null | undefined>(undefined);

    useEffect(() => {
        if (!isNotesLoading && id) {
            const foundNote = getVideoNoteById(id);
            setNote(foundNote);
        }
    }, [id, isNotesLoading, getVideoNoteById]);
    
    const isLoading = isNotesLoading || isSpacesLoading;
    const space = note?.spaceId ? getSpaceById(note.spaceId) : null;
    
    const handleDownload = () => {
        if (!note || !note.videoUrl) return;
        const a = document.createElement('a');
        a.href = note.videoUrl;
        a.download = `${note.title.replace(/\s+/g, '_')}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    };

     const handleShare = () => {
        if (!note) return;
        const url = `${window.location.origin}/video-notes/${note.id}`;
        navigator.clipboard.writeText(url);
        toast({
            title: "Link Copied!",
            description: "A shareable link to this video note has been copied to your clipboard.",
        });
    }

    if (isLoading || note === undefined) {
        return (
            <div className="flex flex-col gap-8 animate-fade-in">
                 <div>
                    <Skeleton className="h-10 w-3/4"/>
                    <Skeleton className="h-5 w-1/2 mt-2"/>
                </div>
                <Card>
                    <CardContent className="p-6">
                        <Skeleton className="h-[500px] w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (note === null) {
        return (
            <div className="text-center">
                <p>Video Note not found.</p>
                <Button onClick={() => router.push('/video-notes')} className="mt-4">Back to Video Notes</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                 <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="font-headline text-3xl font-bold tracking-tight">{note.title}</h1>
                        <p className="text-sm text-muted-foreground">
                            Recorded on {format(new Date(note.createdAt), "MMMM d, yyyy")}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => router.push(`/video-notes/edit/${note.id}`)}><Edit className="mr-2 h-4 w-4"/>Edit</Button>
                    <Button variant="outline" onClick={handleShare}><Share2 className="mr-2 h-4 w-4"/>Share</Button>
                    <Button onClick={handleDownload} disabled={!note.videoUrl}><Download className="mr-2 h-4 w-4"/>Download</Button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-2">
                     <Card>
                        <CardContent className="p-2">
                             {note.videoUrl ? (
                                <video src={note.videoUrl} controls className="w-full rounded-md aspect-video" />
                            ) : (
                                <div className="w-full aspect-video bg-muted rounded-md flex items-center justify-center">
                                    <p className="text-muted-foreground">No video available.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="sticky top-24">
                     <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div>
                                <h3 className="text-sm font-medium">Description</h3>
                                <p className="text-sm text-muted-foreground">{note.description || "No description provided."}</p>
                            </div>
                            {space && (
                                <div className="flex items-start gap-2">
                                    <Tag className="h-4 w-4 text-muted-foreground mt-1" />
                                    <div>
                                        <h3 className="text-sm font-medium">Linked Space</h3>
                                        <Link href={`/spaces/${space.id}`} className="text-sm text-primary hover:underline">{space.name}</Link>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
