"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { linkTasksToGitHubCommits, LinkTasksToGitHubCommitsOutput } from "@/ai/flows/link-tasks-to-github-commits";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Loader2 } from "lucide-react";

const formSchema = z.object({
  thoughtmapsUserId: z.string().min(1, "Thoughtmaps User ID is required."),
  githubUserId: z.string().min(1, "GitHub User ID is required."),
  taskId: z.string().min(1, "Task ID is required."),
  commitHash: z.string().min(7, "Commit hash must be at least 7 characters.").max(40, "Commit hash cannot be longer than 40 characters."),
});

export function GithubLinkerForm() {
  const { toast } = useToast();
  const [formResult, setFormResult] = useState<LinkTasksToGitHubCommitsOutput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      thoughtmapsUserId: "user-thoughtmaps-123",
      githubUserId: "user-github-456",
      taskId: "task-007",
      commitHash: "a1b2c3d",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setFormResult(null);
    try {
      const result = await linkTasksToGitHubCommits(values);
      setFormResult(result);
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setFormResult({ success: false, message: errorMessage });
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="thoughtmapsUserId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thoughtmaps User ID</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., user-thoughtmaps-123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="githubUserId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub User ID</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., user-github-456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="taskId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task ID</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., TSK-007" {...field} />
                </FormControl>
                <FormDescription>The ID of the task in Thoughtmaps.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="commitHash"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commit Hash</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., a1b2c3d" {...field} />
                </FormControl>
                <FormDescription>The full or short hash of the GitHub commit.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Linking..." : "Link Task"}
          </Button>
        </form>
      </Form>
      {formResult && (
         <Alert className="mt-6" variant={formResult.success ? "default" : "destructive"}>
            <Terminal className="h-4 w-4" />
            <AlertTitle>{formResult.success ? "Link Successful" : "Link Failed"}</AlertTitle>
            <AlertDescription>
                {formResult.message}
            </AlertDescription>
         </Alert>
      )}
    </>
  );
}
