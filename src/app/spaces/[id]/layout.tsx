
'use client';

import { useSpaces } from "@/lib/spaces-data";
import { notFound, useParams, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { KanbanSquare, MessageSquare, FileText, Voicemail } from "lucide-react";

export default function SpaceDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const id = params.id as string;
  const { getSpaceById, isLoading } = useSpaces();
  const space = getSpaceById(id);

  if (isLoading) {
      return <div>Loading...</div>
  }

  if (!space) {
    notFound();
  }

  const getActiveTab = () => {
    if (pathname.includes('/board')) return 'board';
    if (pathname.includes('/chat')) return 'chat';
    if (pathname.includes('/docs')) return 'docs';
    if (pathname.includes('/video-notes')) return 'video-notes';
    return 'board';
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">{space.name}</h1>
        <p className="text-muted-foreground">{space.description}</p>
      </div>

      <Tabs value={getActiveTab()} className="w-full">
        <TabsList>
            <TabsTrigger value="board" asChild>
                <Link href={`/spaces/${id}/board`}><KanbanSquare className="mr-2 h-4 w-4" /> Board</Link>
            </TabsTrigger>
            <TabsTrigger value="chat" asChild>
                <Link href={`/spaces/${id}/chat`}><MessageSquare className="mr-2 h-4 w-4" /> Chat</Link>
            </TabsTrigger>
            <TabsTrigger value="docs" asChild>
                <Link href={`/spaces/${id}/docs`}><FileText className="mr-2 h-4 w-4" /> Docs</Link>
            </TabsTrigger>
            <TabsTrigger value="video-notes" asChild>
                <Link href={`/spaces/${id}/video-notes`}><Voicemail className="mr-2 h-4 w-4" /> Video Notes</Link>
            </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}
