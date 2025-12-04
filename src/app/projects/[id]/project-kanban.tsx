
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import type { projects, tasks as initialTasksData } from "@/lib/projects-data";
import { cn } from "@/lib/utils";
import { AddTaskForm } from "./add-task-form";

const priorityVariantMap: Record<string, "default" | "secondary" | "destructive" | "outline" | null | undefined> = {
  High: "destructive",
  Medium: "default",
  Low: "secondary",
};

export type Task = (typeof initialTasksData.todo)[0];
export type ColumnId = keyof typeof initialTasksData;
type Space = (typeof projects)[0];

const TaskCard = ({ task, columnId, onTaskDelete }: { task: Task, columnId: ColumnId, onTaskDelete: (taskId: string, columnId: ColumnId) => void }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Card 
        className="mb-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200 shadow-sm hover:shadow-md"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('taskId', task.id);
          e.dataTransfer.setData('sourceColumn', columnId);
        }}
      >
        <CardContent className="p-4">
          <p className="font-semibold text-sm mb-2">{task.title}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant={priorityVariantMap[task.priority]}>{task.priority}</Badge>
              <span className="font-bold">{task.points} pts</span>
            </div>
            <Avatar className="h-6 w-6">
              <AvatarImage data-ai-hint="person portrait" src={task.assignee.avatar} />
              <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
      </Card>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{task.title}</DialogTitle>
        <DialogDescription>
          Details for task: {task.id}
        </DialogDescription>
      </DialogHeader>
      <div className="py-4 grid gap-2 text-sm">
        <div className="flex items-center gap-2"><strong>Assignee:</strong> {task.assignee.name}</div>
        <div className="flex items-center gap-2"><strong>Priority:</strong> <Badge variant={priorityVariantMap[task.priority]}>{task.priority}</Badge></div>
        <div className="flex items-center gap-2"><strong>Points:</strong> {task.points}</div>
        <div className="flex items-center gap-2"><strong>Tags:</strong> {task.tags.map(tag => <Badge key={tag} variant="outline" className="mr-1">{tag}</Badge>)}</div>
      </div>
      <DialogFooter className="border-t pt-4">
         <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete Task</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the task
                        and remove its data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <DialogClose asChild>
                        <AlertDialogAction onClick={() => onTaskDelete(task.id, columnId)}>
                            Continue
                        </AlertDialogAction>
                    </DialogClose>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);


const KanbanColumn = ({ title, tasks, id, onDrop, isDraggingOver, onTaskCreate, onTaskDelete }: { title: string, tasks: Task[], id: ColumnId, onDrop: (e: React.DragEvent<HTMLDivElement>, columnId: ColumnId) => void, isDraggingOver: boolean, onTaskCreate: (task: Task, columnId: ColumnId) => void, onTaskDelete: (taskId: string, columnId: ColumnId) => void }) => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const handleTaskCreated = (task: Task) => {
    onTaskCreate(task, id);
    setIsAddTaskOpen(false);
  }
    
  return (
  <div 
    className={cn(
        "flex flex-col w-full flex-1 bg-muted/50 rounded-xl transition-colors",
        isDraggingOver && "bg-primary/10"
    )}
    onDrop={(e) => onDrop(e, id)}
    onDragOver={(e) => e.preventDefault()}
  >
    <div className="p-4 flex items-center justify-between border-b">
      <h3 className="font-headline font-semibold">{title} <Badge variant="secondary" className="ml-2">{tasks.length}</Badge></h3>
      <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
    </div>
    <div className="flex-grow min-h-[100px] p-4">
      {tasks.map(task => <TaskCard key={task.id} task={task} columnId={id} onTaskDelete={onTaskDelete}/>)}
    </div>
    <div className="p-4 mt-auto border-t">
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                <PlusCircle className="mr-2 h-4 w-4" /> Add task
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new task to "{title}"</DialogTitle>
                    <DialogDescription>Fill in the details below to create a new task.</DialogDescription>
                </DialogHeader>
                <AddTaskForm onTaskCreate={handleTaskCreated} columnId={id} />
            </DialogContent>
        </Dialog>
    </div>
  </div>
);
}

interface ProjectKanbanProps {
    space: Space;
    initialTasks: typeof initialTasksData;
}

export function ProjectKanban({ space, initialTasks }: ProjectKanbanProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [draggingOver, setDraggingOver] = useState<ColumnId | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColumn: ColumnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColumn = e.dataTransfer.getData('sourceColumn') as ColumnId;
    
    setDraggingOver(null);

    if (sourceColumn === targetColumn) {
      return;
    }
    
    let taskToMove: Task | undefined;
    const newTasks = { ...tasks };

    // Find and remove task from source column
    const sourceTasks = [...newTasks[sourceColumn]];
    const taskIndex = sourceTasks.findIndex(t => t.id === taskId);
    if (taskIndex > -1) {
      [taskToMove] = sourceTasks.splice(taskIndex, 1);
      newTasks[sourceColumn] = sourceTasks;
    }

    // Add task to target column
    if (taskToMove) {
      const targetTasks = [...newTasks[targetColumn]];
      targetTasks.unshift(taskToMove); // Add to the top of the list
      newTasks[targetColumn] = targetTasks;
    }

    setTasks(newTasks);
  };

  const handleTaskCreate = (task: Task, columnId: ColumnId) => {
    setTasks(prevTasks => {
      const newTasks = { ...prevTasks };
      newTasks[columnId] = [task, ...newTasks[columnId]];
      return newTasks;
    });
  }

  const handleTaskDelete = (taskId: string, columnId: ColumnId) => {
    setTasks(prevTasks => {
      const newTasks = { ...prevTasks };
      newTasks[columnId] = newTasks[columnId].filter(task => task.id !== taskId);
      return newTasks;
    });
  }

  const handleDragEnter = (columnId: ColumnId) => {
    setDraggingOver(columnId);
  };
  
  const handleDragLeave = () => {
    setDraggingOver(null);
  };


  return (
    <div className="flex flex-col gap-8 animate-fade-in" onDragLeave={handleDragLeave}>
       <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">{space.name}</h1>
          <p className="text-muted-foreground">{space.description}</p>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
            {(Object.keys(tasks) as ColumnId[]).map(columnId => {
              const columnTitle = columnId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
              return (
                <div
                    key={columnId}
                    className="flex-1"
                    onDragEnter={() => handleDragEnter(columnId)}
                >
                    <KanbanColumn 
                        id={columnId} 
                        title={columnTitle} 
                        tasks={tasks[columnId]}
                        onDrop={handleDrop}
                        isDraggingOver={draggingOver === columnId}
                        onTaskCreate={handleTaskCreate}
                        onTaskDelete={handleTaskDelete}
                    />
                </div>
              )
            })}
        </div>
    </div>
  );
}
