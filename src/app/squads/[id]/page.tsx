
'use client';

import { useSquads } from "@/lib/squads-data";
import { notFound, useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Trash2, Edit } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SquadDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { getSquadById, deleteSquad, isLoading } = useSquads();
  
  const [squad, setSquad] = useState(() => getSquadById(id));

  useEffect(() => {
    const currentSquad = getSquadById(id);
    setSquad(currentSquad);

    if (!isLoading && !currentSquad) {
        router.push('/squads');
    }
  }, [id, getSquadById, isLoading, router]);


  if (isLoading || !squad) {
    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-9 w-48 mb-2" />
                    <Skeleton className="h-5 w-72" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                             <Card key={i}>
                                <div className="flex items-center gap-4 p-4">
                                    <Skeleton className="h-16 w-16 rounded-full" />
                                    <div>
                                        <Skeleton className="h-6 w-24 mb-2" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  const handleDelete = () => {
    deleteSquad(squad.id);
    router.push('/squads');
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">{squad.name}</h1>
                <p className="text-muted-foreground">{squad.description}</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => router.push(`/squads/edit/${squad.id}`)}><Edit className="mr-2 h-4 w-4" /> Edit Squad</Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete Squad</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the squad
                                and remove its data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Squad Members</CardTitle>
                <CardDescription>The talented individuals powering the {squad.name}.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {squad.members.map(member => (
                        <Card key={member.name} className="overflow-hidden">
                            <div className="flex items-center gap-4 p-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage data-ai-hint="person portrait" src={member.avatar} />
                                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-semibold">{member.name}</h3>
                                    <Badge variant="secondary">{member.role}</Badge>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {squad.members.length === 0 && (
                        <p className="text-muted-foreground col-span-full text-center">This squad has no members yet.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
