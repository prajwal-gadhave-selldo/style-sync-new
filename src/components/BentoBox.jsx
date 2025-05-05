"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

const BentoBox = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const cards = [
    {
      id: 1,
      title: "Be part of our community",
      description: "Get suggestion from AI and discover your next look",
      image: "/community.png",
      color: "bg-[#60a5fa]",
      span: 1,
    },
    {
      id: 2,
      title: "Join latest trends",
      description:
        "Find your next look with the latest trends, based of your preferences",
      image: "/discover.png",
      color: "bg-[#a78bfa]",
      span: 1,
    },
    {
      id: 3,
      title: "Turn messy closet into organized",
      description:
        "With hundreds of various ways to organize your clothes and discover new outfits",
      image: "/man-find.png",
      color: "bg-[#fbbf24]",
      span: 2,
    },
  ];

  return (
    <section ref={sectionRef} className="relative pb-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Turn messy closet into organized outfits
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              className={`relative rounded-2xl overflow-hidden shadow-lg ${
                card.span === 2 ? "md:col-span-2" : ""
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{
                duration: 0.8,
                delay: 0.2 + index * 0.2,
              }}
              whileHover={{ y: -5 }}
            >
              <div className={`w-full h-full ${card.color} text-white`}>
                {card.span === 2 ? (
                  // Horizontal layout for wide card
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="p-8 md:w-1/2 flex flex-col justify-center">
                      <h3 className="text-2xl md:text-3xl font-bold mb-4">
                        {card.title}
                      </h3>
                      <p className="text-lg mb-6 text-white/80">
                        {card.description}
                      </p>
                      <motion.button
                        className="flex items-center text-white font-medium group w-fit"
                        whileHover={{ x: 5 }}
                      >
                        <span className="mr-2">Learn more</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </div>
                    <div className="md:w-1/2 p-6 flex items-center justify-center">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="object-cover max-h-64 md:max-h-80"
                      />
                    </div>
                  </div>
                ) : (
                  // Vertical layout for regular cards
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex-grow">
                      <h3 className="text-xl md:text-2xl font-bold mb-3">
                        {card.title}
                      </h3>
                      <p className="text-white/80 mb-6">{card.description}</p>
                      <motion.button
                        className="flex items-center text-white font-medium group w-fit mb-6"
                        whileHover={{ x: 5 }}
                      >
                        <span className="mr-2">Learn more</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </div>
                    <div className="flex justify-center items-center mt-auto pt-4">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="object-contain h-36 md:h-48"
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoBox;
