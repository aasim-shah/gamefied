import request from "./request";

export interface DailyReflection {
  id: string;
  userId: string;
  date: string;
  mood: "very_happy" | "happy" | "neutral" | "sad" | "very_sad";
  energyLevel: number; // 1-5
  productivityScore: number; // 1-10
  achievements: string[];
  challenges: string[];
  lessonsLearned: string[];
  goalsForTomorrow: string[];
  gratitudeList: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReflectionData {
  mood: DailyReflection["mood"];
  energyLevel: number;
  productivityScore: number;
  achievements: string[];
  challenges: string[];
  lessonsLearned: string[];
  goalsForTomorrow: string[];
  gratitudeList: string[];
}

export interface ReflectionStats {
  averageMood: number;
  averageProductivity: number;
  commonChallenges: string[];
  achievementStreak: number;
  reflectionCount: number;
}

export const getDailyReflection = async (
  date: string
): Promise<DailyReflection> => {
  const response = await request.get<DailyReflection>(
    `/reflections/daily/${date}`
  );
  return response.data;
};

export const createDailyReflection = async (
  data: CreateReflectionData
): Promise<DailyReflection> => {
  const response = await request.post<DailyReflection>("/reflections", data);
  return response.data;
};

export const updateDailyReflection = async (
  id: string,
  data: Partial<CreateReflectionData>
): Promise<DailyReflection> => {
  const response = await request.patch<DailyReflection>(
    `/reflections/${id}`,
    data
  );
  return response.data;
};

export const getReflectionStats = async (): Promise<ReflectionStats> => {
  const response = await request.get<ReflectionStats>("/reflections/stats");
  return response.data;
};

export const getReflectionHistory = async (
  startDate: string,
  endDate: string
): Promise<DailyReflection[]> => {
  const response = await request.get<DailyReflection[]>(
    `/reflections/history?startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};
