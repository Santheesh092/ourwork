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

type Participant = {
  name: string;
  avatar: string;
  role: string;
};

type Meeting = {
  id: number;
  title: string;
  time: string;
  date: Date;
  participants: Participant[];
  isNow: boolean;
  recurrence: string;
  link: string;
};

const initialMeetings: Meeting[] = [
  {
    id: 1,
    title: 'Project Phoenix - Standup',
    time: '10:00 AM - 10:15 AM',
    date: new Date(),
    participants: [
      { name: 'Alex', avatar: 'https://picsum.photos/seed/alex/32/32', role: 'Developer' },
      { name: 'Sam', avatar: 'https://picsum.photos/seed/sam/32/32', role: 'Designer' },
      { name: 'Jordan', avatar: 'https://picsum.photos/seed/jordan/32/32', role: 'Product Manager' },
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
      { name: 'Olivia', avatar: 'https://picsum.photos/seed/olivia/32/32', role: 'Design Lead' },
      { name: 'Noah', avatar: 'https://picsum.photos/seed/noah/32/32', role: 'Developer' },
      { name: 'Emma', avatar: 'https://picsum.photos/seed/emma/32/32', role: 'QA Engineer' },
      { name: 'Liam', avatar: 'https://picsum.photos/seed/liam/32/32', role: 'Project Manager' },
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
      { name: 'Sophia', avatar: 'https://picsum.photos/seed/sophia/32/32', role: 'Marketing Lead' },
      { name: 'Mason', avatar: 'https://picsum.photos/seed/mason/32/32', role: 'Content Strategist' },
    ],
    isNow: false,
    recurrence: 'Weekly',
    link: '/meetings/join/3'
  },
];

export default function MeetingsPage() {
  const { spaces } = useSpaces();
  const { squads } = useSquads();
  
  // Ensure all members have a role property
  const allSpaceMembers: Participant[] = spaces.flatMap(space => 
    space.members.map(member => ({
      name: member.name,
      avatar: member.avatar || `https://picsum.photos/seed/${member.name}/32/32`,
      role: member.role || 'Member' // Default role if not provided
    }))
  );

  const allSquadMembers: Participant[] = squads.flatMap(squad =>
    squad.members.map(member => ({
      name: member.name,
      avatar: member.avatar || `https://picsum.photos/seed/${member.name}/32/32`,
      role: member.role || 'Member' // Default role if not provided
    }))
  );

  // Remove duplicates based on name
  const allTeamMembers = Array.from(
    new Map([...allSpaceMembers, ...allSquadMembers].map(m => [m.name, m])).values()
  );

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(initialMeetings[0]);
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);
  
  const handleCreateMeeting = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get('meeting-title') as string;
    const timeInput = formData.get('meeting-time') as string;
    const recurrence = formData.get('meeting-recurrence') as string;
    const meetingDate = date || new Date();
    
    // Convert 24-hour time to 12-hour format
    const timeParts = timeInput.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = timeParts[1];
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayTime = `${displayHours}:${minutes} ${period}`;
    const timeRange = `${displayTime} - ${displayHours + 1}:${minutes} ${period}`;

    if (title && timeInput && selectedParticipants.length > 0) {
      const newMeetingId = Date.now();
      const newMeeting: Meeting = {
        id: newMeetingId,
        title,
        time: timeRange,
        date: meetingDate,
        participants: selectedParticipants,
        isNow: false,
        recurrence: recurrence || 'Does not repeat',
        link: `/meetings/join/${newMeetingId}`,
      };

      const newMeetingsList = [newMeeting, ...meetings].sort((a, b) => a.date.getTime() - b.date.getTime());
      setMeetings(newMeetingsList);
      setSelectedMeeting(newMeeting);
      setIsNewMeetingOpen(false);
      setSelectedParticipants([]);
    }
  };

  // Filter meetings for the selected date
  const todaysMeetings = meetings.filter(m => 
    format(m.date, 'yyyy-MM-dd') === format(date || new Date(), 'yyyy-MM-dd')
  );

  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-8 h-full min-h-[calc(100vh-12rem)]">
      <div className="lg:col-span-1 flex flex-col gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Schedule</CardTitle>
            <Dialog open={isNewMeetingOpen} onOpenChange={setIsNewMeetingOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" /> New Meeting
                </Button>
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
                      <Input 
                        id="meeting-title" 
                        name="meeting-title" 
                        placeholder="e.g. Q4 Planning Session" 
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="meeting-date">Date</Label>
                        <Input 
                          id="meeting-date" 
                          name="meeting-date" 
                          value={date ? format(date, 'PPP') : ''} 
                          readOnly 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="meeting-time">Time</Label>
                        <Input 
                          id="meeting-time" 
                          name="meeting-time" 
                          type="time" 
                          defaultValue="10:00" 
                          required
                        />
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
                    <Button 
                      type="submit" 
                      disabled={selectedParticipants.length === 0}
                    >
                      Schedule Meeting
                    </Button>
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
            {todaysMeetings.slice(0, 3).map((meeting) => (
              <div 
                key={meeting.id} 
                className={cn(
                  "flex items-start gap-4 p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors",
                  selectedMeeting?.id === meeting.id && "bg-muted border-l-4 border-l-primary"
                )}
                onClick={() => setSelectedMeeting(meeting)}
              >
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  selectedMeeting?.id === meeting.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted-foreground/20 text-muted-foreground"
                )}>
                  <CalendarIcon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{meeting.title}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1.5" />
                    {meeting.time}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {meeting.participants.length} participants
                    </span>
                  </div>
                </div>
                {meeting.isNow && (
                  <Badge variant="destructive" className="animate-pulse">Now</Badge>
                )}
              </div>
            ))}
            {todaysMeetings.length === 0 && (
              <div className="text-center py-4">
                <CalendarIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No meetings scheduled for this day.</p>
              </div>
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
                    <div className="flex flex-wrap items-center text-muted-foreground mt-2 gap-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{selectedMeeting.time}</span>
                      </div>
                      <div className="flex items-center">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        <span>{selectedMeeting.recurrence}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{selectedMeeting.participants.length} Participants</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5"/>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                  <Button size="lg" className="w-full sm:w-auto" asChild>
                    <Link href={selectedMeeting.link}>
                      <Video className="h-5 w-5 mr-2" /> Join Now
                    </Link>
                  </Button>
                  {selectedMeeting.isNow && (
                    <Badge variant="destructive" className="animate-pulse">Meeting in Progress</Badge>
                  )}
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold mb-4">Attendees</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {selectedMeeting.participants.map((participant) => (
                      <div key={participant.name} className="flex flex-col items-center text-center gap-2">
                        <Avatar className="h-16 w-16 border-2 border-muted">
                          <AvatarImage 
                            data-ai-hint="person portrait" 
                            src={participant.avatar}
                            alt={participant.name}
                          />
                          <AvatarFallback>
                            {participant.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="text-sm font-medium">{participant.name}</span>
                          <p className="text-xs text-muted-foreground mt-1">{participant.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </div>
          ) : (
            <div className="flex flex-col h-full items-center justify-center text-center p-8">
              <CalendarIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="mt-4 text-xl font-semibold">No Meeting Selected</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                Select a meeting from the list on the left or schedule a new one to view details here.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}