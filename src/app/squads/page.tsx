
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSquads } from "@/lib/squads-data";
import { PlusCircle, ArrowUpRight, Users, Trash2, MoreHorizontal, Edit } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
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


export default function SquadsPage() {
  const router = useRouter();
  const { squads, addSquad, deleteSquad, allUsers, addUser, isLoading } = useSquads();
  const [isNewSquadDialogOpen, setIsNewSquadDialogOpen] = useState(false);
  
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');

  const [availableMembers, setAvailableMembers] = useState(allUsers);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleAddNewMember = () => {
    if (newMemberName.trim() && newMemberRole.trim()) {
        const newUser = addUser({ name: newMemberName, role: newMemberRole });
        setAvailableMembers(prev => [...prev, newUser]);
        setSelectedMembers(prev => [...prev, newUser.name]);
        setNewMemberName('');
        setNewMemberRole('');
    }
  };
  
  const handleCreateSquad = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const squadName = formData.get('squad-name') as string;
    const squadDescription = formData.get('squad-description') as string;
    
    const finalSelectedMembers = availableMembers
      .filter(member => selectedMembers.includes(member.name))
      .map(member => ({
          name: member.name,
          avatar: member.avatar,
          role: member.role || 'Member'
      }));

    if (squadName) {
      addSquad({
        name: squadName,
        description: squadDescription,
        members: finalSelectedMembers,
      });
      setIsNewSquadDialogOpen(false);
      setSelectedMembers([]);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Squads
          </h1>
          <p className="text-muted-foreground">
            Manage your teams and view their members.
          </p>
        </div>
        <Dialog open={isNewSquadDialogOpen} onOpenChange={setIsNewSquadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Squad
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create a new squad</DialogTitle>
              <DialogDescription>
                Fill in the details below to start a new squad.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSquad}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="squad-name">Name</Label>
                  <Input id="squad-name" name="squad-name" placeholder="e.g. Alpha Squad" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="squad-description">Description</Label>
                  <Textarea id="squad-description" name="squad-description" placeholder="Add a short squad description..."/>
                </div>

                <div className="space-y-4">
                    <Label>Invite New Member</Label>
                    <div className="flex gap-2">
                        <Input placeholder="Member Name" value={newMemberName} onChange={e => setNewMemberName(e.target.value)} />
                        <Input placeholder="Member Role" value={newMemberRole} onChange={e => setNewMemberRole(e.target.value)} />
                        <Button type="button" onClick={handleAddNewMember}>Add</Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Select Members</Label>
                    <ScrollArea className="h-40 rounded-md border">
                        <div className="p-4 space-y-2">
                        {availableMembers.map(member => (
                            <div key={member.id} className="flex items-center gap-3">
                                <Checkbox 
                                    id={`member-${member.id}`} 
                                    name={`member-${member.name}`}
                                    checked={selectedMembers.includes(member.name)}
                                    onCheckedChange={(checked) => {
                                        setSelectedMembers(prev => 
                                            checked ? [...prev, member.name] : prev.filter(name => name !== member.name)
                                        );
                                    }}
                                />
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
                <Button type="submit">Create Squad</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {squads.map((squad) => (
          <Card key={squad.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                    <CardTitle className="font-headline text-lg">{squad.name}</CardTitle>
                    <CardDescription className="text-xs">{squad.description}</CardDescription>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                         <DropdownMenuItem onClick={() => router.push(`/squads/edit/${squad.id}`)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
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
                                        This action cannot be undone. This will permanently delete this squad.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteSquad(squad.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-2">
              <div className="flex -space-x-2 overflow-hidden">
                  {squad.members.slice(0, 7).map(member => (
                      <Avatar key={member.name} className="h-8 w-8 border-2 border-card">
                          <AvatarImage data-ai-hint="person portrait" src={member.avatar} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                  ))}
                  {squad.members.length > 7 && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium">
                          +{squad.members.length - 7}
                      </div>
                  )}
                   {squad.members.length === 0 && (
                    <p className="text-xs text-muted-foreground">No members yet.</p>
                  )}
              </div>
            </CardContent>
            <CardFooter>
               <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/squads/${squad.id}`}>View Squad <ArrowUpRight className="ml-1 h-4 w-4" /></Link>
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
