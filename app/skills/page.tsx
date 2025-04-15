"use client";

import { useEffect, useState } from "react";
import { Skill, getSkills } from "@/services/skills.service";
import { SkillProgress } from "@/components/skills/skill-progress";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getSkills();
        setSkills(data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Skills & Progress</h1>
        <Button
          onClick={() => router.push("/skills/new")}
          className="bg-signature hover:bg-signature-dark"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Skill
        </Button>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <div key="loading" className="text-center py-8">
            Loading skills...
          </div>
        ) : skills.length === 0 ? (
          <div key="empty" className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              You haven't added any skills yet.
            </p>
            <Button
              key="add-first-skill"
              onClick={() => router.push("/skills/new")}
              className="bg-signature hover:bg-signature-dark"
            >
              Add Your First Skill
            </Button>
          </div>
        ) : (
          skills
            .filter((skill) => skill._id)
            .map((skill) => (
              <SkillProgress key={`skill-${skill._id}`} skill={skill} />
            ))
        )}
      </div>
    </div>
  );
}
