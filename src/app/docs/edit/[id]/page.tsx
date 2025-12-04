
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useDocs, type Doc } from "@/lib/docs-data";
import { useSpaces } from "@/lib/spaces-data";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Skeleton } from "@/components/ui/skeleton";

export default function EditDocPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { toast } = useToast();
    const { getDocById, updateDoc, isLoading: isDocsLoading } = useDocs();
    const { spaces, isLoading: isSpacesLoading } = useSpaces();

    const [doc, setDoc] = useState<Doc | null | undefined>(undefined);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [spaceId, setSpaceId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (id && !isDocsLoading) {
            const foundDoc = getDocById(id);
            setDoc(foundDoc);
            if (foundDoc) {
                setTitle(foundDoc.title);
                setDescription(foundDoc.description);
                setContent(foundDoc.content);
                setSpaceId(foundDoc.spaceId);
            }
        }
    }, [id, getDocById, isDocsLoading]);

    const handleSave = () => {
        if (!doc || !title.trim()) {
            toast({
                variant: "destructive",
                title: "Missing Title",
                description: "Please provide a title for your document.",
            });
            return;
        }

        setIsSaving(true);
        updateDoc(doc.id, { title, description, content, spaceId });

        toast({
            title: "Changes Saved!",
            description: "Your document has been updated.",
        });

        setTimeout(() => {
            router.push('/docs');
        }, 500);
    };

    const handleSpaceChange = (value: string) => {
        setSpaceId(value === "none" ? null : value);
    };
    
    const isLoading = isDocsLoading || isSpacesLoading;

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
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Edit Document</h1>
                    <p className="text-muted-foreground">Update the details for your document.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Document Editor</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Short Description</Label>
                            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="space">Link to Space (Optional)</Label>
                            <Select onValueChange={handleSpaceChange} value={spaceId || "none"}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a space..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {spaces.map(s => (
                                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Content (Markdown)</Label>
                            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={15} />
                        </div>
                    </div>
                     <div className="space-y-2">
                         <Label>Preview</Label>
                         <Card className="h-full min-h-[300px]">
                            <CardContent className="p-6">
                                <article className="prose dark:prose-invert max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                                </article>
                            </CardContent>
                         </Card>
                     </div>
                </CardContent>
                <CardFooter className="flex justify-end p-6 border-t">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
