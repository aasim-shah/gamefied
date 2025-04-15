"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Clock, Users, ArrowUpRight } from "lucide-react";
import { AddQuestDialog } from "./components/AddQuestDialog";
import useApi from "@/hooks/useApi";
import { getQuests, Quest } from "@/services/quests.service";

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const {
    data,
    loading,
    error,
    execute: fetchQuests,
  } = useApi<Quest[]>(getQuests);

  const handleQuestCreated = async () => {
    await fetchQuests();
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  useEffect(() => {
    if (data) {
      setQuests(data);
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quests</h1>
          <p className="text-muted-foreground">
            Manage and create quest templates.
          </p>
        </div>
        <AddQuestDialog onQuestCreated={handleQuestCreated} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quests
          ?.filter((quest) => quest._id)
          .map((quest: Quest, index: number) => {
            return (
              <Card key={`quest-${index}`} className="relative overflow-hidden">
                <CardHeader>
                  <CardTitle>{quest.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {quest.description}
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge
                        key={`type-${index}`}
                        variant="outline"
                        className="capitalize"
                      >
                        {quest.type}
                      </Badge>
                      <Badge
                        key={`difficulty-${index}`}
                        variant="secondary"
                        className="capitalize"
                      >
                        {quest.difficulty}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Completion Rate</span>
                        <span>{quest.completion_rate}%</span>
                      </div>
                      <Progress value={quest.completion_rate} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div
                        key={`xp-${index}`}
                        className="flex items-center gap-2"
                      >
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span>{quest.xp_reward} XP</span>
                      </div>
                      <div
                        key={`duration-${index}`}
                        className="flex items-center gap-2"
                      >
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{quest.duration}</span>
                      </div>
                      <div
                        key={`users-${index}`}
                        className="flex items-center gap-2"
                      >
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{quest.active_users}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    key={`button-${index}`}
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
