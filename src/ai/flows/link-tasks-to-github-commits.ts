'use server';
/**
 * @fileOverview Links Thoughtmaps tasks to GitHub commits after user approval.
 *
 * - linkTasksToGitHubCommits - A function that handles the linking process.
 * - LinkTasksToGitHubCommitsInput - The input type for the linkTasksToGitHubCommits function.
 * - LinkTasksToGitHubCommitsOutput - The return type for the linkTasksToGitHubCommits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LinkTasksToGitHubCommitsInputSchema = z.object({
  thoughtmapsUserId: z.string().describe('The user ID on Thoughtmaps.'),
  githubUserId: z.string().describe('The user ID on GitHub.'),
  taskId: z.string().describe('The ID of the task on Thoughtmaps.'),
  commitHash: z.string().describe('The hash of the GitHub commit to link to the task.'),
});
export type LinkTasksToGitHubCommitsInput = z.infer<typeof LinkTasksToGitHubCommitsInputSchema>;

const LinkTasksToGitHubCommitsOutputSchema = z.object({
  success: z.boolean().describe('Indicates whether the linking was successful.'),
  message: z.string().describe('A message providing additional information about the linking result.'),
});
export type LinkTasksToGitHubCommitsOutput = z.infer<typeof LinkTasksToGitHubCommitsOutputSchema>;

export async function linkTasksToGitHubCommits(input: LinkTasksToGitHubCommitsInput): Promise<LinkTasksToGitHubCommitsOutput> {
  return linkTasksToGitHubCommitsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'linkTasksToGitHubCommitsPrompt',
  input: {schema: LinkTasksToGitHubCommitsInputSchema},
  output: {schema: LinkTasksToGitHubCommitsOutputSchema},
  prompt: `You are an assistant that links tasks on Thoughtmaps to GitHub commits, ensuring traceability between code changes and project tasks.

  The user has authorized the association of their Thoughtmaps account with their GitHub account.

  Link the Thoughtmaps task with ID {{{taskId}}} to the GitHub commit with hash {{{commitHash}}}.
  Associate the Thoughtmaps user with ID {{{thoughtmapsUserId}}} with the GitHub user ID {{{githubUserId}}}.

  Return a JSON object indicating the success of the operation and a descriptive message.
  `,
});

const linkTasksToGitHubCommitsFlow = ai.defineFlow(
  {
    name: 'linkTasksToGitHubCommitsFlow',
    inputSchema: LinkTasksToGitHubCommitsInputSchema,
    outputSchema: LinkTasksToGitHubCommitsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
