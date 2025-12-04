
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 animate-fade-in">
       <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your profile, preferences, and workspace configuration.</p>
        </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                This is how others will see you on the site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex items-center gap-4">
                 <Avatar className="h-20 w-20">
                    <AvatarImage data-ai-hint="person portrait" src="https://picsum.photos/seed/user/80/80" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
               </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>
               <Button>Save Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications from Thoughtmaps.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="mentions-notifications" className="text-base">
                                Mentions
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Receive a notification when someone @mentions you.
                            </p>
                        </div>
                        <Switch id="mentions-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="task-updates-notifications" className="text-base">
                                Task Updates
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Get notified about updates to tasks you are assigned to.
                            </p>
                        </div>
                        <Switch id="task-updates-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="project-invites-notifications" className="text-base">
                                Project Invites
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Receive notifications for new project invitations.
                            </p>
                        </div>
                        <Switch id="project-invites-notifications" />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="weekly-summary-notifications" className="text-base">
                                Weekly Summary Email
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Receive a summary of your team's activity every week.
                            </p>
                        </div>
                        <Switch id="weekly-summary-notifications" />
                    </div>
                </div>
                 <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workspace">
          <Card>
            <CardHeader>
              <CardTitle>Workspace Settings</CardTitle>
              <CardDescription>
                Manage your team and workspace settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input id="workspace-name" defaultValue="Acme Inc." />
              </div>
              <div>
                <Label>Team Members</Label>
                <p className="text-sm text-muted-foreground mb-4">Invite and manage your team members.</p>
                <div className="space-y-2">
                    {['Olivia Martin', 'Jackson Lee', 'Isabella Nguyen'].map(name => (
                        <div key={name} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                           <div className="flex items-center gap-3">
                             <Avatar className="h-8 w-8">
                                <AvatarImage data-ai-hint="person portrait" src={`https://picsum.photos/seed/${name.split(' ')[0]}/32/32`} />
                                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">{name}</span>
                           </div>
                           <Button variant="outline" size="sm">Remove</Button>
                        </div>
                    ))}
                </div>
              </div>
              <Button>Save Workspace Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
