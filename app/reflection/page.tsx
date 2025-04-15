"use client";

import React from "react";
import DailyReflection from "../../components/DailyReflection";

const ReflectionPage = () => {
  const handleReflectionComplete = () => {
    // You can add any post-reflection actions here
    console.log("Reflection completed!");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Daily Reflection
        </h1>
        <DailyReflection onReflectionComplete={handleReflectionComplete} />
      </div>
    </div>
  );
};

export default ReflectionPage;
