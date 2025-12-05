
'use client';

import { useEffect, useState, useCallback } from "react";
import { useSquads, type Squad } from './squads-data';

export type Space = {
    id: string;
    name: string;
    description: string;
    progress: number;
    members: {
        role: string; name: string; avatar: string; 
}[];
    squadId: string | null;
};

const initialSpaces: Space[] = [
    { 
      id: 'website-redesign',
      name: 'Website Redesign', 
      description: 'Modernize the company website and improve user experience.',
      progress: 75, 
      members: [
        {
          name: 'Alex', avatar: 'https://picsum.photos/seed/alex/32/32',
          role: ""
        },
        {
          name: 'Sam', avatar: 'https://picsum.photos/seed/sam/32/32',
          role: ""
        },
        {
          name: 'Jordan', avatar: 'https://picsum.photos/seed/jordan/32/32',
          role: ""
        },
        {
          name: 'Chris', avatar: 'https://picsum.photos/seed/chris/32/32',
          role: ""
        },
        {
          name: 'Taylor', avatar: 'https://picsum.photos/seed/taylor/32/32',
          role: ""
        },
      ],
      squadId: 'alpha-squad',
    },
    { 
      id: 'mobile-app-launch',
      name: 'Mobile App Launch', 
      description: 'Launch the new mobile app for iOS and Android.',
      progress: 40, 
      members: [
        {
          name: 'Olivia', avatar: 'https://picsum.photos/seed/olivia/32/32',
          role: ""
        },
        {
          name: 'Jackson', avatar: 'https://picsum.photos/seed/jackson/32/32',
          role: ""
        },
        {
          name: 'Isabella', avatar: 'https://picsum.photos/seed/isabella/32/32',
          role: ""
        },
      ], 
      squadId: 'bravo-squad',
    },
    { 
      id: 'api-integration',
      name: 'API Integration', 
      description: 'Integrate with third-party APIs for enhanced functionality.',
      progress: 90, 
      members: [
        {
          name: 'William', avatar: 'https://picsum.photos/seed/william/32/32',
          role: ""
        },
        {
          name: 'Sophia', avatar: 'https://picsum.photos/seed/sophia/32/32',
          role: ""
        },
      ],
      squadId: null,
    },
    { 
      id: 'marketing-campaign',
      name: 'Marketing Campaign',
      description: 'Plan and execute the Q3 marketing campaign.',
      progress: 20,
      members: [
        {
          name: 'Emma', avatar: 'https://picsum.photos/seed/emma/32/32',
          role: ""
        },
        {
          name: 'Liam', avatar: 'https://picsum.photos/seed/liam/32/32',
          role: ""
        },
        {
          name: 'Ava', avatar: 'https://picsum.photos/seed/ava/32/32',
          role: ""
        },
        {
          name: 'Noah', avatar: 'https://picsum.photos/seed/noah/32/32',
          role: ""
        },
      ],
      squadId: 'charlie-squad',
    },
  ];

const getStoredSpaces = (): Space[] => {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem('spaces');
        if (stored) {
            return JSON.parse(stored);
        }
        localStorage.setItem('spaces', JSON.stringify(initialSpaces));
        return initialSpaces;
    } catch (error) {
        console.error("Failed to parse spaces from localStorage", error);
        return initialSpaces;
    }
};

const setStoredSpaces = (spaces: Space[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('spaces', JSON.stringify(spaces));
    }
};

export const useSpaces = () => {
    const [spaces, setSpaces] = useState<Space[]>([]);
    const { getSquadById } = useSquads();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setSpaces(getStoredSpaces());
        setIsLoading(false);
    }, []);

    const addSpace = (space: Omit<Space, 'id' | 'members' | 'progress'>) => {
        const squad = space.squadId ? getSquadById(space.squadId) : null;
        const members = squad ? squad.members.map(m => ({ role: m.role ?? '', name: m.name, avatar: m.avatar })) : [];

        const newSpace: Space = {
            ...space,
            id: space.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
            progress: 0,
            members,
        };
        const updatedSpaces = [...spaces, newSpace];
        setSpaces(updatedSpaces);
        setStoredSpaces(updatedSpaces);
        return newSpace;
    };
    
    const getSpaceById = useCallback((id: string) => {
        return spaces.find(space => space.id === id);
    }, [spaces]);

    const updateSpace = (id: string, updates: Partial<Omit<Space, 'id'>>) => {
        const updatedSpaces = spaces.map(space => {
            if (space.id === id) {
                const updatedSpace = { ...space, ...updates };
                if (updates.squadId !== undefined) {
                    const squad = updates.squadId ? getSquadById(updates.squadId) : null;
                    updatedSpace.members = squad ? squad.members.map(m => ({ role: m.role ?? '', name: m.name, avatar: m.avatar })) : [];
                }
                return updatedSpace;
            }
            return space;
        });
        setSpaces(updatedSpaces);
        setStoredSpaces(updatedSpaces);
    };

    const deleteSpace = (id: string) => {
        const updatedSpaces = spaces.filter(space => space.id !== id);
        setSpaces(updatedSpaces);
        setStoredSpaces(updatedSpaces);
    };

    return { spaces, isLoading, addSpace, getSpaceById, updateSpace, deleteSpace };
}
  
export const tasks = {
    todo: [
      { id: 'task-1', title: 'Setup CI/CD pipeline', priority: 'High', tags: ['DevOps'], points: 8, assignee: { name: 'Alex', avatar: 'https://picsum.photos/seed/alex/32/32' } },
      { id: 'task-2', title: 'Design user profile page', priority: 'Medium', tags: ['UI/UX', 'Design'], points: 5, assignee: { name: 'Sam', avatar: 'https://picsum.photos/seed/sam/32/32' } },
      { id: 'task-3', title: 'Onboarding flow illustrations', priority: 'Low', tags: ['Design'], points: 3, assignee: { name: 'Jordan', avatar: 'https://picsum.photos/seed/jordan/32/32' } },
    ],
    'in-progress': [
      { id: 'task-4', title: 'Implement authentication flow', priority: 'High', tags: ['Backend', 'Security'], points: 8, assignee: { name: 'Chris', avatar: 'https://picsum.photos/seed/chris/32/32' } },
      { id: 'task-5', title: 'Develop dashboard components', priority: 'Medium', tags: ['Frontend', 'React'], points: 13, assignee: { name: 'Taylor', avatar: 'https://picsum.photos/seed/taylor/32/32' } },
    ],
    done: [
      { id: 'task-6', title: 'Create project wireframes', priority: 'Low', tags: ['Design', 'UX'], points: 3, assignee: { name: 'Jordan', avatar: 'https://picsum.photos/seed/jordan/32/32' } },
      { id: 'task-7', title: 'Setup project repository', priority: 'Medium', tags: ['DevOps'], points: 2, assignee: { name: 'Alex', avatar: 'https://picsum.photos/seed/alex/32/32' } },
    ],
  };

