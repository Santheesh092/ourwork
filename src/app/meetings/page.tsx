
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar as CalendarIcon, Clock, Video, Plus, MoreHorizontal, Users, RefreshCw } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar"
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelectParticipants } from './multi-select-participants';
import { useSpaces } from '@/lib/spaces-data';
import { cn } from '@/lib/utils';
import { useSquads } from '@/lib/squads-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const initialMeetings = [
  {
    id: 1,
    title: 'Project Phoenix - Standup',
    time: '10:00 AM - 10:15 AM',
    date: new Date(),
    participants: [
      { name: 'Alex', avatar: 'https://picsum.photos/seed/alex/32/32' },
      { name: 'Sam', avatar: 'https://picsum.photos/seed/sam/32/32' },
      { name: 'Jordan', avatar: 'https://picsum.photos/seed/jordan/32/32' },
    ],
    isNow: true,
    recurrence: 'Daily',
    link: '/meetings/join/1'
  },
  {
    id: 2,
    title: 'Q3 Design Review',
    time: '1:00 PM - 2:30 PM',
    date: new Date(),
    participants: [
      { name: 'Olivia', avatar: 'https://picsum.photos/seed/olivia/32/32' },
      { name: 'Noah', avatar: 'https://picsum.photos/seed/noah/32/32' },
      { name: 'Emma', avatar: 'https://picsum.photos/seed/emma/32/32' },
       { name: 'Liam', avatar: 'https://picsum.photos/seed/liam/32/32' },
    ],
    isNow: false,
    recurrence: 'Does not repeat',
    link: '/meetings/join/2'
  },
    {
    id: 3,
    title: 'Marketing Strategy Session',
    time: '4:00 PM - 5:00 PM',
    date: new Date(),
    participants: [
        { name: 'Sophia', avatar: 'https://picsum.photos/seed/sophia/32/32' },
        { name: 'Mason', avatar: 'https://picsum.photos/seed/mason/32/32' },
    ],
    isNow: false,
    recurrence: 'Weekly',
    link: '/meetings/join/3'
  },
];

