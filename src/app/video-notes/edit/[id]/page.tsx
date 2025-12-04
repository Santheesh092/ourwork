
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useVideoNotes, type VideoNote } from "@/lib/video-notes-data";
import { useSpaces } from "@/lib/spaces-data";
import { Loader2, Save, ArrowLeft, Video, Square, Circle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type RecordingState = "idle" | "recording" | "stopped";

export default function EditVideoNotePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { toast } = useToast();
    const { getVideoNoteById, updateVideoNote, isLoading: isNotesLoading } = useVideoNotes();
    const { spaces, isLoading: isSpacesLoading } = useSpaces();

    const [note, setNote] = useState<VideoNote | null | undefined>(undefined);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [spaceId, setSpaceId] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [recordingState, setRecordingState] = useState<RecordingState>("stopped");
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (id && !isNotesLoading) {
            const foundNote = getVideoNoteById(id);
            setNote(foundNote);
            if (foundNote) {
                setTitle(foundNote.title);
                setDescription(foundNote.description);
                setSpaceId(foundNote.spaceId);
                setVideoUrl(foundNote.videoUrl);
                setRecordingState(foundNote.videoUrl ? 'stopped' : 'idle');
            }
        }
    }, [id, getVideoNoteById, isNotesLoading]);

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
            
            mediaRecorderRef.current = new MediaRecorder(stream);
            recordedChunksRef.current = [];
            mediaRecorderRef.current.ondataavailable = e => e.data.size > 0 && recordedChunksRef.current.push(e.data);
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                setVideoUrl(url);
                setRecordingState("stopped");
            };
            mediaRecorderRef.current.start();
            setRecordingState("recording");
        } catch (error) {
            console.error("Recording error:", error);
            toast({ variant: "destructive", title: "Recording Error" });
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && recordingState === "recording") {
            mediaRecorderRef.current.stop();
            const stream = videoRef.current?.srcObject as MediaStream;
            stream?.getTracks().forEach(track => track.stop());
            if (videoRef.current) videoRef.current.srcObject = null;
        }
    };

    const handleSave = () => {
        if (!note || !title.trim()) {
            toast({ variant: "destructive", title: "Missing Title" });
            return;
        }

        setIsSaving(true);
        updateVideoNote(note.id, { title, description, spaceId, videoUrl });

        toast({ title: "Changes Saved!", description: "Your video note has been updated." });

        setTimeout(() => router.push('/video-notes'), 500);
    };

    const handleSpaceChange = (value: string) => {
        setSpaceId(value === "none" ? null : value);
    };
    
    const isLoading = isNotesLoading || isSpacesLoading;

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
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Edit Video Note</h1>
                    <p className="text-muted-foreground">Update the details for your video note.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Video Note Editor</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Short Description</Label>
                            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="space">Link to Space (Optional)</Label>
                            <Select onValueChange={handleSpaceChange} value={spaceId || "none"}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a space..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {spaces.map(s => (
                                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Recording</Label>
                        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                           <video ref={videoRef} className="w-full h-full" muted autoPlay playsInline controls={recordingState === 'stopped'} src={videoUrl ?? undefined}></video>
                           {recordingState === "recording" && (
                               <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/80 p-2 rounded-lg">
                                    <Circle className="h-3 w-3 fill-red-500 text-red-500 animate-pulse" />
                                    <span className="text-sm font-medium text-red-500">Recording...</span>
                               </div>
                           )}
                        </div>
                        <div className="flex justify-center gap-4 pt-2">
                            {(recordingState === "idle" || recordingState === "stopped") && <Button onClick={handleStartRecording} variant="outline"><Video className="mr-2 h-4 w-4"/>Record{recordingState === "stopped" && " Again"}</Button>}
                            {recordingState === "recording" && <Button variant="destructive" onClick={handleStopRecording}><Square className="mr-2 h-4 w-4"/>Stop</Button>}
                        </div>
                     </div>
                </CardContent>
                <CardFooter className="flex justify-end p-6 border-t">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
