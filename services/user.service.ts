import request from "./request";

export interface User {
  _id: string;
  name: string;
  email: string;
  level: number;
  quests_completed: number;
  badges: string[];
  joined_date: string;
  status: string;
}

export const getUsers = async (): Promise<User[]> => {
  const response = await request.get<User[]>("/dashboard/users");
  return response.data;
};
