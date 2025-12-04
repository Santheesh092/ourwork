
'use client';

import { useEffect, useState, useCallback } from "react";
import { useUsers } from './chat-data';

export type Squad = {
    id: string;
    name: string;
    description: string;
    members: { name: string; avatar: string; role: string; }[];
};

const initialSquads: Squad[] = [
    {
      id: 'alpha-squad',
      name: 'Alpha Squad',
      description: 'Focused on core product features and backend infrastructure.',
      members: [
        { name: 'Alex', avatar: 'https://picsum.photos/seed/alex/32/32', role: 'Team Lead' },
        { name: 'Sam', avatar: 'https://picsum.photos/seed/sam/32/32', role: 'Backend Engineer' },
        { name: 'Jordan', avatar: 'https://picsum.photos/seed/jordan/32/32', role: 'Frontend Engineer' },
        { name: 'Chris', avatar: 'https://picsum.photos/seed/chris/32/32', role: 'QA Engineer' },
        { name: 'Taylor', avatar: 'https://picsum.photos/seed/taylor/32/32', role: 'DevOps' },
      ],
    },
    {
      id: 'bravo-squad',
      name: 'Bravo Squad',
      description: 'Dedicated to mobile app development and new platform integrations.',
      members: [
        { name: 'Olivia', avatar: 'https://picsum.photos/seed/olivia/32/32', role: 'Team Lead' },
        { name: 'Jackson', avatar: 'https://picsum.photos/seed/jackson/32/32', role: 'iOS Developer' },
        { name: 'Isabella', avatar: 'https://picsum.photos/seed/isabella/32/32', role: 'Android Developer' },
        { name: 'William', avatar: 'https://picsum.photos/seed/william/32/32', role: 'Backend Engineer' },
      ],
    },
    {
      id: 'charlie-squad',
      name: 'Charlie Squad',
      description: 'Growth team focused on marketing, analytics, and user acquisition.',
      members: [
        { name: 'Emma', avatar: 'https://picsum.photos/seed/emma/32/32', role: 'Growth Lead' },
        { name: 'Liam', avatar: 'https://picsum.photos/seed/liam/32/32', role: 'Marketing Specialist' },
        { name: 'Ava', avatar: 'https://picsum.photos/seed/ava/32/32', role: 'Data Analyst' },
        { name: 'Noah', avatar: 'https://picsum.photos/seed/noah/32/32', role: 'UI/UX Designer' },
        { name: 'Sophia', avatar: 'https://picsum.photos/seed/sophia/32/32', role: 'Content Strategist' },
        { name: 'Mason', avatar: 'https://picsum.photos/seed/mason/32/32', role: 'SEO Expert' },
      ],
    },
];

const getStoredSquads = (): Squad[] => {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem('squads');
        if (stored) {
            return JSON.parse(stored);
        }
        // If no squads in storage, initialize with default
        localStorage.setItem('squads', JSON.stringify(initialSquads));
        return initialSquads;
    } catch (error) {
        console.error("Failed to parse squads from localStorage", error);
        return initialSquads;
    }
};

const setStoredSquads = (squads: Squad[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('squads', JSON.stringify(squads));
    }
};


export const useSquads = () => {
    const [squads, setSquads] = useState<Squad[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { users, addUser } = useUsers();

    useEffect(() => {
        setSquads(getStoredSquads());
        setIsLoading(false);
    }, []);

    const addSquad = (squad: Omit<Squad, 'id'>) => {
        const newSquad: Squad = {
            ...squad,
            id: squad.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        };
        const updatedSquads = [...squads, newSquad];
        setSquads(updatedSquads);
        setStoredSquads(updatedSquads);
        return newSquad;
    };
    
    const getSquadById = useCallback((id: string) => {
        return squads.find(squad => squad.id === id);
    }, [squads]);

    const updateSquad = (id: string, updates: Partial<Omit<Squad, 'id'>>) => {
        const updatedSquads = squads.map(squad =>
            squad.id === id ? { ...squad, ...updates } : squad
        );
        setSquads(updatedSquads);
        setStoredSquads(updatedSquads);
    };

    const deleteSquad = (id: string) => {
        const updatedSquads = squads.filter(squad => squad.id !== id);
        setSquads(updatedSquads);
        setStoredSquads(updatedSquads);
    };

    return { squads, isLoading, addSquad, getSquadById, updateSquad, deleteSquad, allUsers: users, addUser };
}
