
'use client';

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useDocs } from "@/lib/docs-data";
import { formatDistanceToNow } from "date-fns";
import { FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function SpaceDocsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { docs, isLoading } = useDocs();
  
  const spaceDocs = docs.filter(doc => doc.spaceId === id);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Documents</CardTitle>
        <CardDescription>Documents and notes associated with this space.</CardDescription>
      </CardHeader>
      <CardContent>
         {isLoading ? (
            <div className="grid gap-6">
                {[...Array(2)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-5 w-3/4"/>
                            <Skeleton className="h-4 w-1/2"/>
                        </CardHeader>
                         <CardContent>
                            <Skeleton className="h-10 w-full"/>
                        </CardContent>
                    </Card>
                ))}
            </div>
        ) : spaceDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
              <p>No documents have been linked to this Space yet.</p>
              <Button variant="link" asChild><Link href="/docs/new">Create one now</Link></Button>
          </div>
        ) : (
            <div className="space-y-6">
                {spaceDocs.map(doc => (
                     <Card key={doc.id} className="cursor-pointer" onClick={() => router.push(`/docs/${doc.id}`)}>
                        <CardHeader>
                            <CardTitle className="font-headline text-xl">{doc.title}</CardTitle>
                            <CardDescription>
                                Last updated {formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-sm dark:prose-invert max-w-none line-clamp-3">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.content}</ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
