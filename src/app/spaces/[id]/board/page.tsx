
'use client';

import { tasks as initialTasks, useSpaces } from "@/lib/spaces-data";
import { notFound, useParams } from "next/navigation";
import { SpaceKanban } from "../space-kanban";

export default function SpaceBoardPage() {
  const params = useParams();
  const id = params.id as string;
  const { getSpaceById, isLoading } = useSpaces();
  const space = getSpaceById(id);

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!space) {
    notFound();
  }

  return (
    <SpaceKanban space={space} initialTasks={initialTasks} />
  );
}
