
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSpaces } from '@/lib/spaces-data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSquads } from '@/lib/squads-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EditSpacePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();
  const { getSpaceById, updateSpace, isLoading: isSpacesLoading } = useSpaces();
  const { squads, isLoading: isSquadsLoading } = useSquads();

  const [space, setSpace] = useState(getSpaceById(id));
  const [spaceName, setSpaceName] = useState('');
  const [spaceDescription, setSpaceDescription] = useState('');
  const [squadId, setSquadId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const currentSpace = getSpaceById(id);
    setSpace(currentSpace);
    if (currentSpace) {
      setSpaceName(currentSpace.name);
      setSpaceDescription(currentSpace.description);
      setSquadId(currentSpace.squadId);
    }
  }, [id, getSpaceById]);
  
  if(isSpacesLoading || isSquadsLoading) {
    return <div>Loading...</div>
  }

  if (!space) {
    // router.push('/spaces'); // This can cause issues in some Next.js versions.
    return <div>Space not found.</div>;
  }
  
  const handleSave = () => {
    if (!space || !spaceName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing Name',
        description: 'Please provide a name for the space.',
      });
      return;
    }

    setIsSaving(true);
    
    updateSpace(id, { 
        name: spaceName, 
        description: spaceDescription,
        squadId: squadId,
    });

    toast({
        title: 'Space Updated!',
        description: `${spaceName} has been successfully updated.`,
    });

    setTimeout(() => {
        setIsSaving(false);
        router.push('/spaces');
    }, 500);
  };
  
  const handleSquadChange = (value: string) => {
    setSquadId(value === "none" ? null : value);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Edit Space</h1>
                <p className="text-muted-foreground">Update the details for {space.name}.</p>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Space Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="space-name">Space Name</Label>
                    <Input id="space-name" value={spaceName} onChange={(e) => setSpaceName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="space-description">Description</Label>
                    <Textarea id="space-description" value={spaceDescription} onChange={(e) => setSpaceDescription(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="squad-id">Assign Squad</Label>
                     <Select onValueChange={handleSquadChange} value={squadId || "none"}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a squad" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">No squad</SelectItem>
                            {squads.map(squad => (
                                <SelectItem key={squad.id} value={squad.id}>{squad.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Changing the squad will update the member list of this space.</p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => router.push('/spaces')}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
