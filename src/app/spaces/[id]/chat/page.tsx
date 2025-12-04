
"use client";

import { notFound, useParams } from "next/navigation";
import { useSpaces } from "@/lib/spaces-data";
import { SpaceChat } from "./space-chat";

export default function SpaceChatPage() {
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

  return <SpaceChat space={space} />;
}
