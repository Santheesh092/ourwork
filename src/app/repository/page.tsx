
'use client';

import { useState } from 'react';
import { repositories as initialRepositories } from '@/lib/repositories-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Github, Code, Star, GitFork, Plus, Search, ListFilter } from 'lucide-react';
import Link from 'next/link';

export default function RepositoryPage() {
  const [repositories, setRepositories] = useState(initialRepositories);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    language: 'all',
  });

  const filteredRepositories = repositories
    .filter(repo =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(repo =>
      filters.type === 'all' ? true : repo.visibility === filters.type
    )
    .filter(repo =>
        filters.language === 'all' ? true : repo.tech.map(t => t.toLowerCase()).includes(filters.language)
    );
    
  const allLanguages = Array.from(new Set(initialRepositories.flatMap(repo => repo.tech)));


  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Repositories
          </h1>
          <p className="text-muted-foreground">
            Browse and manage your team's code repositories.
          </p>
        </div>
        <Button asChild>
          <Link href="/repository/new">
            <Plus className="mr-2 h-4 w-4" /> New Repository
          </Link>
        </Button>
      </div>

       <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search repositories..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto"><ListFilter className="mr-2 h-4 w-4" />Type</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked={filters.type === 'all'} onCheckedChange={() => setFilters(f => ({...f, type: 'all'}))}>All</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={filters.type === 'public'} onCheckedChange={() => setFilters(f => ({...f, type: 'public'}))}>Public</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={filters.type === 'private'} onCheckedChange={() => setFilters(f => ({...f, type: 'private'}))}>Private</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto"><Code className="mr-2 h-4 w-4" />Language</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by Language</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked={filters.language === 'all'} onCheckedChange={() => setFilters(f => ({...f, language: 'all'}))}>All</DropdownMenuCheckboxItem>
                    {allLanguages.map(lang => (
                        <DropdownMenuCheckboxItem key={lang} checked={filters.language === lang.toLowerCase()} onCheckedChange={() => setFilters(f => ({...f, language: lang.toLowerCase()}))}>{lang}</DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredRepositories.map(repo => (
          <Card key={repo.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-xl">
                <Github className="h-5 w-5 text-muted-foreground" />
                <Link href={`/repository/${repo.id}`} className="hover:underline">
                  {repo.name}
                </Link>
              </CardTitle>
              <CardDescription>{repo.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div className="flex flex-wrap gap-2">
                {repo.tech.map(t => (
                  <Badge key={t} variant="secondary">{t}</Badge>
                ))}
              </div>
              <div>
                <img data-ai-hint="activity graph" src="https://picsum.photos/seed/graph1/300/50" alt="Activity graph placeholder" className="w-full h-auto rounded-md opacity-50" />
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground flex justify-between items-center">
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" /> {repo.stars}
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="h-3 w-3" /> {repo.forks}
                </div>
                 <Badge variant={repo.visibility === 'public' ? 'outline' : 'default'} className="capitalize">{repo.visibility}</Badge>
              </div>
              <span>Updated {repo.lastUpdated}</span>
            </CardFooter>
          </Card>
        ))}
         {filteredRepositories.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center">No repositories found.</p>
        )}
      </div>
    </div>
  );
}
