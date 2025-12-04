
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useDocs } from "@/lib/docs-data";
import { useSpaces } from "@/lib/spaces-data";
import { Loader2, Save } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function NewDocPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { addDoc } = useDocs();
    const { spaces } = useSpaces();
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [spaceId, setSpaceId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!title.trim()) {
            toast({
                variant: "destructive",
                title: "Missing Title",
                description: "Please provide a title for your document.",
            });
            return;
        }

        setIsSaving(true);
        addDoc({
            title,
            description,
            content,
            spaceId,
        });

        toast({
            title: "Document Saved!",
            description: "Your document has been successfully saved.",
        });

        setTimeout(() => {
            router.push('/docs');
        }, 500);
    };
    
    const handleSpaceChange = (value: string) => {
        setSpaceId(value === "none" ? null : value);
    };

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">New Document</h1>
                <p className="text-muted-foreground">Create a new document to share knowledge with your team.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Document Editor</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" placeholder="e.g., Q4 Engineering Roadmap" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="description">Short Description</Label>
                            <Input id="description" placeholder="A brief summary of the document's content" value={description} onChange={(e) => setDescription(e.target.value)} />
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
                            <Textarea id="content" placeholder="Write your document content here. Supports Markdown." value={content} onChange={(e) => setContent(e.target.value)} rows={15} />
                        </div>
                    </div>
                     <div className="space-y-2">
                         <Label>Preview</Label>
                         <Card className="h-full min-h-[300px]">
                            <CardContent className="p-6">
                                <article className="prose dark:prose-invert max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "Start typing to see a preview..."}</ReactMarkdown>
                                </article>
                            </CardContent>
                         </Card>
                     </div>
                </CardContent>
                <CardFooter className="flex justify-end p-6 border-t">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                        Save Document
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
