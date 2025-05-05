"use client";

import React, { useState } from "react";
import Image from "next/image";
import LogInBtn from "./LogInBtn";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { IoShirt } from "react-icons/io5";

const Hero = () => {
  // Interactive state
  const [hoveredCard, setHoveredCard] = useState(null);
  const { resolvedTheme } = useTheme();
  const { data: session } = useSession();

  // Style cards - key features
  const styleCards = [
    {
      id: 1,
      title: "Modern",
      color: "from-purple-400 to-pink-500",
      icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
    {
      id: 2,
      title: "Casual",
      color: "from-yellow-400 to-orange-500",
      icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      id: 3,
      title: "Formal",
      color: "from-blue-400 to-indigo-500",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    },
  ];

  return (
    <section className="min-h-screen bg-background text-foreground flex flex-col justify-center relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(#00000033_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff33_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>

      {/* Orb background */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl"></div>

      <div className="container mx-auto px-6 pb-16 relative z-10">
        {/* Split layout - changes direction on mobile/desktop */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          {/* Left side - Image and interactive card stack */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-[500px] w-full max-w-lg mx-auto">
              {/* Main content - Stacked cards effect */}
              <div className="relative h-full w-full">
                {/* Base image */}
                <motion.div
                  className="absolute inset-0 rounded-2xl overflow-hidden border border-border shadow-2xl"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "perspective(1000px)",
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Image
                    src={
                      resolvedTheme === "dark"
                        ? "/hero-dark.png"
                        : "/hero-light.png"
                    }
                    alt="Style Preview"
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>

                  {/* Bottom caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-sm font-medium text-foreground/80">
                      Your style journey begins here
                    </p>
                    <h3 className="text-xl font-bold text-foreground">
                      Personal Style AI
                    </h3>
                  </div>
                </motion.div>

                {/* Style cards - stack effect */}
                {styleCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    className={`absolute top-0 left-0 bg-gradient-to-br ${card.color} p-5 rounded-xl w-32 border border-white/20 backdrop-blur-sm`}
                    style={{
                      x: 40 + index * 20,
                      y: 40 + index * 20,
                      zIndex: hoveredCard === card.id ? 10 : index,
                      transformStyle: "preserve-3d",
                      boxShadow: "0 10px 30px -15px rgba(0,0,0,0.3)",
                    }}
                    animate={{
                      scale: hoveredCard === card.id ? 1.1 : 1,
                      rotate:
                        hoveredCard === card.id ? 0 : index % 2 === 0 ? -5 : 5,
                    }}
                    transition={{ duration: 0.3 }}
                    onMouseEnter={() => setHoveredCard(card.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    whileHover={{ y: index * 20 }}
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div className="bg-white/20 p-2 rounded-lg w-10 h-10 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={card.icon}
                          />
                        </svg>
                      </div>
                      <h3 className="text-white font-bold mt-3">
                        {card.title}
                      </h3>
                    </div>
                  </motion.div>
                ))}

                {/* Stats indicator */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -bottom-5 -right-5 overflow-hidden bg-card/80 text-card-foreground p-3 rounded-xl shadow-xl border border-primary/20 backdrop-blur-md"
                  whileHover={{
                    scale: 1.05,
                    rotate: 2,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                >
                  <div className="flex items-center gap-2">
                    {/* Avatar stack */}
                    <div className="flex -space-x-2 mr-1">
                      {["bg-blue-500", "bg-green-500", "bg-yellow-500"].map(
                        (color, i) => (
                          <motion.div
                            key={i}
                            className={`w-6 h-6 rounded-full border-2 border-background ${color} flex items-center justify-center text-[8px] text-white font-bold`}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.8 + i * 0.1 }}
                          >
                            {String.fromCharCode(65 + i)}
                          </motion.div>
                        )
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <motion.span
                          className="font-bold text-xl"
                          initial={{ y: 20 }}
                          animate={{ y: 0 }}
                          transition={{ delay: 0.7, type: "spring" }}
                        >
                          10k+
                        </motion.span>
                        <motion.div
                          className="h-2 w-2 rounded-full bg-green-500"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut",
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <motion.span
                          className="text-xs text-foreground/80"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.9 }}
                        >
                          Active users
                        </motion.span>
                        <motion.div
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 }}
                        >
                          <svg
                            className="w-3 h-3 text-primary"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            className="w-full lg:w-1/2 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Eye-catching tag */}
            <motion.div
              className="inline-flex items-center px-5 py-2 rounded-full bg-muted border border-border shadow-sm mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="mr-3 flex items-center justify-center h-6 w-6 rounded-full bg-secondary">
                <IoShirt className="w-4 h-4 text-primary" />
              </div>
              <span className="text-foreground font-medium text-sm flex items-center">
                AI-Powered Fashion
              </span>
            </motion.div>

            {/* Main heading with highlight effect */}
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <div className="mb-2 text-foreground">Redefine Your</div>
              <div className="relative">
                <span className="text-[#6b46c1] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-primary dark:via-purple-500 dark:to-secondary">
                  Personal Style
                </span>
              </div>
            </h1>

            {/* Description with highlight */}
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              Discover your unique style identity with our{" "}
              <span className="text-foreground font-medium">
                AI-powered style assistant
              </span>
              . Get personalized recommendations and transform your wardrobe.
            </p>

            {session ? (
              <div className="mb-5 flex w-[75%] justify-center items-center">
                <Button className="" onClick={() => router.push("/clothes")}>
                  Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start mb-5">
                <LogInBtn />
              </div>
            )}

            {/* Feature bullets with trusted users */}
            <div className="flex text-center flex-col gap-6 max-w-lg">
              <div className="flex items-center justify-center gap-3 font-bold">
                <div>Trusted by 1400+ happy users</div>
                <div className="flex text-yellow-400">
                  <span>★★★★★</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {[
                  {
                    title: "Smart Analysis",
                    desc: "AI learns your preferences",
                  },
                  {
                    title: "Instant Matches",
                    desc: "Get perfect combinations",
                  },
                  {
                    title: "Style Evolution",
                    desc: "Adapt to changing trends",
                  },
                  { title: "Virtual Tryouts", desc: "Preview before you buy" },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-primary/10 flex-shrink-0 flex items-center justify-center mt-1">
                      <svg
                        className="w-3 h-3 text-primary"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
