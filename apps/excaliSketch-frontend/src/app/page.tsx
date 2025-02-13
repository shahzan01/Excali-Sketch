"use client";

import { Button } from "@repo/ui/button";
import {
  ArrowRight,
  Pen,
  Share2,
  Users2,
  Layers,
  Cloud,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navbar Section */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-black dark:text-white">
              ExcaliSketch
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/auth/sign-in">
              <Button variant="ghost" className="text-black dark:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button variant="ghost" className="text-black dark:text-white">
                Sign Up
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-indigo-100 opacity-70" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div
            className="text-center transform transition-all duration-1000 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Collaborative <span className="gradient-text">Whiteboarding</span>{" "}
              Reimagined
            </h1>
            <p className="mt-3 max-w-md mx-auto text-xl text-muted-foreground sm:text-2xl md:mt-5 md:max-w-3xl">
              Create, collaborate, and share beautiful diagrams and sketches
              with our intuitive drawing tool.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 animate-pulse-shadow"
                >
                  Start Drawing <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="hover:scale-105 transition-all duration-300"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold gradient-text">
              Everything you need to create
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Powerful features to bring your ideas to life
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-6 bg-background rounded-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border hover:border-blue-300"
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&it-fit=crop&q=80')] opacity-10 dark:opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0">
              {/* Apply text colors directly on the heading */}
              <h2 className="text-4xl font-bold mb-4 text-white dark:text-gray-200">
                Ready to get started?
              </h2>
              {/* The paragraph now properly uses its dark variant */}
              <p className="text-lg text-blue-100 dark:text-blue-200">
                Join thousands of users creating amazing diagrams.
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="hover:scale-105 transition-transform duration-300"
              >
                Try for Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className=" border-white hover:bg-white/10 hover:scale-105 transition-transform duration-300"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Real-time Collaboration",
    description:
      "Work together with your team in real-time, seeing changes instantly as they happen.",
    icon: <Users2 className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Intuitive Drawing Tools",
    description:
      "Easy-to-use tools for creating professional diagrams and sketches.",
    icon: <Pen className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Easy Sharing",
    description:
      "Share your work with a simple link or export in multiple formats.",
    icon: <Share2 className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Multiple Layers",
    description:
      "Organize your drawings with layers for complex diagrams and presentations.",
    icon: <Layers className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Cloud Storage",
    description:
      "Your drawings are automatically saved and synced across devices.",
    icon: <Cloud className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Smart Features",
    description: "AI-powered tools to help you create better diagrams faster.",
    icon: <Sparkles className="w-6 h-6 text-blue-600" />,
  },
];
