"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Trophy,
  ArrowRight,
  Users,
  Award,
  Target,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const features = [
  {
    icon: Users,
    title: "User Management",
    description: "Efficiently manage and track user progress and engagement",
  },
  {
    icon: Award,
    title: "Badge System",
    description: "Create and award badges to recognize user achievements",
  },
  {
    icon: Target,
    title: "Quest Creation",
    description: "Design engaging quests and challenges for your users",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Track performance and engagement with detailed analytics",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-signature" />
            <span className="text-lg font-bold">Gamified Admin</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <ModeToggle />
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-6 text-center py-12"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Welcome to{" "}
            <span className="bg-gradient-to-r from-signature to-signature-dark bg-clip-text text-transparent">
              Gamified
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-[600px] text-muted-foreground md:text-xl"
          >
            Superadmin dashboard for managing quests, badges, and analytics.
            Transform user engagement through gamification.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-x-4"
          >
            <Link href="/login">
              <Button
                size="lg"
                className="bg-signature hover:bg-signature-dark group"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 py-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:border-signature hover:shadow-lg"
            >
              <div className="mb-4 rounded-lg bg-signature/10 p-3 w-fit">
                <feature.icon className="h-6 w-6 text-signature" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
              <div className="absolute inset-0 bg-gradient-to-t from-signature/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="rounded-lg border bg-card p-8 my-12"
        >
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl font-bold text-signature"
              >
                10K+
              </motion.div>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-4xl font-bold text-signature"
              >
                500+
              </motion.div>
              <p className="text-muted-foreground">Quests Created</p>
            </div>
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-4xl font-bold text-signature"
              >
                95%
              </motion.div>
              <p className="text-muted-foreground">User Satisfaction</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
