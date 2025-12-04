
"use client";

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
import { Progress } from "@/components/ui/progress";
import { useSpaces } from "@/lib/spaces-data";
import { ArrowUpRight, PlusCircle, Edit, Trash2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useSquads } from "@/lib/squads-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";


export default function SpacesPage() {
  const router = useRouter();
  const { spaces, addSpace, deleteSpace, isLoading } = useSpaces();
  const { squads } = useSquads();
  const [isNewSpaceDialogOpen, setIsNewSpaceDialogOpen] = useState(false);

  const handleCreateSpace = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const spaceName = formData.get('space-name') as string;
    const spaceDescription = formData.get('space-description') as string;
    const squadId = formData.get('squad-id') as string;

    if (spaceName) {
      addSpace({
        name: spaceName,
        description: spaceDescription,
        squadId: squadId === 'none' ? null : squadId,
      });
      setIsNewSpaceDialogOpen(false);
    }
  };


  return (
    <div className="flex flex-col gap-8 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Spaces</h1>
            <p className="text-muted-foreground">Intelligent rooms where teams build features, fix issues, and move projects forward.</p>
            </div>
            <Dialog open={isNewSpaceDialogOpen} onOpenChange={setIsNewSpaceDialogOpen}>
              <DialogTrigger asChild>
                  <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Space
                  </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create a new Space</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to start a new space. Assign a squad to automatically add its members.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateSpace}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="space-name">Name</Label>
                      <Input id="space-name" name="space-name" placeholder="e.g. Dark Mode Feature" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="space-description">Description</Label>
                      <Textarea id="space-description" name="space-description" placeholder="A short description of the goal for this Space."/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="squad-id">Assign Squad (Optional)</Label>
                        <Select name="squad-id">
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
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Space</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
          </Dialog>
        </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {spaces.map((space) => (
          <Card key={space.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-headline text-xl">
                  <Link href={`/spaces/${space.id}`} className="hover:underline">
                    {space.name}
                  </Link>
                </CardTitle>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/spaces/edit/${space.id}`)}>
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
                                        This action cannot be undone. This will permanently delete this space.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteSpace(space.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{space.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">{space.progress}%</span>
              </div>
              <Progress value={space.progress} className="h-2" />
            </CardContent>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2 overflow-hidden">
                    {space.members.slice(0, 5).map(member => (
                        <Avatar key={member.name} className="h-8 w-8 border-2 border-card">
                            <AvatarImage data-ai-hint="person portrait" src={member.avatar} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    ))}
                     {space.members.length > 5 && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium">
                          +{space.members.length - 5}
                      </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{space.members.length} members</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
