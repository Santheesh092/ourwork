"use client";

import { useState, useMemo, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Send, Smile, AtSign, Search, Users, Hash, Plus, MoreVertical, Trash2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatData, currentUser, useUsers, User } from "@/lib/chat-data";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

type Message = {
    id: string;
    userId: string;
    text: string;
    timestamp: string;
};

type Channel = {
    id: string;
    teamId: string;
    type: 'channel';
    name: string;
    messages: Message[];
};

type DM = {
    id: string;
    type: 'dm';
    members: (User | undefined)[];
    messages: Message[];
};

type Conversation = Channel | DM;

// Fixed: Define proper Team type
interface Team {
  id: string;
  name: string;
  type: string;
  description: string;
  owner: string;
  members: User[];
  visibility: 'public' | 'private';
  icon: string;
  channels: Channel[];
}

const TeamsSidebar = ({ teams, selectedTeam, onSelectTeam, onCreateTeam, allTeamMembers }: { 
  teams: Team[], 
  selectedTeam: Team | null, 
  onSelectTeam: (team: Team) => void, 
  onCreateTeam: (team: Omit<Team, 'id' | 'channels'>) => void, 
  allTeamMembers: User[] 
}) => {
    const [isCreateTeamOpen, setCreateTeamOpen] = useState(false);

    const handleCreateTeam = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('team-name') as string;
        const description = formData.get('team-description') as string;
        if (name && currentUser) {
            onCreateTeam({
                name,
                description,
                icon: `https://picsum.photos/seed/${name}/40/40`,
                owner: currentUser.id,
                members: [currentUser],
                type: 'project',
                visibility: 'private',
            });
            setCreateTeamOpen(false);
        }
    }

    return (
        <div className="hidden md:flex flex-col items-center w-20 border-r bg-muted/20 py-4 space-y-2">
            {teams.map(team => (
                <button 
                    key={team.id}
                    onClick={() => onSelectTeam(team)}
                    className={cn(
                        "h-12 w-12 flex items-center justify-center rounded-xl transition-all duration-200",
                        selectedTeam?.id === team.id ? "bg-primary text-primary-foreground rounded-lg" : "hover:bg-muted"
                    )}
                >
                    <Avatar className="h-10 w-10">
                        <AvatarImage data-ai-hint="logo" src={team.icon} alt={team.name} />
                        <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </button>
            ))}
             <Dialog open={isCreateTeamOpen} onOpenChange={setCreateTeamOpen}>
                <DialogTrigger asChild>
                    <button className="h-12 w-12 flex items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/50 text-muted-foreground hover:bg-muted hover:border-muted-foreground/80 transition-colors">
                        <Plus className="h-6 w-6" />
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a new team</DialogTitle>
                        <DialogDescription>Fill in the details to create a new team for collaboration.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateTeam}>
                        <div className="py-4 space-y-4">
                            <div>
                                <Label htmlFor="team-name">Team Name</Label>
                                <Input id="team-name" name="team-name" placeholder="e.g. Project Phoenix" />
                            </div>
                            <div>
                                <Label htmlFor="team-description">Description</Label>
                                <Textarea id="team-description" name="team-description" placeholder="What is this team about?" />
                            </div>
                             <div>
                                <Label>Members</Label>
                                <p className="text-sm text-muted-foreground">Select members to invite to the team.</p>
                                <ScrollArea className="h-40 rounded-md border mt-2">
                                    <div className="p-4 space-y-2">
                                    {allTeamMembers.map(member => (
                                        <div key={member.id} className="flex items-center gap-3">
                                            <Checkbox id={`member-${member.id}`} name={`member-${member.id}`} />
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage data-ai-hint="person portrait" src={member.avatar} />
                                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <Label htmlFor={`member-${member.id}`} className="font-normal">{member.name}</Label>
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Create Team</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

const ConversationSidebar = ({
  team,
  dms,
  selectedConversation,
  onSelectConversation,
  onCreateChannel,
  onDeleteTeam,
  onlineUsersCount
}: {
  team: Team,
  dms: DM[],
  selectedConversation: Conversation | null,
  onSelectConversation: (conversation: Conversation) => void,
  onCreateChannel: (channelName: string, teamId: string) => void,
  onDeleteTeam: (teamId: string) => void
  onlineUsersCount: number,
}) => {
  const [isCreateChannelOpen, setCreateChannelOpen] = useState(false);

  const handleCreateChannel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const channelName = formData.get('channel-name') as string;
    if (channelName) {
        onCreateChannel(channelName, team.id);
        setCreateChannelOpen(false);
    }
  }

  return (
    <div className="hidden md:flex flex-col w-72 border-r bg-background">
      <div className="p-4 border-b flex justify-between items-start">
        <div>
            <h2 className="font-headline text-xl font-semibold">{team.name}</h2>
            <p className="text-sm text-muted-foreground">{team.description}</p>
        </div>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5"/></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <Trash2 className="h-4 w-4 mr-2"/> Delete Team
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the {team.name} team and all of its channels. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDeleteTeam(team.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
            <h3 className="font-headline text-lg font-semibold">Channels</h3>
            <Dialog open={isCreateChannelOpen} onOpenChange={setCreateChannelOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon"><Plus className="h-4 w-4"/></Button>
                </DialogTrigger>
                <DialogContent>
                     <DialogHeader>
                        <DialogTitle>Create a new channel in {team.name}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateChannel}>
                        <div className="py-4 space-y-4">
                            <div>
                                <Label htmlFor="channel-name">Channel Name</Label>
                                <Input id="channel-name" name="channel-name" placeholder="e.g. design-reviews" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Create Channel</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
        <div className="space-y-1">
          {team.channels.map(channel => (
            <Button
              key={channel.id}
              variant={selectedConversation?.id === channel.id ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => onSelectConversation(channel)}
            >
              <Hash className="h-4 w-4" /> {channel.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="p-4 flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-headline text-lg font-semibold">Direct Messages</h3>
          <span className="text-sm text-muted-foreground">{onlineUsersCount} online</span>
        </div>
        <ScrollArea className="h-[calc(100%-40px)]">
          <div className="space-y-1">
            {dms.map(dm => {
              const otherUser = dm.members.find(m => m && m.id !== currentUser?.id);
              if (!otherUser) return null;
              
              return (
                <div
                  key={dm.id}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer",
                    selectedConversation?.id === dm.id && "bg-muted"
                  )}
                  onClick={() => onSelectConversation(dm)}
                >
                  <Avatar className="relative">
                    <AvatarImage data-ai-hint="person portrait" src={otherUser.avatar} alt={otherUser.name} />
                    <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                    {otherUser.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />}
                  </Avatar>
                  <span className="font-medium text-sm">{otherUser.name}</span>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
       <div className="p-4 border-t flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                    <AvatarImage data-ai-hint="person portrait" src={currentUser?.avatar} />
                    <AvatarFallback>{currentUser?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm">{currentUser?.name}</span>
            </div>
            <Button variant="ghost" size="icon"><LogOut className="h-4 w-4 text-muted-foreground" /></Button>
       </div>
    </div>
  );
};


const ChatArea = ({ conversation, onSendMessage, onDeleteChannel, team, users }: { 
  conversation: Conversation, 
  onSendMessage: (text: string, conversationId: string) => void, 
  onDeleteChannel: (channelId: string, teamId: string) => void, 
  team: Team | null, 
  users: User[] 
}) => {
    const [newMessage, setNewMessage] = useState('');
    
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(newMessage, conversation.id);
            setNewMessage('');
        }
    };

    const getChatTitle = () => {
        if (conversation.type === 'channel') {
            return (
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-xl"># {conversation.name}</span>
                </div>
            )
        }
        const otherUser = conversation.members.find(m => m && m.id !== currentUser?.id);
        return otherUser?.name || 'Chat';
    };
    
    const membersCount = useMemo(() => {
        if (conversation.type === 'channel' && team) {
            return team.members.length;
        }
        // Fixed: Only access members if it's a DM
        if (conversation.type === 'dm') {
            return conversation.members.length;
        }
        return 0;
    }, [conversation, team]);

    return (
        <div className="flex flex-1 flex-col bg-background">
            <div className="flex items-center p-4 border-b">
                <div className="flex-1">
                    <h2 className="font-headline text-xl font-semibold">{getChatTitle()}</h2>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1.5"/>
                        {membersCount} members
                    </div>
                </div>
                 {conversation.type === 'channel' && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5"/></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                        <Trash2 className="h-4 w-4 mr-2"/> Delete Channel
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently delete the #{conversation.name} channel. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => conversation.type === 'channel' && onDeleteChannel(conversation.id, conversation.teamId)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
                {conversation.messages.length > 0 ? conversation.messages.map(message => {
                const user = users.find(u => u.id === message.userId);
                if (!user) return null;
                return (
                    <div key={message.id} className="flex items-start gap-4">
                    <Avatar>
                        <AvatarImage data-ai-hint="person portrait" src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                        </div>
                        <Card className="inline-block mt-1 bg-muted/50 shadow-none">
                        <CardContent className="p-3">
                            <p className="text-sm" dangerouslySetInnerHTML={{
                                __html: message.text.replace(/@(\w+)/g, '<span class="font-semibold text-primary">@$1</span>')
                            }} />
                        </CardContent>
                        </Card>
                    </div>
                    </div>
                )
                }) : (
                     <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <p>No messages yet.</p>
                        <p className="text-sm">Start the conversation!</p>
                    </div>
                )}
            </div>
            </ScrollArea>

            <div className="p-4 border-t bg-background">
                <form onSubmit={handleSendMessage} className="relative">
                    <Input
                        placeholder="Type a message..."
                        className="pr-36"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        <Button variant="ghost" size="icon" type="button"><Smile className="h-5 w-5 text-muted-foreground" /></Button>
                        <Button variant="ghost" size="icon" type="button"><AtSign className="h-5 w-5 text-muted-foreground" /></Button>
                        <Button variant="ghost" size="icon" type="button"><Paperclip className="h-5 w-5 text-muted-foreground" /></Button>
                        <Button variant="ghost" size="icon" type="submit" className="text-primary hover:text-primary"><Send className="h-5 w-5" /></Button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default function ChatPage() {
    const { users } = useUsers();
    const { initialTeams, initialDms, allTeamMembers } = useChatData();
    
    // Fixed: Cast the data to the proper types
    const [teams, setTeams] = useState<Team[]>(initialTeams as Team[]);
    const [dms, setDms] = useState<DM[]>(initialDms as DM[]);
    
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(teams.length > 0 ? teams[0] : null);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
        teams.length > 0 && teams[0].channels.length > 0 ? teams[0].channels[0] : (dms.length > 0 ? dms[0] : null)
    );

    const onlineUsersCount = useMemo(() => users.filter(u => u.online).length, [users]);

    const handleSelectTeam = (team: Team) => {
        setSelectedTeam(team);
        // Select the first channel of the new team, or the first DM if no channels exist
        setSelectedConversation(team.channels[0] || dms[0] || null);
    };
    
    const handleSelectConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation);
    };

    const handleCreateTeam = (teamData: Omit<Team, 'id'|'channels'>) => {
        const newTeam: Team = {
            id: `t-${Date.now()}`,
            ...teamData,
            channels: []
        };
        const newTeams = [...teams, newTeam];
        setTeams(newTeams);
        setSelectedTeam(newTeam);
        setSelectedConversation(dms[0] || null); // Default to first DM
    };

    const handleCreateChannel = (channelName: string, teamId: string) => {
        const newChannel: Channel = {
            id: `c-${Date.now()}`,
            teamId,
            type: 'channel' as const, // Fixed: Ensure type is literal
            name: channelName,
            messages: []
        };
        const updatedTeams = teams.map(team => {
            if (team.id === teamId) {
                return { ...team, channels: [...team.channels, newChannel]};
            }
            return team;
        });
        setTeams(updatedTeams);
        // Update selected team as well
        const updatedSelectedTeam = updatedTeams.find(t => t.id === teamId);
        if (updatedSelectedTeam) {
            setSelectedTeam(updatedSelectedTeam);
        }
        setSelectedConversation(newChannel);
    }
    
    const handleDeleteChannel = (channelId: string, teamId: string) => {
        let teamToUpdate: Team | undefined;
        const updatedTeams = teams.map(team => {
            if (team.id === teamId) {
                const updatedChannels = team.channels.filter(c => c.id !== channelId);
                teamToUpdate = {...team, channels: updatedChannels};
                return teamToUpdate;
            }
            return team;
        });
        setTeams(updatedTeams);
        
        if (teamToUpdate) {
            setSelectedTeam(teamToUpdate);
            setSelectedConversation(teamToUpdate.channels[0] || dms[0] || null);
        }
    }
    
    const handleDeleteTeam = (teamId: string) => {
        const updatedTeams = teams.filter(t => t.id !== teamId);
        setTeams(updatedTeams);
        if (selectedTeam?.id === teamId) {
            const newSelectedTeam = updatedTeams.length > 0 ? updatedTeams[0] : null;
            setSelectedTeam(newSelectedTeam);
            if (newSelectedTeam) {
                setSelectedConversation(newSelectedTeam.channels[0] || dms[0] || null);
            } else {
                setSelectedConversation(null);
            }
        }
    }

    const handleSendMessage = (text: string, conversationId: string) => {
        if (!currentUser) return;
        
        const newMessage: Message = {
            id: `m-${Date.now()}`,
            userId: currentUser.id,
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        // Check if it's a channel
        for (const team of teams) {
            const channel = team.channels.find(c => c.id === conversationId);
            if (channel) {
                channel.messages.push(newMessage);
                setTeams([...teams]);
                setSelectedConversation({...channel});
                return;
            }
        }
        
        // Check if it's a DM
        const dm = dms.find(d => d.id === conversationId);
        if (dm) {
            dm.messages.push(newMessage);
            setDms([...dms]);
            setSelectedConversation({...dm});
        }
    };

  return (
    <div className="flex h-[calc(100vh-8rem)] animate-fade-in">
        <TeamsSidebar 
            teams={teams}
            selectedTeam={selectedTeam}
            onSelectTeam={handleSelectTeam}
            onCreateTeam={handleCreateTeam}
            allTeamMembers={allTeamMembers}
        />
        {selectedTeam && selectedConversation ? (
            <>
                <ConversationSidebar 
                    team={selectedTeam}
                    dms={dms}
                    selectedConversation={selectedConversation}
                    onSelectConversation={handleSelectConversation}
                    onCreateChannel={handleCreateChannel}
                    onDeleteTeam={handleDeleteTeam}
                    onlineUsersCount={onlineUsersCount}
                />
                <ChatArea 
                    conversation={selectedConversation}
                    onSendMessage={handleSendMessage}
                    onDeleteChannel={handleDeleteChannel}
                    team={selectedConversation.type === 'channel' ? teams.find(t => t.id === selectedConversation.teamId) || null : null}
                    users={users}
                />
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <p className="text-lg font-semibold">No teams available.</p>
                <p className="text-muted-foreground">Create a new team to start collaborating.</p>
            </div>
        )}
    </div>
  );
}