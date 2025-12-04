
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shapes } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";


export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    
    useEffect(() => {
        if (localStorage.getItem("isLoggedIn")) {
        router.push('/dashboard');
        }
    }, [router]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would call your backend API here.
        // For now, we'll simulate a successful signup.
        console.log('Signing up with:', { username, email, password });
        localStorage.setItem("isLoggedIn", "true");
        router.push('/dashboard');
    };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Shapes className="h-6 w-6 text-primary-foreground" />
            </div>
        </div>
        <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
        <CardDescription>Enter your details to get started with ourwork.space</CardDescription>
      </CardHeader>
      <form onSubmit={handleSignup}>
        <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" placeholder="your_username" required value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit">
                Create Account
            </Button>
            <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                    Log in
                </Link>
            </div>
        </CardFooter>
      </form>
    </Card>
  );
}