export default function MeetingsPage() {
    const { spaces } = useSpaces();
    const { squads } = useSquads();
    const allSpaceMembers = spaces.flatMap(p => p.members);
    const allSquadMembers = squads.flatMap(s => s.members);
    const allTeamMembers = Array.from(new Map([...allSpaceMembers, ...allSquadMembers].map(m => [m.name, m])).values());

    const [date, setDate] = useState<Date | undefined>(new Date());
    const [meetings, setMeetings] = useState(initialMeetings);
    const [selectedMeeting, setSelectedMeeting] = useState(meetings[0]);
    const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
    const [selectedParticipants, setSelectedParticipants] = useState<typeof allTeamMembers>([]);
    
    const handleCreateMeeting = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const title = formData.get('meeting-title') as string;
        const time = formData.get('meeting-time') as string;
        const recurrence = formData.get('meeting-recurrence') as string;
        const meetingDate = date || new Date();

        if (title && time && selectedParticipants.length > 0) {
            const newMeetingId = Date.now();
            const newMeeting = {
                id: newMeetingId,
                title,
                time,
                date: meetingDate,
                participants: selectedParticipants,
                isNow: false,
                recurrence: recurrence || 'Does not repeat',
                link: `/meetings/join/${newMeetingId}`,
            };

            const newMeetingsList = [newMeeting, ...meetings].sort((a,b) => a.date.getTime() - b.date.getTime());
            setMeetings(newMeetingsList);
            setSelectedMeeting(newMeeting);
            setIsNewMeetingOpen(false);
            setSelectedParticipants([]);
        }
    };

  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-8 h-full min-h-[calc(100vh-12rem)]">
      <div className="lg:col-span-1 flex flex-col gap-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Schedule</CardTitle>
                <Dialog open={isNewMeetingOpen} onOpenChange={setIsNewMeetingOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-2" /> New Meeting</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Create a new meeting</DialogTitle>
                            <DialogDescription>Fill in the details to schedule a new meeting.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateMeeting}>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="meeting-title">Title</Label>
                                    <Input id="meeting-title" name="meeting-title" placeholder="e.g. Q4 Planning Session" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="meeting-date">Date</Label>
                                        <Input id="meeting-date" name="meeting-date" value={date ? format(date, 'PPP') : ''} readOnly />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="meeting-time">Time</Label>
                                        <Input id="meeting-time" name="meeting-time" type="time" defaultValue="10:00" />
                                    </div>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="meeting-recurrence">Recurring</Label>
                                    <Select name="meeting-recurrence" defaultValue="Does not repeat">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select recurrence" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Does not repeat">Does not repeat</SelectItem>
                                            <SelectItem value="Daily">Daily</SelectItem>
                                            <SelectItem value="Weekly">Weekly</SelectItem>
                                            <SelectItem value="Monthly">Monthly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Participants</Label>
                                    <MultiSelectParticipants 
                                        participants={allTeamMembers}
                                        selected={selectedParticipants}
                                        onChange={setSelectedParticipants}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Schedule Meeting</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md"
                />
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Upcoming on {date ? format(date, 'MMM d') : ''}</CardTitle>
                <CardDescription>Your scheduled meetings for today.</CardDescription>
            </CardHeader>
             <CardContent className="space-y-4">
                {meetings.filter(m => format(m.date, 'yyyy-MM-dd') === format(date || new Date(), 'yyyy-MM-dd')).slice(0,3).map((meeting) => (
                <div 
                    key={meeting.id} 
                    className={cn(
                        "flex items-start gap-4 p-3 rounded-lg cursor-pointer hover:bg-muted",
                        selectedMeeting?.id === meeting.id && "bg-muted"
                    )}
                    onClick={() => setSelectedMeeting(meeting)}
                >
                    <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        selectedMeeting?.id === meeting.id ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"
                    )}>
                        <CalendarIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">{meeting.title}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1.5" />
                            {meeting.time}
                        </div>
                    </div>
                     {meeting.isNow && <Badge>Now</Badge>}
                </div>
                ))}
                {meetings.filter(m => format(m.date, 'yyyy-MM-dd') === format(date || new Date(), 'yyyy-MM-dd')).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No meetings scheduled for this day.</p>
                )}
            </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2">
        <Card className="h-full">
            {selectedMeeting ? (
                <div className="flex flex-col h-full">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <Badge variant="secondary" className="mb-2">
                                    {format(selectedMeeting.date, 'PPPP')}
                                </Badge>
                                <CardTitle className="font-headline text-2xl">{selectedMeeting.title}</CardTitle>
                                <div className="flex items-center text-muted-foreground mt-2 space-x-4">
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2" />
                                        <span>{selectedMeeting.time}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        <span>{selectedMeeting.recurrence}</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-5 w-5"/></Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <div className="flex items-center justify-between">
                            <Button size="lg" className="w-full sm:w-auto" asChild>
                                <Link href={selectedMeeting.link}>
                                    <Video className="h-5 w-5 mr-2" /> Join Now
                                </Link>
                            </Button>
                            <div className="flex items-center text-muted-foreground">
                               <Users className="h-5 w-5 mr-2"/>
                               <span>{selectedMeeting.participants.length} Participants</span>
                            </div>
                        </div>

                         <div className="mt-8">
                            <h3 className="font-semibold mb-4">Attendees</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {selectedMeeting.participants.map(p => (
                                    <div key={p.name} className="flex flex-col items-center text-center gap-2">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage data-ai-hint="person portrait" src={p.avatar}/>
                                            <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium">{p.name}</span>
                                    </div>
                                ))}
                            </div>
                         </div>
                    </CardContent>
                </div>
            ) : (
                <div className="flex flex-col h-full items-center justify-center text-center p-8">
                     <CalendarIcon className="h-16 w-16 text-muted-foreground" />
                    <h2 className="mt-4 text-xl font-semibold">No Meeting Selected</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Select a meeting from the list or schedule a new one.</p>
                </div>
            )}
        </Card>
      </div>
    </div>
  );
}
