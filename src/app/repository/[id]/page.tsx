
'use client';

import { useParams, notFound } from 'next/navigation';
import { repositories, fileTree, files } from '@/lib/repositories-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileTree } from './file-tree';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { FileIcon, GitBranch, Star, Copy, Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from 'next/link';

const dummyReadme = `
# Thoughtmaps UI

This is the main UI for the Thoughtmaps application, built with Next.js and TypeScript.

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Project Management**: Kanban boards, task tracking, and sprint planning.
- **Real-time Chat**: Communicate with your team in channels and direct messages.
- **Documentation**: Integrated Markdown editor for project docs.
`;


export default function SingleRepositoryPage() {
  const params = useParams();
  const id = params.id as string;
  const repo = repositories.find(p => p.id === id);

  if (!repo) {
    notFound();
  }

  return (
    <>
      <aside>
        <div className="sticky top-24">
            <h3 className="font-semibold mb-2 px-2">File Tree</h3>
            <FileTree directory={fileTree} />
        </div>
      </aside>
      <main className="space-y-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-muted-foreground"/>
                    <span className="font-mono text-sm">main</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm"><Star className="mr-2 h-4 w-4" /> Star</Button>
                     <Button variant="secondary" size="sm"><Copy className="mr-2 h-4 w-4"/> Clone</Button>
                    <Button size="sm"><Download className="mr-2 h-4 w-4"/> Download</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Last commit message</TableHead>
                            <TableHead className="text-right">Last updated</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {files.map(file => (
                            <TableRow key={file.name}>
                                <TableCell className="font-medium flex items-center gap-2">
                                    {file.type === 'folder' ? <FileIcon className="h-4 w-4 text-blue-500"/> : <div className="w-4"/>}
                                    <Link href="#" className="hover:underline">{file.name}</Link>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{file.commit}</TableCell>
                                <TableCell className="text-right text-muted-foreground">{file.age}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>README.md</CardTitle>
          </CardHeader>
          <CardContent>
            <article className="prose dark:prose-invert prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{dummyReadme}</ReactMarkdown>
            </article>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
