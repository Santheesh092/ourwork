
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lock, BookOpen, GitBranch, FileCode, Scale, Github } from "lucide-react";

export default function NewRepositoryPage() {
  const router = useRouter();
  const [repoName, setRepoName] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);

  const handleCreateRepo = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would make an API call here.
    console.log('Creating repository:', { repoName, isPrivate });
    router.push(`/repository/${repoName.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Create a new repository</h1>
        <p className="text-muted-foreground">
          A repository contains all project files, including the revision history.
        </p>
      </div>

      <form onSubmit={handleCreateRepo}>
        <Card>
          <CardHeader>
            <CardTitle>Repository Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="owner">Owner</Label>
                <Input id="owner" defaultValue="John Doe / My Workspace" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repo-name">Repository name</Label>
                <Input 
                  id="repo-name" 
                  placeholder="my-awesome-project" 
                  required 
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea id="description" placeholder="A short description of your project." />
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <div 
                className="flex items-start gap-4 p-2 rounded-md cursor-pointer"
                onClick={() => setIsPrivate(false)}
              >
                <BookOpen className="h-5 w-5 mt-1 text-muted-foreground" />
                <div>
                  <Label htmlFor="public-switch" className="font-bold">Public</Label>
                  <p className="text-sm text-muted-foreground">Anyone on the internet can see this repository. You choose who can commit.</p>
                </div>
                <Switch id="public-switch" checked={!isPrivate} onCheckedChange={(c) => setIsPrivate(!c)} className="ml-auto"/>
              </div>
              <div 
                className="flex items-start gap-4 p-2 rounded-md cursor-pointer"
                onClick={() => setIsPrivate(true)}
              >
                <Lock className="h-5 w-5 mt-1 text-muted-foreground" />
                <div>
                  <Label htmlFor="private-switch" className="font-bold">Private</Label>
                  <p className="text-sm text-muted-foreground">You choose who can see and commit to this repository.</p>
                </div>
                <Switch id="private-switch" checked={isPrivate} onCheckedChange={setIsPrivate} className="ml-auto"/>
              </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Initialize this repository with:</h3>
                 <div className="flex items-center space-x-2">
                    <Switch id="add-readme" />
                    <Label htmlFor="add-readme">Add a README file</Label>
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="add-gitignore">Add .gitignore</Label>
                        <Select>
                            <SelectTrigger id="add-gitignore">
                                <SelectValue placeholder="None" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="node">Node</SelectItem>
                                <SelectItem value="python">Python</SelectItem>
                                <SelectItem value="rust">Rust</SelectItem>
                                <SelectItem value="next">Next.js</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="add-license">Choose a license</Label>
                        <Select>
                            <SelectTrigger id="add-license">
                                <SelectValue placeholder="None" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mit">MIT License</SelectItem>
                                <SelectItem value="apache">Apache License 2.0</SelectItem>
                                <SelectItem value="gpl">GNU GPL v3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <Button type="submit" size="lg">
              <Github className="mr-2 h-4 w-4" /> Create repository
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
