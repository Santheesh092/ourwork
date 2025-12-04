
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { projects } from '@/lib/projects-data';
import type { Task } from './project-kanban';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  points: z.coerce.number().min(0, 'Points must be a positive number'),
  priority: z.enum(['Low', 'Medium', 'High']),
  assignee: z.string().min(1, 'Assignee is required'),
  tags: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface AddTaskFormProps {
  onTaskCreate: (task: Task) => void;
  columnId: 'todo' | 'in-progress' | 'done';
}

const projectMembers = projects.flatMap(p => p.members);
const uniqueMembers = Array.from(new Map(projectMembers.map(m => [m.name, m])).values());


export function AddTaskForm({ onTaskCreate, columnId }: AddTaskFormProps) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
        priority: 'Medium',
        points: 1,
    }
  });

  const onSubmit = (data: TaskFormData) => {
    const selectedAssignee = uniqueMembers.find(m => m.name === data.assignee);
    if (!selectedAssignee) return;
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: data.title,
      priority: data.priority,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
      points: data.points,
      assignee: {
        name: selectedAssignee.name,
        avatar: selectedAssignee.avatar,
      },
    };
    onTaskCreate(newTask);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input id="title" {...register('title')} />
        {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Controller
                name="assignee"
                control={control}
                render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                    {uniqueMembers.map(member => (
                        <SelectItem key={member.name} value={member.name}>
                        {member.name}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                )}
            />
            {errors.assignee && <p className="text-destructive text-sm">{errors.assignee.message}</p>}
        </div>
         <div className="space-y-2">
          <Label htmlFor="points">Story Points</Label>
          <Input id="points" type="number" {...register('points')} />
          {errors.points && <p className="text-destructive text-sm">{errors.points.message}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                </Select>
                )}
            />
            {errors.priority && <p className="text-destructive text-sm">{errors.priority.message}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" {...register('tags')} />
        </div>
      </div>

      <Button type="submit" className="w-full">Create Task</Button>
    </form>
  );
}
