import request from "./request";

export interface Quest {
  _id: string;
  name: string;
  description: string;
  type: "daily" | "weekly" | "challenge";
  difficulty: "easy" | "medium" | "hard";
  xp_reward: number;
  completion_rate: number;
  active_users: number;
  duration: string;
}

export interface CreateQuestData {
  name: string;
  description: string;
  type: "daily" | "weekly" | "challenge";
  difficulty: "easy" | "medium" | "hard";
  xp_reward: number;
  duration: string;
}

export interface QuestStats {
  totalQuests: number;
  activeQuests: number;
  completionRate: number;
  averageXp: number;
}

export const getQuests = async (): Promise<Quest[]> => {
  const response = await request.get<Quest[]>("/quests");
  return response.data;
};

export const getQuestById = async (_id: string): Promise<Quest> => {
  const response = await request.get<Quest>(`/quests/${_id}`);
  return response.data;
};

export const createQuest = async (data: CreateQuestData): Promise<Quest> => {
  const response = await request.post<Quest>("/quests", data);
  return response.data;
};

export const updateQuest = async (
  _id: string,
  data: Partial<CreateQuestData>
): Promise<Quest> => {
  const response = await request.patch<Quest>(`/quests/${_id}`, data);
  return response.data;
};

export const deleteQuest = async (_id: string): Promise<void> => {
  await request.delete(`/quests/${_id}`);
};

export const getQuestStats = async (): Promise<QuestStats> => {
  const response = await request.get<QuestStats>("/quests/stats");
  return response.data;
};
