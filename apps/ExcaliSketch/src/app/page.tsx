"use client";

import { Link as ScrollLink } from "react-scroll";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Video from "../components/videoComponent";
import { Button } from "@repo/ui/button";
import {
  ArrowRight,
  Pen,
  Share2,
  Users2,
  Layers,
  Cloud,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import HeroBackground from "@/components/hero-background";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollY, setScrollY] = useState(0);

  // Refs for sections
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  // Handle scroll to determine active section and scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollY(scrollPosition);

      const viewPosition = scrollPosition + window.innerHeight / 3;

      if (
        heroRef.current &&
        viewPosition < heroRef.current.offsetTop + heroRef.current.offsetHeight
      ) {
        setActiveSection("hero");
      } else if (
        videoRef.current &&
        viewPosition <
          videoRef.current.offsetTop + videoRef.current.offsetHeight
      ) {
        setActiveSection("video");
      } else if (
        featuresRef.current &&
        viewPosition <
          featuresRef.current.offsetTop + featuresRef.current.offsetHeight
      ) {
        setActiveSection("features");
      } else if (ctaRef.current) {
        setActiveSection("cta");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initial animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Check if we're on mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Navbar items with animations
  const navItems = [
    { name: "Home", href: "home" },
    { name: "Demo", href: "video" },
    { name: "Features", href: "features" },
    { name: "About", href: "about" },
  ];

  const navVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, delay: 0.1 * index + 0.3 },
    }),
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Enhanced Navbar Section */}
      <motion.header
        className="fixed top-0 w-full z-50 backdrop-blur-md"
        initial={{ y: -100 }}
        animate={{
          y: 0,
          backgroundColor:
            scrollY > 50 ? "rgba(255, 255, 255, 0)" : "rgba(255, 255, 255, 0)",
          boxShadow: scrollY > 50 ? "0 4px 20px rgba(0, 0, 0, 0.1)" : "none",
        }}
        transition={{
          duration: 0.4,
          backgroundColor: { type: "spring", stiffness: 100, damping: 15 },
          boxShadow: { type: "spring", stiffness: 100, damping: 15 },
        }}
      >
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <motion.span
                  className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 opacity-70 blur-lg"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                    rotate: [0, 5, 0],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                />
                <motion.span className="relative text-xl font-bold text-black dark:text-white bg-white dark:bg-gray-800 px-3 py-1 rounded-lg">
                  ExcaliSketch
                </motion.span>
              </motion.div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <motion.div
                className="flex space-x-1 mr-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index + 0.3 }}
                    className="relative"
                  >
                    <ScrollLink
                      to={item.href}
                      smooth={true}
                      duration={400}
                      style={{ cursor: "pointer" }}
                    >
                      <motion.div
                        className="px-4 py-2 text-gray-700 dark:text-gray-200 font-medium rounded-md relative overflow-hidden group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.span
                          className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                          initial={{ scaleX: 0, opacity: 0 }}
                          whileHover={{ scaleX: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                        <motion.span
                          className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-500/10 rounded-md opacity-0"
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                        <span className="relative z-10">{item.name}</span>
                      </motion.div>
                    </ScrollLink>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Link href="/auth/sign-in">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      className="text-black dark:text-white hover:text-blue-400 relative overflow-hidden group"
                    >
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-md opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <span className="relative z-10">Sign In</span>
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/auth/sign-up">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <motion.span
                      className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-md opacity-75 blur-sm"
                      animate={{
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                    <Button className="relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
                      Sign Up
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.div
              className="md:hidden flex items-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                className="ml-2 p-2 rounded-full bg-gray-100 dark:bg-gray-800"
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-md"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ScrollLink
                      smooth={true}
                      duration={400}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-black dark:text-white hover:text-blue-400"
                      >
                        {item.name}
                      </Button>
                    </ScrollLink>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                >
                  <Link
                    href="/auth/sign-in"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-black dark:text-white hover:text-blue-400"
                    >
                      Sign In
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navItems.length + 1) * 0.1 }}
                >
                  <Link
                    href="/auth/sign-up"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Enhanced Hero Section */}
      <motion.section
        id="home"
        ref={heroRef}
        className="relative min-h-screen flex justify-center items-center pt-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Interactive 3D Hero Background */}
        <HeroBackground />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: isVisible ? 1 : 0,
              y: isVisible ? 0 : 50,
            }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              className="inline-block mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.5,
              }}
            >
              <motion.div
                className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-600 dark:text-blue-400 text-sm font-medium border border-blue-200 dark:border-blue-800"
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(59, 130, 246, 0)",
                    "0 0 20px rgba(59, 130, 246, 0.5)",
                    "0 0 0 rgba(59, 130, 246, 0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                ✨ Collaborative Drawing Made Simple
              </motion.div>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.span className="inline-block">Collaborative </motion.span>
              <motion.span
                className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500"
                animate={{
                  backgroundPosition: ["0% center", "100% center", "0% center"],
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                Whiteboarding
              </motion.span>{" "}
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Reimagined
              </motion.span>
              {/* Decorative elements */}
              <motion.div
                className="absolute -top-10 -right-10 w-20 h-20 text-blue-500 opacity-20 hidden md:block"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill="currentColor"
                    d="M45.7,-52.2C59.9,-41.8,72.6,-28.6,76.3,-13.2C80,2.2,74.7,19.8,64.4,32.6C54.1,45.4,38.8,53.5,22.8,58.5C6.7,63.5,-10.1,65.4,-25.4,61.1C-40.7,56.8,-54.5,46.2,-62.3,32.2C-70.1,18.2,-71.8,0.8,-67.3,-14.3C-62.8,-29.4,-52.1,-42.3,-39.2,-52.8C-26.3,-63.3,-11.2,-71.5,2.4,-74.2C16,-76.9,31.5,-62.6,45.7,-52.2Z"
                    transform="translate(100 100)"
                  />
                </svg>
              </motion.div>
              <motion.div
                className="absolute -bottom-16 -left-10 w-16 h-16 text-purple-500 opacity-20 hidden md:block"
                animate={{
                  rotate: [0, -360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 15,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill="currentColor"
                    d="M47.7,-57.2C59.5,-45.7,65.8,-28.4,68.8,-10.8C71.8,6.8,71.6,24.9,63.1,38.1C54.6,51.4,37.9,59.8,20.4,65.2C2.9,70.7,-15.4,73.1,-32.9,68.3C-50.5,63.4,-67.3,51.2,-74.2,34.9C-81.1,18.6,-78.2,-1.8,-70.8,-19.3C-63.4,-36.9,-51.5,-51.5,-37.4,-62.2C-23.3,-72.8,-6.9,-79.4,7.7,-78.1C22.3,-76.8,35.9,-68.6,47.7,-57.2Z"
                    transform="translate(100 100)"
                  />
                </svg>
              </motion.div>
            </motion.h1>

            <motion.p
              className="mt-3 max-w-md mx-auto text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Create, collaborate, and share beautiful diagrams and sketches
              with our intuitive drawing tool.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <Link href="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <Button
                    size="lg"
                    className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-lg"
                  >
                    <motion.span
                      className="absolute inset-0 bg-white/20 rounded-md"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                    <span className="relative z-10 flex items-center">
                      Start Drawing
                      <motion.span
                        className="ml-2"
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.span>
                    </span>
                  </Button>
                </motion.div>
              </Link>
              <ScrollLink to="video" smooth={true} duration={400}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-gray-300 hover:border-gray-600 dark:border-gray-600 dark:hover:border-gray-400 mt-4 sm:mt-0 relative overflow-hidden"
                    onClick={(e) => {
                      e.preventDefault();
                      videoRef.current?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-500/10"
                      initial={{ y: "-100%" }}
                      whileHover={{ y: "100%" }}
                      transition={{ duration: 0.4 }}
                    />
                    <span className="relative z-10">Watch Demo</span>
                  </Button>
                </motion.div>
              </ScrollLink>
            </motion.div>

            {/* Floating elements */}
            <div className="relative mt-16 h-32">
              {/* Square Animation */}
              <motion.div
                className="absolute left-1/4 -translate-x-1/2"
                animate={{
                  y: [0, -30, 0],
                  rotate: [0, 20, -20, 0],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              ></motion.div>

              {/* Diamond Animation */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2"
                animate={{
                  y: [0, -40, 0],
                  rotate: [0, -25, 25, 0],
                  scale: [1.1, 1, 1.1],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              ></motion.div>

              {/* Circle Animation */}
              <motion.div
                className="absolute left-3/4 -translate-x-1/2"
                animate={{
                  y: [0, -35, 0],
                  rotate: [0, 30, -30, 0],
                  scale: [1.2, 1, 1.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              ></motion.div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.div
            className="w-8 h-12 border-2 border-gray-600 dark:border-gray-400 rounded-full flex justify-center relative overflow-hidden"
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              className="w-1.5 h-3 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full absolute top-2"
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-purple-600/20 opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
          <motion.p
            className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            Scroll to explore
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Rest of the sections remain the same */}
      <motion.section
        id="video"
        ref={videoRef}
        className="py-20 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50 dark:to-blue-950 opacity-50 z-0"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
        />

        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          initial={{ y: 50 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500"
              animate={{
                backgroundPosition: ["0% center", "100% center", "0% center"],
              }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
            >
              See ExcaliSketch in Action
            </motion.h2>
            <motion.p
              className="mt-4 text-lg text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Watch how easy it is to create and collaborate
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="rounded-xl overflow-hidden shadow-2xl"
          >
            <Video />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id={"features"}
        ref={featuresRef}
        className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 opacity-50"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500"
              animate={{
                backgroundPosition: ["0% center", "100% center", "0% center"],
              }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
            >
              Everything you need to create
            </motion.h2>
            <motion.p
              className="mt-4 text-lg text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Powerful features to bring your ideas to life
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative p-6 bg-white dark:bg-gray-800 rounded-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ scale: 1.03 }}
              >
                <motion.div
                  className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>

                {/* Decorative element */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-b-lg"
                  initial={{ width: "0%" }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        id="about"
        ref={ctaRef}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&it-fit=crop&q=80')] opacity-10 dark:opacity-20"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10"
          initial={{ y: 30 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div
              className="mb-8 md:mb-0"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4 text-white"
                animate={{
                  textShadow: [
                    "0 0 8px rgba(255,255,255,0.1)",
                    "0 0 16px rgba(255,255,255,0.2)",
                    "0 0 8px rgba(255,255,255,0.1)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                Ready to get started?
              </motion.h2>
              <motion.p
                className="text-lg text-blue-100 dark:text-blue-200"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Join thousands of users creating amazing diagrams.
              </motion.p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link
                href="https://www.linkedin.com/in/mohd-shahzan1/"
                target="_blank"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-white hover:bg-white/10 transition-all duration-300 text-white relative overflow-hidden group"
                  >
                    <motion.span
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                    Linkedin
                  </Button>
                </motion.div>
              </Link>
              <Link
                href="https://github.com/shahzan01/Excali-Sketch"
                target="_blank"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-white text-white hover:bg-white/10 transition-all duration-300 relative overflow-hidden group"
                  >
                    <motion.span
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                    Github
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Animated wave footer */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            className="relative block w-full h-[50px]"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            width="200px"
            height="200px"
          >
            <motion.path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#ffffff"
              fillOpacity="0.1"
              animate={{
                d: [
                  "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z",
                  "M321.39,80.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,55,906.67,96,985.66,116.83c70.05,18.48,146.53,26.09,214.34,3V0H0V51.35A600.21,600.21,0,0,0,321.39,80.44Z",
                  "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </svg>
        </div>
      </motion.section>
    </div>
  );
}

const features = [
  {
    title: "Real-time Collaboration",
    description:
      "Work together with your team in real-time, seeing changes instantly as they happen.",
    icon: <Users2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
  },
  {
    title: "Intuitive Drawing Tools",
    description:
      "Easy-to-use tools for creating professional diagrams and sketches.",
    icon: <Pen className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
  },
  {
    title: "Easy Sharing",
    description:
      "Share your work with a simple link or export in multiple formats.",
    icon: <Share2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
  },
  {
    title: "Multiple Layers",
    description:
      "Organize your drawings with layers for complex diagrams and presentations.",
    icon: <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
  },
  {
    title: "Cloud Storage",
    description:
      "Your drawings are automatically saved and synced across devices.",
    icon: <Cloud className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
  },
  {
    title: "Smart Features",
    description: "AI-powered tools to help you create better diagrams faster.",
    icon: <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
  },
];
