"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

const ImageView = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const features = [
    {
      id: "img1",
      title: "Create",
      description:
        "Your uploaded clothes will be accessible to you and can be viewed here",
      image: "/hero-light.png",
      color: "from-purple-600 to-pink-500",
      icon: "M12 4v16m8-8H4",
    },
    {
      id: "img2",
      title: "Suggest",
      description:
        "Use our custom AI bot to create your perfect outfits for any occasions",
      image: "/suggest.png",
      color: "from-blue-600 to-cyan-500",
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    },
    {
      id: "img3",
      title: "View",
      description:
        "You can save your perfect outfits to your profile, to try them out later",
      image: "/view.png",
      color: "from-amber-500 to-orange-500",
      icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    },
  ];

  const [selectedFeature, setSelectedFeature] = useState(features[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate image loading
    const img = new Image();
    img.src = selectedFeature.image;
    img.onload = () => setIsLoading(false);

    return () => {
      img.onload = null;
    };
  }, [selectedFeature]);

  return (
    <div className="w-full py-8">
      {/* Main image display with card effect */}
      <div className="relative mx-auto max-w-4xl perspective">
        <motion.div
          className={`relative overflow-hidden rounded-2xl ${
            isDark ? "bg-gray-800" : "bg-white"
          } shadow-2xl`}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Image container */}
          <div className="relative overflow-hidden aspect-video">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedFeature.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center p-4"
              >
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={selectedFeature.image}
                    alt={selectedFeature.title}
                    className="max-h-full max-w-full object-contain"
                    style={{ opacity: isLoading ? 0 : 1 }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Feature tag */}
            <div className="absolute top-4 left-4 z-10">
              <motion.div
                className={`px-4 py-2 rounded-full bg-gradient-to-r ${selectedFeature.color} text-white text-sm font-medium flex items-center shadow-lg`}
                layoutId="featureTag"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={selectedFeature.icon}
                  />
                </svg>
                {selectedFeature.title}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tab navigation */}
      <div className="max-w-4xl mx-auto mt-6">
        <div className="grid grid-cols-3 gap-4">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              className={`relative p-4 rounded-xl cursor-pointer overflow-hidden ${
                selectedFeature.id === feature.id
                  ? `bg-gradient-to-br ${feature.color} text-white`
                  : `bg-card hover:bg-card/80`
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsLoading(true);
                setSelectedFeature(feature);
              }}
            >
              <div className="relative z-10">
                <div className="flex items-center mb-2">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      selectedFeature.id === feature.id
                        ? "bg-white/20"
                        : `bg-gradient-to-br ${feature.color} text-white`
                    } flex items-center justify-center mr-2`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={feature.icon}
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold">{feature.title}</h3>
                </div>
                <p
                  className={`text-sm ${
                    selectedFeature.id === feature.id
                      ? "text-white/90"
                      : "text-foreground/80"
                  }`}
                >
                  {feature.description}
                </p>
              </div>

              {/* Decorative elements */}
              {selectedFeature.id === feature.id && (
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10"></div>
                  <div className="absolute right-8 top-1 w-4 h-4 rounded-full bg-white/20"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageView;
