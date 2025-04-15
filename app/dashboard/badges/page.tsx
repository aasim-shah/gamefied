"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Users, ArrowUpRight } from "lucide-react";
import { AddBadgeDialog } from "./components/add-badge-dialog";
import useApi from "@/hooks/useApi";
import {
  getBadges,
  createBadge,
  Badge as BadgeType,
} from "@/services/badges.service";

export default function BadgesPage() {
  // usestate for badges
  const [badges, setBadges] = useState<BadgeType[]>([]);

  const {
    data,
    loading,
    error,
    execute: fetchBadges,
  } = useApi<BadgeType[]>(getBadges);

  // useefftect to fetch badge
  useEffect(() => {
    fetchBadges();
  }, []);

  useEffect(() => {
    if (data) {
      setBadges(data);
    }
  }, [data]);

  const handleBadgeCreated = async (
    newBadge: Omit<BadgeType, "id" | "total_awarded">
  ) => {
    try {
      const createdBadge = await createBadge(newBadge);
      fetchBadges(); // Refresh the list
    } catch (error) {
      console.error("Error creating badge:", error);
    }
  };

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
          <h1 className="text-3xl font-bold">Badges</h1>
          <p className="text-muted-foreground">
            Manage and create achievement badges.
          </p>
        </div>
        <AddBadgeDialog onBadgeCreated={handleBadgeCreated} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {badges?.map((badge, ind) => (
          <Card key={ind} className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{badge.icon}</span>
                {badge.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {badge.description}
              </p>
              <div className="space-y-4">
                <div
                  key={`criteria-${badge.id}`}
                  className="flex items-center gap-2"
                >
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{badge.criteria}</span>
                </div>
                <div
                  key={`awarded-${badge.id}`}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{badge.total_awarded} awarded</span>
                </div>
                <Badge
                  key={`rarity-${badge.id}`}
                  variant="secondary"
                  className="capitalize"
                >
                  {badge.rarity}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
