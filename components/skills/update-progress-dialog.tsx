"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, TrendingUp } from "lucide-react";
import { updateSkillProgress } from "@/services/skills.service";
import { useToast } from "@/components/ui/use-toast";
import { Skill } from "@/services/skills.service";

const formSchema = z.object({
  xp: z.coerce
    .number()
    .min(0, {
      message: "XP must be a positive number.",
    })
    .max(1000, {
      message: "XP cannot exceed 1000.",
    }),
});

interface UpdateProgressDialogProps {
  skill: Skill;
  onProgressUpdated?: () => void;
}

export function UpdateProgressDialog({
  skill,
  onProgressUpdated,
}: UpdateProgressDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      xp: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await updateSkillProgress(skill._id, values.xp);
      toast({
        title: result.levelUp ? "Level Up!" : "Progress Updated",
        description: result.levelUp
          ? `Congratulations! You've reached level ${result.newLevel} in ${skill.name}!`
          : `Added ${values.xp} XP to ${skill.name}`,
      });
      setOpen(false);
      form.reset();
      onProgressUpdated?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <TrendingUp className="mr-2 h-4 w-4" />
          Add XP
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Progress</DialogTitle>
          <DialogDescription>
            Add XP to track your progress in {skill.name}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Current Level</p>
                <p className="text-2xl font-bold">{skill.currentLevel}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Current XP</p>
                <p className="text-2xl font-bold">
                  {skill.xp}/{skill.nextLevelXp}
                </p>
              </div>
            </div>
            <FormField
              control={form.control}
              name="xp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>XP to Add</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter XP amount"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-signature hover:bg-signature-dark"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Add XP"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
