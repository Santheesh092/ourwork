
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, PlusCircle, Users, ClipboardCheck, MessageSquare, ListTodo } from "lucide-react";
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
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSpaces } from "@/lib/spaces-data";
import { useSquads } from "@/lib/squads-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const allPossibleActivities = [
  { user: 'Liam Garcia', avatar: '6', action: 'assigned you a task', task: 'Update user documentation', time: '2m ago' },
  { user: 'Ava Rodriguez', avatar: '7', action: 'mentioned you in a comment on', task: 'Q4 planning document', time: '15m ago' },
  { user: 'Noah Hernandez', avatar: '8', action: 'pushed a new commit to', task: 'feat(chat): real-time messaging', time: '30m ago' },
  { user: 'Emma Smith', avatar: '9', action: 'archived the Space', task: 'Old Landing Page', time: '45m ago' },
  { user: 'Lucas Jones', avatar: '10', action: 'requested a review on pull request', task: '#231 - Refactor auth service', time: '1h ago' },
  { user: 'Mia Brown', avatar: '11', action: 'deployed a new version to staging', task: 'v1.2.0-beta', time: '2h ago' },
];

const initialActivityFeed = [
  { user: 'Olivia Martin', avatar: '1', action: 'commented on', task: 'Implement new auth flow', time: '5m ago' },
  { user: 'Jackson Lee', avatar: '2', action: 'created a new Space', task: 'Q3 Marketing', time: '1h ago' },
  { user: 'Isabella Nguyen', avatar: '3', action: 'completed task', task: 'Design new landing page', time: '3h ago' },
  { user: 'William Kim', avatar: '4', action: 'pushed a new commit to', task: 'fix(api): user endpoint', time: '5h ago' },
  { user: 'Sophia Davis', avatar: '5', action: 'added you to Space', task: 'Mobile App Launch', time: '1d ago' },
];


export default function DashboardPage() {
  const router = useRouter();
  const { spaces, addSpace } = useSpaces();
  const { squads } = useSquads();
  const [activityFeed, setActivityFeed] = useState(initialActivityFeed);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [isNewSpaceDialogOpen, setIsNewSpaceDialogOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = allPossibleActivities[Math.floor(Math.random() * allPossibleActivities.length)];
      setActivityFeed(prevFeed => [{ ...newActivity, time: 'Just now' }, ...prevFeed].slice(0, 10));
    }, 5000);

    return () => clearInterval(interval);
  }, [activityFeed]);


  const handleCreateTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const taskTitle = formData.get('task-title') as string;
    
    if (taskTitle) {
      const newActivity = {
        user: 'You',
        avatar: 'user',
        action: 'created a new task',
        task: taskTitle,
        time: 'Just now',
      };
      setActivityFeed([newActivity, ...activityFeed]);
      setIsNewTaskDialogOpen(false);
    }
  };

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
      
      const newActivity = {
        user: 'You',
        avatar: 'user',
        action: 'created a new Space',
        task: spaceName,
        time: 'Just now',
      };
      setActivityFeed([newActivity, ...activityFeed]);

      setIsNewSpaceDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground">Here's a look at your day. Ready to dive in?</p>
        </div>
        <div className="flex gap-2">
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
                  A Space is a self-contained universe for a feature, epic, or initiative.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateSpace}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="space-name">Name</Label>
                    <Input id="space-name" name="space-name" placeholder="e.g. Website Redesign" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="space-description">Description</Label>
                    <Textarea id="space-description" name="space-description" placeholder="What is the goal of this Space?"/>
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
          <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create a new task</DialogTitle>
                <DialogDescription>
                  Fill in the details below to add a new task to your project.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTask}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task-title" className="text-right">
                      Title
                    </Label>
                    <Input id="task-title" name="task-title" className="col-span-3" placeholder="e.g. Implement user authentication" />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="task-description" className="text-right pt-2">
                      Description
                    </Label>
                    <Textarea id="task-description" name="task-description" className="col-span-3" placeholder="Add a more detailed description..."/>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Task</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spaces</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{spaces.length}</div>
            <p className="text-xs text-muted-foreground">+2 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Mentions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+5</div>
            <p className="text-xs text-muted-foreground">in 3 active spaces</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21</div>
            <p className="text-xs text-muted-foreground">3 are overdue</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
                <CardTitle>Spaces</CardTitle>
                <CardDescription>An overview of your current spaces.</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/spaces">View All<ArrowUpRight className="h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {spaces.map(space => (
              <div key={space.name}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{space.name}</span>
                  <span className="text-sm text-muted-foreground">{space.progress}%</span>
                </div>
                <Progress value={space.progress} className="h-2 mt-2" />
                 <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{space.members.length} members</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
            <CardDescription>Recent activities from your team.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activityFeed.map((activity, i) => (
              <div className="flex items-start gap-4" key={i}>
                <Avatar>
                  <AvatarImage data-ai-hint="person portrait" src={`https://picsum.photos/seed/${activity.avatar}/40/40`} />
                  <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p>
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-muted-foreground"> {activity.action} </span>
                    <span className="font-medium">{activity.task}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
