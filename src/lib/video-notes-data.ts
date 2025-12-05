
'use client';

import { useEffect, useState, useCallback } from "react";

export type VideoNote = {
    id: string;
    title: string;
    description: string;
    content?: string; 
    spaceId: string | null;
    createdAt: string;
    videoUrl: string | null;
};

const initialVideoNotes: VideoNote[] = [
    {
        id: 'vn-1',
        title: 'Design Walkthrough for New Dashboard',
        description: 'A quick walkthrough of the latest Figma designs for the new user dashboard.',
        spaceId: 'website-redesign',
        createdAt: new Date().toISOString(),
        videoUrl: 'https://storage.googleapis.com/web-dev-assets/video-canvas-bjj.mp4',
    },
    {
        id: 'vn-2',
        title: 'Backend Refactor Plan',
        description: 'Explaining the proposed changes to the authentication service.',
        content: '# API Style Guide \n\nFollow these conventions to ensure consistency.',
        spaceId: 'api-integration',
        createdAt: new Date().toISOString(),
        videoUrl: 'https://storage.googleapis.com/web-dev-assets/video-canvas-bjj.mp4',
    }
];

const getStoredVideoNotes = (): VideoNote[] => {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem('videoNotes');
        if (stored) {
            return JSON.parse(stored);
        }
        localStorage.setItem('videoNotes', JSON.stringify(initialVideoNotes));
        return initialVideoNotes;
    } catch (error) {
        console.error("Failed to parse video notes from localStorage", error);
        return initialVideoNotes;
    }
};

const setStoredVideoNotes = (notes: VideoNote[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('videoNotes', JSON.stringify(notes));
    }
};

export const useVideoNotes = () => {
    const [videoNotes, setVideoNotes] = useState<VideoNote[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setVideoNotes(getStoredVideoNotes());
        setIsLoading(false);
    }, []);

    const addVideoNote = (note: Omit<VideoNote, 'id' | 'createdAt'>) => {
        const newNote: VideoNote = {
            ...note,
            id: `vn-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        const updatedNotes = [newNote, ...videoNotes];
        setVideoNotes(updatedNotes);
        setStoredVideoNotes(updatedNotes);
        return newNote;
    };

    const getVideoNoteById = useCallback((id: string) => {
        return videoNotes.find(note => note.id === id);
    }, [videoNotes]);

    const updateVideoNote = (id: string, updates: Partial<Omit<VideoNote, 'id' | 'createdAt'>>) => {
        const updatedNotes = videoNotes.map(note =>
            note.id === id ? { ...note, ...updates } : note
        );
        setVideoNotes(updatedNotes);
        setStoredVideoNotes(updatedNotes);
    };

    const deleteVideoNote = (id: string) => {
        const updatedNotes = videoNotes.filter(note => note.id !== id);
        setVideoNotes(updatedNotes);
        setStoredVideoNotes(updatedNotes);
    };

    return { videoNotes, isLoading, addVideoNote, getVideoNoteById, updateVideoNote, deleteVideoNote };
};
