"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiHeart } from "react-icons/fi";
import ViewFavorite from "@/components/ViewFavorite";

const FavoritesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      <div className="container mx-auto px-4 py-12 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex flex-col items-center text-center mb-16">
            <motion.div 
              className="p-6 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 mb-8 relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(120,119,198,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_8s_linear_infinite]" />
              <FiHeart className="w-16 h-16 text-primary relative z-10" />
            </motion.div>
            <motion.h1 
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Your Favorites
            </motion.h1>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Your curated collection of favorite outfits and items
            </motion.p>
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ViewFavorite />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
