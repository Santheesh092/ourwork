
'use client';

import { projects as initialProjects, tasks as initialTasks } from "@/lib/projects-data";
import { notFound, useParams } from "next/navigation";
import { ProjectKanban } from "./project-kanban";
import { useState } from "react";


export default function ProjectDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [projects, setProjects] = useState(initialProjects);
  const project = projects.find(p => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <ProjectKanban space={project} initialTasks={initialTasks} />
  );
}

    