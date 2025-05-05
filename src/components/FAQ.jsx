"use client";

import React, { useRef } from "react";
import FrequentlyAskedQuestions from "./FrequentlyAskedQuestions";
import { motion, useInView } from "framer-motion";

const FAQ = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative pb-20 pt-16 overflow-hidden bg-gradient-to-b from-background/80 via-muted/30 to-background/90"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500/5 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full filter blur-[100px]"></div>
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(60deg,transparent_80%,rgba(120,119,198,0.1))]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Frequently Asked{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              Questions
            </span>
          </motion.h2>

          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Everything you need to know about the product and billing
          </motion.p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="bg-card border border-border rounded-xl shadow-md p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
            {/* Card subtle highlight effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-50"></div>
            <div className="relative z-10">
              <FrequentlyAskedQuestions />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
