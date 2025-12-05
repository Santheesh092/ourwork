'use client';

import { useState } from 'react';
import { Folder, File, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FileOrFolder } from '@/lib/repositories-data';

interface FileTreeProps {
  directory: FileOrFolder[];
}

const TreeItem = ({ item }: { item: FileOrFolder }) => {
  const [isOpen, setIsOpen] = useState(item.type === 'folder');

  const Icon = item.type === 'folder' ? Folder : File;

  return (
    <div className="text-sm">
      <div
        className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {item.type === 'folder' && (
          <ChevronRight
            className={cn('h-4 w-4 shrink-0 transition-transform', isOpen && 'rotate-90')}
          />
        )}
        <Icon className={cn('h-4 w-4 shrink-0', item.type === 'folder' ? 'text-blue-500' : 'text-muted-foreground')} />
        <span>{item.name}</span>
      </div>
      {isOpen && item.children && (
        <div className="pl-6 border-l border-border ml-3">
          {item.children.map((child) => (
            <TreeItem key={child.name} item={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileTree = ({ directory }: FileTreeProps) => {
  return (
    <div className="space-y-1">
      {directory.map((item) => (
        <TreeItem key={item.name} item={item} />
      ))}
    </div>
  );
};