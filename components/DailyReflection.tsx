import React, { useState, useEffect } from "react";
import {
  DailyReflection,
  CreateReflectionData,
  createDailyReflection,
  getDailyReflection,
} from "../services/reflection.service";
import { format } from "date-fns";

interface DailyReflectionProps {
  onReflectionComplete?: () => void;
}

const DailyReflectionComponent: React.FC<DailyReflectionProps> = ({
  onReflectionComplete,
}) => {
  const [reflection, setReflection] = useState<CreateReflectionData>({
    mood: "neutral",
    energyLevel: 3,
    productivityScore: 5,
    achievements: [""],
    challenges: [""],
    lessonsLearned: [""],
    goalsForTomorrow: [""],
    gratitudeList: [""],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodayReflection = async () => {
      try {
        const today = format(new Date(), "yyyy-MM-dd");
        const existingReflection = await getDailyReflection(today);
        if (existingReflection) {
          setReflection({
            mood: existingReflection.mood,
            energyLevel: existingReflection.energyLevel,
            productivityScore: existingReflection.productivityScore,
            achievements: existingReflection.achievements,
            challenges: existingReflection.challenges,
            lessonsLearned: existingReflection.lessonsLearned,
            goalsForTomorrow: existingReflection.goalsForTomorrow,
            gratitudeList: existingReflection.gratitudeList,
          });
        }
      } catch (err) {
        console.error("Error fetching reflection:", err);
      }
    };

    fetchTodayReflection();
  }, []);

  const handleInputChange = (field: keyof CreateReflectionData, value: any) => {
    setReflection((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayInputChange = (
    field: keyof CreateReflectionData,
    index: number,
    value: string
  ) => {
    setReflection((prev) => {
      const newArray = [...(prev[field] as string[])];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: keyof CreateReflectionData) => {
    setReflection((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createDailyReflection(reflection);
      if (onReflectionComplete) {
        onReflectionComplete();
      }
    } catch (err) {
      setError("Failed to save reflection. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Daily Reflection</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How was your day?
          </label>
          <select
            value={reflection.mood}
            onChange={(e) => handleInputChange("mood", e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="very_happy">😊 Very Happy</option>
            <option value="happy">🙂 Happy</option>
            <option value="neutral">😐 Neutral</option>
            <option value="sad">😔 Sad</option>
            <option value="very_sad">😢 Very Sad</option>
          </select>
        </div>

        {/* Energy Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Energy Level (1-5)
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={reflection.energyLevel}
            onChange={(e) =>
              handleInputChange("energyLevel", parseInt(e.target.value))
            }
            className="w-full"
          />
        </div>

        {/* Productivity Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Productivity Score (1-10)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={reflection.productivityScore}
            onChange={(e) =>
              handleInputChange("productivityScore", parseInt(e.target.value))
            }
            className="w-full"
          />
        </div>

        {/* Achievements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Achievements
          </label>
          {reflection.achievements.map((achievement, index) => (
            <input
              key={`achievement-${index}`}
              type="text"
              value={achievement}
              onChange={(e) =>
                handleArrayInputChange("achievements", index, e.target.value)
              }
              className="w-full p-2 border rounded-md mb-2"
              placeholder="What did you accomplish today?"
            />
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("achievements")}
            className="text-blue-600 hover:text-blue-800"
          >
            + Add Achievement
          </button>
        </div>

        {/* Challenges */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Challenges
          </label>
          {reflection.challenges.map((challenge, index) => (
            <input
              key={`challenge-${index}`}
              type="text"
              value={challenge}
              onChange={(e) =>
                handleArrayInputChange("challenges", index, e.target.value)
              }
              className="w-full p-2 border rounded-md mb-2"
              placeholder="What challenges did you face?"
            />
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("challenges")}
            className="text-blue-600 hover:text-blue-800"
          >
            + Add Challenge
          </button>
        </div>

        {/* Lessons Learned */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lessons Learned
          </label>
          {reflection.lessonsLearned.map((lesson, index) => (
            <input
              key={`lesson-${index}`}
              type="text"
              value={lesson}
              onChange={(e) =>
                handleArrayInputChange("lessonsLearned", index, e.target.value)
              }
              className="w-full p-2 border rounded-md mb-2"
              placeholder="What did you learn today?"
            />
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("lessonsLearned")}
            className="text-blue-600 hover:text-blue-800"
          >
            + Add Lesson
          </button>
        </div>

        {/* Goals for Tomorrow */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Goals for Tomorrow
          </label>
          {reflection.goalsForTomorrow.map((goal, index) => (
            <input
              key={`goal-${index}`}
              type="text"
              value={goal}
              onChange={(e) =>
                handleArrayInputChange(
                  "goalsForTomorrow",
                  index,
                  e.target.value
                )
              }
              className="w-full p-2 border rounded-md mb-2"
              placeholder="What do you want to achieve tomorrow?"
            />
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("goalsForTomorrow")}
            className="text-blue-600 hover:text-blue-800"
          >
            + Add Goal
          </button>
        </div>

        {/* Gratitude List */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gratitude List
          </label>
          {reflection.gratitudeList.map((item, index) => (
            <input
              key={`gratitude-${index}`}
              type="text"
              value={item}
              onChange={(e) =>
                handleArrayInputChange("gratitudeList", index, e.target.value)
              }
              className="w-full p-2 border rounded-md mb-2"
              placeholder="What are you grateful for today?"
            />
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("gratitudeList")}
            className="text-blue-600 hover:text-blue-800"
          >
            + Add Gratitude Item
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isLoading ? "Saving..." : "Save Reflection"}
        </button>
      </form>
    </div>
  );
};

export default DailyReflectionComponent;
