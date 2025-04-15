"use client";

import { useEffect, useState } from "react";
import request from "@/services/request";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, Award, Target, TrendingUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DashboardData {
  totalUsers: number;
  activeQuests: number;
  completionRate: number;
  badgesAwarded: number;
  weeklyStats: Array<{ name: string; value: number }>;
}

const initialData: DashboardData = {
  totalUsers: 0,
  activeQuests: 0,
  completionRate: 0,
  badgesAwarded: 0,
  weeklyStats: [
    { name: "Mon", value: 0 },
    { name: "Tue", value: 0 },
    { name: "Wed", value: 0 },
    { name: "Thu", value: 0 },
    { name: "Fri", value: 0 },
    { name: "Sat", value: 0 },
    { name: "Sun", value: 0 },
  ],
};

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  description: string;
}

function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [usersRes, questsRes, badgesRes, statsRes] = await Promise.all([
          request.get("/dashboard/users/stats"),
          request.get("/quests/stats"),
          request.get("/badges/stats"),
          request.get("/dashboard/weekly-stats"),
        ]);

        setData({
          totalUsers: usersRes.data.totalUsers,
          activeQuests: questsRes.data.activeQuests,
          completionRate: questsRes.data.completionRate,
          badgesAwarded: badgesRes.data.badgesAwarded,
          weeklyStats: statsRes.data.weeklyStats,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back to your admin dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={data.totalUsers}
          icon={Users}
          description="Total registered users"
        />
        <StatsCard
          title="Active Quests"
          value={data.activeQuests}
          icon={Target}
          description="Quests in progress"
        />
        <StatsCard
          title="Completion Rate"
          value={`${data.completionRate.toFixed(2)}%`}
          icon={TrendingUp}
          description="Average quest completion"
        />
        <StatsCard
          title="Badges Awarded"
          value={data.badgesAwarded}
          icon={Award}
          description="Total badges earned"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.weeklyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(160, 60%, 48%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quest Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div>Daily Quests</div>
                  <div>85%</div>
                </div>
                <Progress value={85} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div>Weekly Challenges</div>
                  <div>62%</div>
                </div>
                <Progress value={62} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div>Monthly Goals</div>
                  <div>78%</div>
                </div>
                <Progress value={78} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
