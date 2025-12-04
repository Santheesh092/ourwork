
'use client';

import {
  Code,
  GitPullRequest,
  ShieldCheck,
  PlayCircle,
  KanbanSquare,
  Settings,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useParams, notFound } from 'next/navigation';
import { cn } from '@/lib/utils';
import { repositories } from '@/lib/repositories-data';

const repoNavItems = [
  { href: '', label: 'Code', icon: Code },
  { href: '/issues', label: 'Issues', icon: AlertCircle },
  { href: '/pull-requests', label: 'Pull Requests', icon: GitPullRequest },
  { href: '/actions', label: 'Actions', icon: PlayCircle },
  { href: '/projects', label: 'Projects', icon: KanbanSquare },
  { href: '/security', label: 'Security', icon: ShieldCheck },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function RepositoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const id = params.id as string;
  
  const repo = repositories.find(r => r.id === id);
  const repoBasePath = `/repository/${id}`;

  const isActive = (href: string) => {
    const fullPath = `${repoBasePath}${href}`;
    // Exact match for base code path, startsWith for sub-paths
    if (href === '') return pathname === repoBasePath;
    return pathname.startsWith(fullPath);
  };

  if (!repo) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="font-headline text-2xl font-bold tracking-tight text-primary">
                {repo.name}
            </h1>
            <p className="text-muted-foreground">{repo.description}</p>
        </div>
      </div>
      
      <div className="border-b">
         <nav className="-mb-px flex space-x-6 overflow-x-auto">
            {repoNavItems.map(item => (
            <Link
                key={item.label}
                href={`${repoBasePath}${item.href}`}
                className={cn(
                'flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors',
                isActive(item.href)
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                )}
            >
                <item.icon className="h-4 w-4" />
                {item.label}
            </Link>
            ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[240px_1fr]">
        {children}
      </div>
    </div>
  );
}
