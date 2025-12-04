
'use client';

import { useEffect, useState, useCallback } from "react";

export type Doc = {
    id: string;
    title: string;
    description: string;
    content: string;
    spaceId: string | null;
    createdAt: string;
};

const initialDocs: Doc[] = [
    {
        id: 'doc-1',
        title: 'Project Phoenix Onboarding',
        description: 'A guide for new members joining the Project Phoenix space.',
        content: '# Welcome to Project Phoenix! \n\nThis document outlines the goals, roadmap, and key contacts for this initiative.',
        spaceId: 'website-redesign',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'doc-2',
        title: 'API Style Guide',
        description: 'Guidelines for designing and implementing APIs across the organization.',
        content: '# API Style Guide \n\nFollow these conventions to ensure consistency.',
        spaceId: null,
        createdAt: new Date().toISOString(),
    }
];

const getStoredDocs = (): Doc[] => {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem('docs');
        if (stored) {
            return JSON.parse(stored);
        }
        localStorage.setItem('docs', JSON.stringify(initialDocs));
        return initialDocs;
    } catch (error) {
        console.error("Failed to parse docs from localStorage", error);
        return initialDocs;
    }
};

const setStoredDocs = (docs: Doc[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('docs', JSON.stringify(docs));
    }
};

export const useDocs = () => {
    const [docs, setDocs] = useState<Doc[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setDocs(getStoredDocs());
        setIsLoading(false);
    }, []);

    const addDoc = (doc: Omit<Doc, 'id' | 'createdAt'>) => {
        const newDoc: Doc = {
            ...doc,
            id: `doc-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        const updatedDocs = [newDoc, ...docs];
        setDocs(updatedDocs);
        setStoredDocs(updatedDocs);
        return newDoc;
    };

    const getDocById = useCallback((id: string) => {
        return docs.find(doc => doc.id === id);
    }, [docs]);

    const updateDoc = (id: string, updates: Partial<Omit<Doc, 'id' | 'createdAt'>>) => {
        const updatedDocs = docs.map(doc =>
            doc.id === id ? { ...doc, ...updates } : doc
        );
        setDocs(updatedDocs);
        setStoredDocs(updatedDocs);
    };

    const deleteDoc = (id: string) => {
        const updatedDocs = docs.filter(doc => doc.id !== id);
        setDocs(updatedDocs);
        setStoredDocs(updatedDocs);
    };

    return { docs, isLoading, addDoc, getDocById, updateDoc, deleteDoc };
};
