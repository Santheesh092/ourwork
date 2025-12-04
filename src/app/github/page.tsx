import { GithubLinkerForm } from '@/components/github-link-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github } from 'lucide-react';

export default function GithubPage() {
  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Link to GitHub</h1>
        <p className="text-muted-foreground">
          Connect your Thoughtmaps tasks to GitHub commits for seamless traceability.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Github className="h-8 w-8" />
            <div>
              <CardTitle>Link Task to Commit</CardTitle>
              <CardDescription>
                Fill in the details below to create a link between a task and a GitHub commit.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <GithubLinkerForm />
        </CardContent>
      </Card>
    </div>
  );
}
