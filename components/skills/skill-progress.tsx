import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Skill,
  SkillAnalytics,
  getSkillAnalytics,
} from "@/services/skills.service";
import { Trophy, TrendingUp, BarChart2 } from "lucide-react";

interface SkillProgressProps {
  skill: Skill;
}

export function SkillProgress({ skill }: SkillProgressProps) {
  const [analytics, setAnalytics] = useState<SkillAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getSkillAnalytics(skill._id);
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching skill analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [skill._id]);

  return (
    <div className="space-y-6">
      <Card key={`card-${skill._id}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy
              key={`trophy-${skill._id}`}
              className="h-5 w-5 text-signature"
            />
            {skill.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span
                  key={`level-${skill._id}`}
                  className="text-sm font-medium"
                >
                  Level {skill.currentLevel}
                </span>
                <span
                  key={`xp-${skill._id}`}
                  className="text-sm text-muted-foreground"
                >
                  {skill.xp} / {skill.nextLevelXp} XP
                </span>
              </div>
              <Progress
                key={`progress-${skill._id}`}
                value={skill.progress}
                className="h-2"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div
                key={`daily-progress-${skill._id}`}
                className="flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4 text-signature" />
                <div>
                  <p className="text-sm font-medium">Daily Progress</p>
                  <p className="text-2xl font-bold">
                    {analytics?.dailyProgress[
                      analytics.dailyProgress.length - 1
                    ]?.xpGained || 0}
                  </p>
                </div>
              </div>
              <div
                key={`category-${skill._id}`}
                className="flex items-center gap-2"
              >
                <BarChart2 className="h-4 w-4 text-signature" />
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-2xl font-bold">{skill.category}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isLoading && analytics && (
        <Card key={`analytics-card-${skill._id}`}>
          <CardHeader>
            <CardTitle>Progress History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.dailyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    key={`line-${skill._id}`}
                    type="monotone"
                    dataKey="xpGained"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
