
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  MessageSquare,
  Video,
  Github,
  Settings,
  LogOut,
  Shapes,
  FileText,
  Voicemail,
} from "lucide-react";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/spaces", label: "Spaces", icon: KanbanSquare },
  { href: "/squads", label: "Squads", icon: Users },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/meetings", label: "Meetings", icon: Video },
  { href: "/docs", label: "Documents", icon: FileText },
  { href: "/video-notes", label: "Video Notes", icon: Voicemail },
  { href: "/repository", label: "Repository", icon: Github },
];

export function AppSidebarContent() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push('/');
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shapes className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-headline text-xl font-bold text-sidebar-foreground">
              ourwork.space
            </h1>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
             <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                as={Link}
                href={item.href}
                isActive={isActive(item.href)}
                tooltip={item.label}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <SidebarMenu className="p-2">
             <SidebarMenuItem>
                <SidebarMenuButton as={Link} href="/settings" isActive={pathname === "/settings"} tooltip="Settings">
                    <Settings /><span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                    <LogOut /><span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        <Separator className="my-1" />
        <div className="flex items-center gap-3 p-2">
            <Avatar>
                <AvatarImage data-ai-hint="person portrait" src="https://picsum.photos/seed/user/40/40" alt="User" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-medium text-sidebar-foreground">John Doe</span>
                <span className="truncate text-xs text-sidebar-foreground/70">john.doe@example.com</span>
            </div>
        </div>
      </SidebarFooter>
    </>
  );
}
