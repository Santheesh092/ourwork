
'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSquads } from "@/lib/squads-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


export default function EditSquadPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { toast } = useToast();
    const { getSquadById, updateSquad, allUsers, addUser } = useSquads();

    const [squad, setSquad] = useState(getSquadById(id));
    const [squadName, setSquadName] = useState('');
    const [squadDescription, setSquadDescription] = useState('');
    
    const [availableMembers, setAvailableMembers] = useState(allUsers);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberRole, setNewMemberRole] = useState('');

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const currentSquad = getSquadById(id);
        setSquad(currentSquad);
        if (currentSquad) {
            setSquadName(currentSquad.name);
            setSquadDescription(currentSquad.description);
            setSelectedMembers(currentSquad.members.map(m => m.name));
        }
    }, [id, getSquadById]);

    useEffect(() => {
        setAvailableMembers(allUsers);
    }, [allUsers]);

    const handleCreateNewMember = () => {
        if (newMemberName.trim() && newMemberRole.trim()) {
            const newUser = addUser({ name: newMemberName, role: newMemberRole });
            setAvailableMembers(prev => [...prev, newUser]);
            setSelectedMembers(prev => [...prev, newUser.name]);
            setNewMemberName('');
            setNewMemberRole('');
        }
    };
    
    const handleSave = () => {
        if (!squad || !squadName.trim()) {
            toast({
                variant: "destructive",
                title: "Missing Name",
                description: "Please provide a name for the squad.",
            });
            return;
        }

        setIsSaving(true);
        
        const finalSelectedMembers = availableMembers
            .filter(member => selectedMembers.includes(member.name))
            .map(member => {
                const existingMember = squad.members.find(m => m.name === member.name);
                return {
                    name: member.name,
                    avatar: member.avatar,
                    role: existingMember?.role || 'Member'
                };
            });

        updateSquad(id, { 
            name: squadName, 
            description: squadDescription,
            members: finalSelectedMembers
        });

        toast({
            title: "Squad Updated!",
            description: `${squadName} has been successfully updated.`,
        });

        setTimeout(() => {
            setIsSaving(false);
            router.push(`/squads/${id}`);
        }, 500);
    };

    if (!squad) {
        return <div>Loading squad...</div>;
    }

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Edit Squad</h1>
                    <p className="text-muted-foreground">Update the details for {squad.name}.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Squad Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="squad-name">Squad Name</Label>
                        <Input id="squad-name" value={squadName} onChange={(e) => setSquadName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="squad-description">Description</Label>
                        <Textarea id="squad-description" value={squadDescription} onChange={(e) => setSquadDescription(e.target.value)} />
                    </div>

                    <div className="space-y-4">
                        <Label>Invite New Member</Label>
                        <div className="flex gap-2">
                            <Input placeholder="Member Name" value={newMemberName} onChange={e => setNewMemberName(e.target.value)} />
                            <Input placeholder="Member Role" value={newMemberRole} onChange={e => setNewMemberRole(e.target.value)} />
                            <Button type="button" onClick={handleCreateNewMember}>Add</Button>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Manage Members</Label>
                        <ScrollArea className="h-48 rounded-md border">
                            <div className="p-4 space-y-2">
                            {availableMembers.map(member => (
                                <div key={member.id} className="flex items-center gap-3">
                                    <Checkbox 
                                        id={`member-${member.id}`} 
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
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
