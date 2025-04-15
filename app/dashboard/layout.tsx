"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Trophy,
  LayoutDashboard,
  Users,
  Award,
  Target,
  BarChart3,
  Settings,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { ProfileButton } from "@/components/profile-button";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { checkServerStatus } from "@/lib/serverStatus";
import ServerOffline from "@/components/ServerOffline";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Users, label: "Users", href: "/dashboard/users" },
  { icon: Award, label: "Badges", href: "/dashboard/badges" },
  { icon: Target, label: "Quests", href: "/dashboard/quests" },
  { icon: GraduationCap, label: "Skills", href: "/dashboard/skills" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isServerOnline, setIsServerOnline] = useState(true);

  const checkServer = async () => {
    // Use true for showToast parameter when manually retrying,
    // but false on initial load to avoid showing error when navigating
    const isRetry = !isLoading;
    const isOnline = await checkServerStatus(isRetry);
    setIsServerOnline(isOnline);
  };

  useEffect(() => {
    // Check server status on initial load
    checkServer();
  }, []);

  useEffect(() => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem("token");

    // Only redirect if we're not authenticated and not already on the login page
    if (!isAuthenticated && !token && pathname !== "/login") {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, pathname, router]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isServerOnline) {
    return <ServerOffline onRetry={checkServer} />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 transform border-r bg-card transition-transform duration-200 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Trophy className="h-6 w-6 text-signature" />
          <span className="text-lg font-bold">Gamified </span>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-signature text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          "min-h-screen transition-all duration-200 ease-in-out",
          isSidebarOpen ? "pl-64" : "pl-0"
        )}
      >
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          <div className="ml-auto flex items-center gap-4">
            <ModeToggle />
            <ProfileButton />
          </div>
        </header>
        <main className="container mx-auto p-6">{children}</main>
      </div>
    </div>
  );
}
