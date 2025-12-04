
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { projects as initialProjects } from "@/lib/projects-data";
import { ArrowUpRight, PlusCircle } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";


export default function ProjectsPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);

  const handleCreateProject = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const projectName = formData.get('project-name') as string;
    const projectDescription = formData.get('project-description') as string;

    if (projectName) {
      const newProject = {
        id: projectName.toLowerCase().replace(/\s+/g, '-'),
        name: projectName,
        description: projectDescription,
        progress: 0,
        members: [],
      };
      setProjects([newProject, ...projects]);
      setIsNewProjectDialogOpen(false);
    }
  };


  return (
    <div className="flex flex-col gap-8 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Spaces</h1>
            <p className="text-muted-foreground">Intelligent rooms where teams build features, fix issues, and move projects forward.</p>
            </div>
            <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
              <DialogTrigger asChild>
                  <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Space
                  </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create a new Space</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to start a new space.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateProject}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="project-name" className="text-right">
                        Name
                      </Label>
                      <Input id="project-name" name="project-name" className="col-span-3" placeholder="e.g. Dark Mode Feature" />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="project-description" className="text-right pt-2">
                        Description
                      </Label>
                      <Textarea id="project-description" name="project-description" className="col-span-3" placeholder="A short description of the goal for this Space."/>
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
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-headline text-xl">{project.name}</CardTitle>
                <Button asChild variant="ghost" size="icon" className="h-6 w-6">
                    <Link href={`/projects/${project.id}`}><ArrowUpRight className="h-4 w-4" /></Link>
                </Button>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </CardContent>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2 overflow-hidden">
                    {project.members.slice(0, 5).map(member => (
                        <Avatar key={member.name} className="h-8 w-8 border-2 border-card">
                            <AvatarImage data-ai-hint="person portrait" src={member.avatar} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    ))}
                </div>
                <span className="text-xs text-muted-foreground">{project.members.length} members</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
