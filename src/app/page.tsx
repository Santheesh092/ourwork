
"use client";

import { Button } from "@/components/ui/button";
import { Shapes } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem("isLoggedIn")) {
            router.push('/dashboard');
        }
    }, [router]);

  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-gray-950 text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-4 md:px-6 bg-background/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Shapes className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="font-headline text-xl font-bold">ourwork.space</h1>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-24 pb-12">
        <div className="relative isolate">
             <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
                <div
                style={{
                    clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#6366f1] to-[#A78BFA] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                />
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                The Workspace for Distributed Teams
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
                ourwork.space replaces meetings and scattered tools with intelligent Spaces where your team can build, collaborate, and ship faster.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg" asChild>
                    <Link href="/signup">Get Started</Link>
                </Button>
            </div>
        </div>
      </main>
    </div>
  );
}
