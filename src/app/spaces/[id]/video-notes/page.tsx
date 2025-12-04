
'use client';

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useVideoNotes } from "@/lib/video-notes-data";
import { formatDistanceToNow } from "date-fns";
import { Voicemail, PlayCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SpaceVideoNotesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { videoNotes, isLoading } = useVideoNotes();
  
  const spaceVideoNotes = videoNotes.filter(note => note.spaceId === id);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Voicemail className="h-5 w-5" /> Video Notes</CardTitle>
        <CardDescription>Asynchronous video updates and walkthroughs for this space.</CardDescription>
      </CardHeader>
      <CardContent>
         {isLoading ? (
            <div className="grid gap-6">
                {[...Array(2)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-5 w-3/4"/>
                            <Skeleton className="h-4 w-1/2"/>
                        </CardHeader>
                         <CardContent>
                            <Skeleton className="h-10 w-full"/>
                        </CardContent>
                    </Card>
                ))}
            </div>
        ) : spaceVideoNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
              <p>No video notes have been linked to this Space yet.</p>
              <Button variant="link" asChild><Link href="/video-notes/new">Create one now</Link></Button>
          </div>
        ) : (
            <div className="space-y-6">
                {spaceVideoNotes.map(note => (
                     <Card key={note.id} className="cursor-pointer hover:bg-muted/50" onClick={() => router.push(`/video-notes/${note.id}`)}>
                        <CardHeader>
                            <CardTitle className="font-headline text-xl flex items-center gap-2">
                                <PlayCircle className="h-5 w-5 text-primary"/>
                                {note.title}
                            </CardTitle>
                            <CardDescription>
                                Recorded {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-2">{note.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
