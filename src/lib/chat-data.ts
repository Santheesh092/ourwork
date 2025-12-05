
'use client';
import { useSpaces } from './spaces-data';
import { useState, useEffect, useCallback } from 'react';

export const initialUsers = [
  { id: 'u1', name: 'Alice', avatar: 'https://picsum.photos/seed/alice/40/40', online: true },
  { id: 'u2', name: 'Bob', avatar: 'https://picsum.photos/seed/bob/40/40', online: false },
  { id: 'u3', name: 'Charlie', avatar: 'https://picsum.photos/seed/charlie/40/40', online: true },
  { id: 'u4', name: 'David', avatar: 'https://picsum.photos/seed/david/40/40', online: true },
  { id: 'u5', name: 'Eve', avatar: 'https://picsum.photos/seed/eve/40/40', online: false },
  { id: 'u6', name: 'Frank', avatar: 'https://picsum.photos/seed/frank/40/40', online: true },
  { name: 'Alex', avatar: 'https://picsum.photos/seed/alex/32/32', id: 'u7', role: 'Team Lead' },
  { name: 'Sam', avatar: 'https://picsum.photos/seed/sam/32/32', id: 'u8', role: 'Backend Engineer' },
  { name: 'Jordan', avatar: 'https://picsum.photos/seed/jordan/32/32', id: 'u9', role: 'Frontend Engineer' },
  { name: 'Chris', avatar: 'https://picsum.photos/seed/chris/32/32', id: 'u10', role: 'QA Engineer' },
  { name: 'Taylor', avatar: 'https://picsum.photos/seed/taylor/32/32', id: 'u11', role: 'DevOps' },
  { name: 'Olivia', avatar: 'https://picsum.photos/seed/olivia/32/32', id: 'u12', role: 'Team Lead' },
  { name: 'Jackson', avatar: 'https://picsum.photos/seed/jackson/32/32', id: 'u13', role: 'iOS Developer' },
  { name: 'Isabella', avatar: 'https://picsum.photos/seed/isabella/32/32', id: 'u14', role: 'Android Developer' },
  { name: 'William', avatar: 'https://picsum.photos/seed/william/32/32', id: 'u15', role: 'Backend Engineer' },
  { name: 'Sophia', avatar: 'https://picsum.photos/seed/sophia/32/32', id: 'u16', role: 'Content Strategist' },
  { name: 'Mason', avatar: 'https://picsum.photos/seed/mason/32/32', id: 'u17', role: 'SEO Expert' },
  { name: 'Ava', avatar: 'https://picsum.photos/seed/ava/32/32', id: 'u18', role: 'Data Analyst' },
  { name: 'Liam', avatar: 'https://picsum.photos/seed/liam/32/32', id: 'u19', role: 'Marketing Specialist' },
  { name: 'Noah', avatar: 'https://picsum.photos/seed/noah/32/32', id: 'u20', role: 'UI/UX Designer' },
];

// explicit User type to allow optional 'online' and 'role' together
export type User = {
    id: string;
    name: string;
    avatar: string;
    online?: boolean;
    role?: string;
};

const getStoredUsers = (): User[] => {
    if (typeof window === 'undefined') return initialUsers;
    try {
        const stored = localStorage.getItem('users');
        if (stored) {
            return JSON.parse(stored);
        }
        localStorage.setItem('users', JSON.stringify(initialUsers));
        return initialUsers;
    } catch (error) {
        console.error("Failed to parse users from localStorage", error);
        return initialUsers;
    }
};

const setStoredUsers = (users: User[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('users', JSON.stringify(users));
    }
};

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    
    useEffect(() => {
        setUsers(getStoredUsers());
    }, []);

    const addUser = (user: Omit<User, 'id' | 'online' | 'avatar'>): User => {
        const newUser: User = {
            ...user,
            id: `u-${Date.now()}`,
            avatar: `https://picsum.photos/seed/${user.name.toLowerCase()}/40/40`,
            online: true
        };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        setStoredUsers(updatedUsers);
        return newUser;
    };
    
    const findUserByName = useCallback((name: string) => {
        return users.find(user => user.name === name);
    }, [users]);

    return { users, addUser, findUserByName };
};


export const currentUser = getStoredUsers().find(u => u.id === 'u1');

export const useChatData = () => {
    const { spaces } = useSpaces();
    const { users } = useUsers();

    const spaceTeams = spaces.map(space => ({
        id: space.id,
        name: space.name,
        type: 'project' as const,
        description: space.description,
        owner: 'u1',
        members: space.members.map(member => {
            const user = users.find(u => u.name === member.name);
            return user || { ...member, id: `u-${member.name.toLowerCase()}`, role: "Member" };
        }),
        visibility: 'private' as const,
        icon: `https://picsum.photos/seed/${space.id}/40/40`,
        channels: [
            {
                id: `c-${space.id}-general`,
                teamId: space.id,
                type: 'channel' as const,
                name: 'General',
                messages: [
                     { id: `m-${space.id}-1`, userId: 'u2', text: `Welcome to the ${space.name} space!`, timestamp: '10:00 AM' },
                ]
            }
        ]
    }));

    const initialTeams = [
        ...spaceTeams,
        { id: 't2', name: 'Engineering', type: 'department', description: "Core engineering team", owner: 'u2', members: users.filter(u => ['u2', 'u4', 'u6'].includes(u.id)), visibility: 'private' as const, icon: 'https://picsum.photos/seed/eng/40/40', channels: [
            {
                id: 'c3',
                teamId: 't2',
                type: 'channel',
                name: 'Deployments',
                messages: [
                    { id: 'm8', userId: 'u4', text: 'Staging deployment is complete.', timestamp: 'Yesterday' },
                ],
            }
        ]},
        { id: 't3', name: 'Marketing', type: 'group', description: "Marketing and growth", owner: 'u3', members: users.filter(u => ['u3', 'u5'].includes(u.id)), visibility: 'public' as const, icon: 'https://picsum.photos/seed/market/40/40', channels: []},
    ];

    const initialDms = [
       {
        id: 'd1',
        type: 'dm',
        members: [users.find(u => u.id === 'u1'), users.find(u => u.id === 'u2')],
        messages: [
            { id: 'm9', userId: 'u1', text: 'Hey Bob, can we sync up later today?', timestamp: '9:00 AM' },
            { id: 'm10', userId: 'u2', text: 'Sure, how about 3pm?', timestamp: '9:05 AM' },
        ],
      },
      {
        id: 'd2',
        type: 'dm',
        members: [users.find(u => u.id === 'u1'), users.find(u => u.id === 'u4')],
        messages: [],
      }
    ];

    const allTeamMembersSet = new Map();
    initialTeams.forEach(team => {
        team.members.forEach(member => {
            if (member && !allTeamMembersSet.has(member.id)) {
                allTeamMembersSet.set(member.id, member);
            }
        })
    });
    initialDms.forEach(dm => {
        dm.members.forEach(member => {
            if (member && !allTeamMembersSet.has(member.id)) {
                allTeamMembersSet.set(member.id, member);
            }
        })
    })

    const allTeamMembers = Array.from(allTeamMembersSet.values());
    
    return { initialTeams, initialDms, allTeamMembers };
}

    