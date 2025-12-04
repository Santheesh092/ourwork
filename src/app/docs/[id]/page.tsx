
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { useDocs, type Doc } from "@/lib/docs-data";
import { useSpaces } from "@/lib/spaces-data";
import { ArrowLeft, Download, Tag, Edit, Share2 } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { useToast } from "@/hooks/use-toast";

export default function DocViewerPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { toast } = useToast();
    const { getDocById, isLoading: isDocsLoading } = useDocs();
    const { getSpaceById, isLoading: isSpacesLoading } = useSpaces();
    const [doc, setDoc] = useState<Doc | null | undefined>(undefined);

    useEffect(() => {
        if (!isDocsLoading && id) {
            const foundDoc = getDocById(id);
            setDoc(foundDoc);
        }
    }, [id, isDocsLoading, getDocById]);
    
    const isLoading = isDocsLoading || isSpacesLoading;
    const space = doc?.spaceId ? getSpaceById(doc.spaceId) : null;
    
    const handleDownload = () => {
        if (!doc) return;
        const blob = new Blob([doc.content], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc.title.replace(/\s+/g, '_')}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

     const handleShare = () => {
        if (!doc) return;
        const url = `${window.location.origin}/docs/${doc.id}`;
        navigator.clipboard.writeText(url);
        toast({
            title: "Link Copied!",
            description: "A shareable link to this document has been copied to your clipboard.",
        });
    }

    if (isLoading || doc === undefined) {
        return (
            <div className="flex flex-col gap-8 animate-fade-in">
                 <div>
                    <Skeleton className="h-10 w-3/4"/>
                    <Skeleton className="h-5 w-1/2 mt-2"/>
                </div>
                <Card>
                    <CardContent className="p-6">
                        <Skeleton className="h-[500px] w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (doc === null) {
        return (
            <div className="text-center">
                <p>Document not found.</p>
                <Button onClick={() => router.push('/docs')} className="mt-4">Back to Documents</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                 <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="font-headline text-3xl font-bold tracking-tight">{doc.title}</h1>
                        <p className="text-sm text-muted-foreground">
                            Created on {format(new Date(doc.createdAt), "MMMM d, yyyy")}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => router.push(`/docs/edit/${doc.id}`)}><Edit className="mr-2 h-4 w-4"/>Edit</Button>
                    <Button variant="outline" onClick={handleShare}><Share2 className="mr-2 h-4 w-4"/>Share</Button>
                    <Button onClick={handleDownload}><Download className="mr-2 h-4 w-4"/>Download</Button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-2">
                     <Card>
                        <CardContent className="p-6">
                            <article className="prose dark:prose-invert max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.content}</ReactMarkdown>
                            </article>
                        </CardContent>
                    </Card>
                </div>
                <div className="sticky top-24">
                     <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div>
                                <h3 className="text-sm font-medium">Description</h3>
                                <p className="text-sm text-muted-foreground">{doc.description || "No description provided."}</p>
                            </div>
                            {space && (
                                <div className="flex items-start gap-2">
                                    <Tag className="h-4 w-4 text-muted-foreground mt-1" />
                                    <div>
                                        <h3 className="text-sm font-medium">Linked Space</h3>
                                        <Link href={`/spaces/${space.id}`} className="text-sm text-primary hover:underline">{space.name}</Link>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
