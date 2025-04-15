import request from "./request";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  total_awarded: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface CreateBadgeData {
  name: string;
  description: string;
  icon: string;
  criteria: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface BadgeStats {
  totalBadges: number;
  badgesAwarded: number;
  distribution: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
}

export const getBadges = async (): Promise<Badge[]> => {
  const response = await request.get<Badge[]>("/badges");
  return response.data;
};

export const getBadgeById = async (id: string): Promise<Badge> => {
  const response = await request.get<Badge>(`/badges/${id}`);
  return response.data;
};

export const createBadge = async (data: CreateBadgeData): Promise<Badge> => {
  const response = await request.post<Badge>("/badges", data);
  return response.data;
};

export const updateBadge = async (
  id: string,
  data: Partial<CreateBadgeData>
): Promise<Badge> => {
  const response = await request.patch<Badge>(`/badges/${id}`, data);
  return response.data;
};

export const deleteBadge = async (id: string): Promise<void> => {
  await request.delete(`/badges/${id}`);
};

export const getBadgeStats = async (): Promise<BadgeStats> => {
  const response = await request.get<BadgeStats>("/badges/stats");
  return response.data;
};

export const awardBadge = async (
  userId: string,
  badgeId: string
): Promise<void> => {
  await request.post(`/badges/${badgeId}/award`, { userId });
};
