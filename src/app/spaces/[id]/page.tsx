
'use client';

import { useParams, redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function SpaceDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    redirect(`/spaces/${id}/board`);
  }, [id]);

  return null; // Render nothing while redirecting
}
