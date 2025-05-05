"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { AlignRight, Calendar, Save, ArrowRight } from "lucide-react";

const Usage = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeStep, setActiveStep] = useState(null);

  const steps = [
    {
      id: 1,
      title: "Upload your clothes",
      description:
        "Our smart bot will crop the background out and you tag the items by category or colors",
      image: "/upload.png",
      color: "bg-[#8b5cf6]",
      icon: AlignRight,
    },
    {
      id: 2,
      title: "Choose your style",
      description:
        "We can help you create your perfect outfit by getting your local weather and where you are going",
      image: "/find.png",
      color: "bg-[#0ea5e9]",
      icon: Calendar,
    },
    {
      id: 3,
      title: "Save your favorite",
      description:
        "StyleSync will purpose 3 outfits to choose from, which you will be able to save to your profile",
      image: "/choose.png",
      color: "bg-[#f59e0b]",
      icon: Save,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative pb-10 overflow-hidden"
    >
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            How it works
          </motion.h2>

          <motion.p
            className="max-w-2xl mx-auto text-lg text-foreground/70"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            StyleSync helps you create your perfect outfit, based on your
            clothes we are able to find your perfect outfit
          </motion.p>
        </div>

        {/* Cards grid with visible arrow connectors */}
        <div className="relative max-w-6xl mx-auto">
          {/* Steps row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-16 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{
                  duration: 0.8,
                  delay: 0.2 + index * 0.2,
                }}
                onHoverStart={() => setActiveStep(step.id)}
                onHoverEnd={() => setActiveStep(null)}
              >
                {/* Card */}
                <motion.div
                  className="bg-white dark:bg-card rounded-2xl overflow-hidden shadow-lg h-full border border-border"
                  whileHover={{
                    scale: 1.03,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                >
                  {/* Card top with image */}
                  <div
                    className={`h-48 md:h-52 relative overflow-hidden ${step.color}`}
                  >
                    {/* Icon in top left */}
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-lg">
                      <step.icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Main image centered */}
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="p-6 relative">
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>

                {/* Visible arrow for connected steps */}
                {index < steps.length - 1 && (
                  <div className="absolute top-1/2 -right-14 transform -translate-y-1/2 z-20 hidden md:flex items-center justify-center">
                    <div className="bg-white p-3 rounded-full shadow-md">
                      <ArrowRight className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                )}

                {/* Step number */}
                <motion.div
                  className={`absolute -bottom-4 -right-4 w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold text-white z-20 ${step.color}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                >
                  {step.id}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Usage;
