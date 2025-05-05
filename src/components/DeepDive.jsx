"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ImageView from "./ImageView";
import { ArrowRight } from "lucide-react";

const DeepDive = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background via-background/95 to-background"
    >
      {/* Background effects */}
      <div className="absolute inset-0 mix-blend-overlay opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf670,#ec489930,#3b82f670)] opacity-20"></div>
      </div>
      <div className="absolute right-0 top-0 w-72 h-72 bg-purple-500/10 rounded-full filter blur-[100px] -z-10"></div>
      <div className="absolute left-0 bottom-0 w-72 h-72 bg-blue-500/10 rounded-full filter blur-[100px] -z-10"></div>

      <div className="container relative mx-auto px-4 z-10">
        {/* Header with staggered text reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <div className="relative inline-block">
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 relative inline-block"
              initial={{ y: 20 }}
              animate={isInView ? { y: 0 } : { y: 20 }}
              transition={{
                duration: 0.7,
                ease: [0.33, 1, 0.68, 1],
              }}
            >
              Turn your clothes into your style
              {/* Animated underline */}
              <motion.div
                className="h-[6px] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 absolute -bottom-3 left-0 right-0 rounded-full"
                initial={{ scaleX: 0, originX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.3,
                  ease: [0.33, 1, 0.68, 1],
                }}
              />
            </motion.h2>
          </div>

          <motion.p
            className="text-lg md:text-xl text-foreground/70 mt-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            With StyleSync you can create various outfits, depending on your
            mood and weather. Or if you need fresh new ideas, StyleSync will
            always be in your sync.
          </motion.p>
        </motion.div>

        {/* Interactive ImageView component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
          }
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative perspective"
        >
          <ImageView />
        </motion.div>
      </div>
    </section>
  );
};

export default DeepDive;
