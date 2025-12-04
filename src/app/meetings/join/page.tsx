
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Mic, MicOff, Video, VideoOff, Settings2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function JoinMeetingPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setHasCameraPermission(false);
          return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Device Access Denied',
          description: 'Please enable camera and microphone permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  const toggleCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const videoTrack = stream.getVideoTracks()[0];
        videoTrack.enabled = !isCameraOn;
        setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMic = () => {
     if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const audioTrack = stream.getAudioTracks()[0];
        audioTrack.enabled = !isMicOn;
        setIsMicOn(!isMicOn);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-muted/20 animate-fade-in">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Join Meeting</CardTitle>
          <CardDescription>Configure your audio and video before entering.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            {!isCameraOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <VideoOff className="h-12 w-12 text-muted-foreground" />
                </div>
            )}
            {hasCameraPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4 text-center">
                     <VideoOff className="h-12 w-12 text-muted-foreground" />
                     <p className="mt-2 text-sm text-muted-foreground">Camera is off or unavailable.</p>
                </div>
            )}
            <div className="absolute bottom-2 left-2 flex gap-2">
                <Button variant={isMicOn ? "secondary" : "destructive"} size="icon" onClick={toggleMic}>
                    {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
                <Button variant={isCameraOn ? "secondary" : "destructive"} size="icon" onClick={toggleCamera}>
                    {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
            </div>
          </div>
          <div className="space-y-6 flex flex-col justify-center">
            {hasCameraPermission === false && (
                <Alert variant="destructive">
                    <VideoOff className="h-4 w-4" />
                    <AlertTitle>Device Permissions</AlertTitle>
                    <AlertDescription>
                        Camera and microphone access is required. Please check your browser settings.
                    </AlertDescription>
                </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <div className="relative">
                <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder="Enter your display name" defaultValue="John Doe" className="pl-8"/>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="camera-switch" className="text-base">
                        Camera On
                    </Label>
                </div>
                <Switch id="camera-switch" checked={isCameraOn} onCheckedChange={toggleCamera} disabled={!hasCameraPermission}/>
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="mic-switch" className="text-base">
                        Microphone On
                    </Label>
                </div>
                <Switch id="mic-switch" checked={isMicOn} onCheckedChange={toggleMic} disabled={!hasCameraPermission} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
            <Button size="lg" disabled={!hasCameraPermission}>Join Now</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
