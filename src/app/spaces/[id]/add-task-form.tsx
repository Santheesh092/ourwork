
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
import type { Task } from './space-kanban';

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
  spaceMembers: { name: string; avatar: string; }[];
}

export function AddTaskForm({ onTaskCreate, columnId, spaceMembers }: AddTaskFormProps) {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
        priority: 'Medium',
        points: 1,
        title: '',
        assignee: '',
        tags: '',
    }
  });

  const onSubmit = (data: TaskFormData) => {
    const selectedAssignee = spaceMembers.find(m => m.name === data.assignee);
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
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input id="title" {...register('title')} placeholder="e.g. Implement optimistic UI" />
        {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Controller
                name="assignee"
                control={control}
                render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                    {spaceMembers.map(member => (
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
                <Select onValueChange={field.onChange} value={field.value}>
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
            <Input id="tags" {...register('tags')} placeholder="UI, Backend" />
        </div>
      </div>

      <Button type="submit" className="w-full">Create Task</Button>
    </form>
  );
}
