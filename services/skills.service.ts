import request from "./request";

export interface Skill {
  _id: string;
  name: string;
  category: string;
  currentLevel: number;
  xp: number;
  nextLevelXp: number;
  progress: number;
  lastUpdated: Date;
}

export interface SkillProgress {
  skillId: string;
  xpGained: number;
  levelUp: boolean;
  newLevel?: number;
}

export interface SkillAnalytics {
  dailyProgress: {
    date: string;
    xpGained: number;
  }[];
  levelHistory: {
    date: string;
    level: number;
  }[];
  categoryDistribution: {
    category: string;
    count: number;
  }[];
}

export const getSkills = async (): Promise<Skill[]> => {
  const response = await request.get<Skill[]>("/skills");
  return response.data;
};

export const getSkillById = async (skillId: string): Promise<Skill> => {
  const response = await request.get<Skill>(`/skills/${skillId}`);
  return response.data;
};

export const updateSkillProgress = async (
  skillId: string,
  xp: number
): Promise<SkillProgress> => {
  const response = await request.post<SkillProgress>(
    `/skills/${skillId}/progress`,
    {
      xp,
    }
  );
  return response.data;
};

export const getSkillAnalytics = async (
  skillId: string
): Promise<SkillAnalytics> => {
  const response = await request.get<SkillAnalytics>(
    `/skills/${skillId}/analytics`
  );
  return response.data;
};

export const createSkill = async (
  skill: Omit<
    Skill,
    "_id" | "currentLevel" | "xp" | "nextLevelXp" | "progress" | "lastUpdated"
  >
): Promise<Skill> => {
  const response = await request.post<Skill>("/skills", skill);
  return response.data;
};

export const updateSkill = async (
  skillId: string,
  updates: Partial<Skill>
): Promise<Skill> => {
  const response = await request.patch<Skill>(`/skills/${skillId}`, updates);
  return response.data;
};

export const deleteSkill = async (skillId: string): Promise<void> => {
  await request.delete(`/skills/${skillId}`);
};
