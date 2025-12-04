
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useVideoNotes } from "@/lib/video-notes-data";
import { useSpaces } from "@/lib/spaces-data";
import { Loader2, Save, Video, Mic, ScreenShare, Square, Circle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type RecordingState = "idle" | "recording" | "stopped";

export default function NewVideoNotePage() {
    const router = useRouter();
    const { toast } = useToast();
    const { addVideoNote } = useVideoNotes();
    const { spaces } = useSpaces();
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [spaceId, setSpaceId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [recordingState, setRecordingState] = useState<RecordingState>("idle");
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { mediaSource: "screen" } as any,
                audio: true,
            });
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
            recordedChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                setVideoUrl(url);
                setRecordingState("stopped");
            };

            mediaRecorderRef.current.start();
            setRecordingState("recording");
        } catch (error) {
            console.error("Error starting recording:", error);
            toast({
                variant: "destructive",
                title: "Recording Error",
                description: "Could not start recording. Please check permissions and try again.",
            });
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && recordingState === "recording") {
            mediaRecorderRef.current.stop();
            // Get the tracks from the stream and stop them
            const stream = videoRef.current?.srcObject as MediaStream;
            stream?.getTracks().forEach(track => track.stop());
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            toast({
                variant: "destructive",
                title: "Missing Title",
                description: "Please provide a title for your video note.",
            });
            return;
        }
        if (!videoUrl) {
            toast({
                variant: "destructive",
                title: "No Video Recorded",
                description: "Please record a video before saving.",
            });
            return;
        }

        setIsSaving(true);
        addVideoNote({
            title,
            description,
            spaceId,
            videoUrl,
        });

        toast({
            title: "Video Note Saved!",
            description: "Your video note has been successfully saved.",
        });

        setTimeout(() => {
            router.push('/video-notes');
        }, 500);
    };
    
    const handleSpaceChange = (value: string) => {
        setSpaceId(value === "none" ? null : value);
    };

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">New Video Note</h1>
                <p className="text-muted-foreground">Record a short video to share an update, explain an issue, or give feedback.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Video Note Recorder</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" placeholder="e.g., Quick update on feature X" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="description">Short Description</Label>
                            <Input id="description" placeholder="A brief summary of the video's content" value={description} onChange={(e) => setDescription(e.target.value)} />
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
                           {recordingState === "idle" && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-background/50">
                                        <ScreenShare className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">Click below to start recording your screen.</p>
                                </div>
                           )}
                           {recordingState === "recording" && (
                               <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/80 p-2 rounded-lg">
                                    <Circle className="h-3 w-3 fill-red-500 text-red-500 animate-pulse" />
                                    <span className="text-sm font-medium text-red-500">Recording...</span>
                               </div>
                           )}
                        </div>
                        <div className="flex justify-center gap-4 pt-2">
                            {recordingState === "idle" && <Button onClick={handleStartRecording}><Video className="mr-2 h-4 w-4"/>Start Recording</Button>}
                            {recordingState === "recording" && <Button variant="destructive" onClick={handleStopRecording}><Square className="mr-2 h-4 w-4"/>Stop Recording</Button>}
                            {recordingState === "stopped" && <Button onClick={handleStartRecording} variant="outline">Record Again</Button>}
                        </div>
                     </div>
                </CardContent>
                <CardFooter className="flex justify-end p-6 border-t">
                    <Button onClick={handleSave} disabled={isSaving || recordingState !== 'stopped'}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                        Save Video Note
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
