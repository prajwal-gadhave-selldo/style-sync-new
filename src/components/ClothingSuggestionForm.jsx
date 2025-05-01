"use client";

import generateClothingSuggestions from "@/lib/openai";
import generateClothingSuggestionsGroq from "@/lib/groqai";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { TiHeart } from "react-icons/ti";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { CgSpinner } from "react-icons/cg";
import LoadingFav from "./LoadingFav";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FiCalendar, FiHeart as FiHeartIcon } from "react-icons/fi";

const ClothingSuggestionForm = ({ clothes, weather, aiProvider }) => {
  const [eventType, setEventType] = useState("");
  const [mood, setMood] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [outfitsDisplay, setOutfitsDisplay] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingRandomize, setLoadingRandomize] = useState(false);
  const [responseLoading, setResponseLoading] = useState(false);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    if (suggestions.length > 0) {
      getUserOutfit().then(setOutfitsDisplay);
    }
  }, [suggestions]);

  useEffect(() => {
    if (outfitsDisplay) {
      // Add a small delay to ensure the content is rendered
      setTimeout(() => {
        suggestionsRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [outfitsDisplay]);

  const weatherTemp = weather?.current?.temp_c || "";
  const weatherCond = weather?.current?.condition?.text || "";
  const wind = weather?.current?.wind_kph || "";
  const { data: session } = useSession();
  const email = session && session.user.email;
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const event = watch("eventType");
  const feeling = watch("mood");

  const clothingDescriptions = clothes.map((item) => {
    let description = `${item.colors.join(" with ")} ${item.category}`;
    if (item.pattern) {
      description += ` ${item.pattern}`;
    }

    description += `, ${item._id};`;
    return description;
  });

  const onSubmit = async () => {
    setLoadingSuggestions(true);
    setResponseLoading(true);
    try {
      const suggestions = aiProvider === 'openai' 
        ? await generateClothingSuggestions(
            event,
            feeling,
            weatherTemp,
            weatherCond,
            clothingDescriptions,
            wind,
            true
          )
        : await generateClothingSuggestionsGroq(
            event,
            feeling,
            weatherTemp,
            weatherCond,
            clothingDescriptions,
            wind,
            true
          );

      setSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: "Failed to generate suggestions",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setResponseLoading(false);
      setLoadingSuggestions(false);
    }
  };

  const handleRandomize = async () => {
    setLoadingRandomize(true);
    setResponseLoading(true);
    try {
      const suggestions = aiProvider === 'openai'
        ? await generateClothingSuggestions(
            event,
            feeling,
            weatherTemp,
            weatherCond,
            clothingDescriptions,
            wind,
            false
          )
        : await generateClothingSuggestionsGroq(
            event,
            feeling,
            weatherTemp,
            weatherCond,
            clothingDescriptions,
            wind,
            false
          );

      setSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating random suggestions:', error);
      toast({
        title: "Failed to generate random suggestions",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setResponseLoading(false);
      setLoadingRandomize(false);
    }
  };

  const handleLikeOutfit = (index, outfitItems, email) => {
    const itemIds = outfitItems.map((item) => item._id);

    handleSaveLikedOutfit(itemIds, email);
  };

  const handleSaveLikedOutfit = async (itemIds, email) => {
    try {
      const response = await fetch("/api/saveLikedOutfit?email=" + email + "", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemIds }),
      });
      await response.json();

      toast({
        title: "Item saved to Favorites",
        description: "Your item has been saved successfully.",
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Failed to save the item",
        description: "Please try again later.",
        variant: "destructive",
        duration: 3000,
      });
      console.error(error);
    }
  };

  const getUserOutfit = async () => {
    const response = await fetch(`/api/findItemsUser?email=${email}`, {
      cache: "no-store",
    });
    const userItems = await response.json();

    const outfitsText = suggestions ? suggestions.trim().split(/\n{2,}/) : [];

    if (outfitsText) {
      const groupedOutfits = outfitsText.map((outfitText) => {
        const outfitProductIds = outfitText.match(/[\w\d]{6}/g) || [];
        const outfitItems = outfitProductIds.map((productId) => {
          const productIdLowercase = productId.toLowerCase();
          return userItems.find(
            (item) => item._id.toLowerCase() === productIdLowercase
          );
        });

        const accuracyMatch = outfitText.match(
          /Accuracy Rating:\s*(\d+)%\s*\((.*?)\)/
        );
        const accuracy = accuracyMatch ? parseInt(accuracyMatch[1], 10) : 0;
        const accuracyDescription = accuracyMatch
          ? accuracyMatch[2].trim()
          : "";

        return {
          description: outfitText.replace(/\(([\w\d]{6})\)/g, "").trim(),
          items: outfitItems,
          accuracy: accuracy,
          accuracy_description: accuracyDescription,
        };
      });
      

      return (
        <div className="flex flex-row flex-wrap gap-5 mt-5 max-w-6xl mx-auto justify-center">
          {groupedOutfits.length > 0 &&
            groupedOutfits.map((outfit, index) => {
              const firstQuoteIndex = outfit.description.indexOf('"') + 1;
              const lastQuoteIndex = outfit.description.lastIndexOf('"');
              const outfitPrefix = outfit.description.substring(
                0,
                firstQuoteIndex
              );
              const outfitName = outfit.description.substring(
                firstQuoteIndex,
                lastQuoteIndex + 1
              );
              const displayInformation = outfitPrefix + outfitName;

              return (
                <div
                  key={index}
                  className="flex-1 min-w-[320px] max-w-[350px] bg-secondary rounded-xl p-5 shadow-md relative"
                >
                  {/* Outfit Title - Added back */}
                  <p className="text-lg font-bold text-center">
                    {displayInformation}
                  </p>

                  {/* Like Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        handleLikeOutfit(
                          index,
                          outfit.items.filter((item) => item),
                          email
                        )
                      }
                      className="p-2 z-[8] rounded-md"
                    >
                      <TiHeart className="w-7 h-7 hover:text-red-500 transition-all duration-300 ease-in" />
                    </button>
                  </div>

                  {/* Accuracy Rating */}
                  <p className="text-sm text-gray-600 mt-1 text-center">
                    Accuracy:{" "}
                    <span className="font-semibold">{outfit.accuracy}%</span>
                  </p>

                  {/* Accuracy Description */}
                  {outfit.accuracy_description && (
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      {outfit.accuracy_description}
                    </p>
                  )}

                  {/* Outfit Items Grid - Fixed Layout */}
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {outfit.items
                      .filter((item) => item)
                      .map((item, itemIndex) => (
                        <div
                          key={item._id + itemIndex}
                          className="relative flex items-center justify-center w-full"
                        >
                          <img
                            src={item.photoUrl}
                            alt={item.description}
                            className="object-cover h-32 w-32 rounded-lg"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
        </div>
      );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-2 border-primary/20 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(120,119,198,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_8s_linear_infinite]" />
        <CardContent className="p-8 relative z-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl blur-xl" />
                <div className="relative p-6 rounded-2xl bg-background/50 backdrop-blur border border-primary/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                      <FiCalendar className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Event Type</h3>
                  </div>
                  <input
                    type="text"
                    autoComplete="off"
                    {...register("eventType", { required: true })}
                    className="w-full px-4 py-3 text-base bg-transparent border-b-2 border-primary/20 focus:border-primary focus:outline-none transition-colors duration-300"
                    placeholder="Where are you going?"
                  />
                  {errors.eventType && (
                    <p className="text-red-500 text-sm mt-2">
                      Please tell us where you're going
                    </p>
                  )}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl blur-xl" />
                <div className="relative p-6 rounded-2xl bg-background/50 backdrop-blur border border-primary/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                      <FiHeartIcon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Mood & Style</h3>
                  </div>
                  <input
                    type="text"
                    autoComplete="off"
                    {...register("mood", { required: true })}
                    className="w-full px-4 py-3 text-base bg-transparent border-b-2 border-primary/20 focus:border-primary focus:outline-none transition-colors duration-300"
                    placeholder="How are you feeling?"
                  />
                  {errors.mood && (
                    <p className="text-red-500 text-sm mt-2">
                      Please tell us how you're feeling
                    </p>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col items-center gap-6">
              <Button
                type="submit"
                disabled={loadingRandomize || loadingSuggestions}
                className="w-full max-w-md h-14 text-lg bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_8s_linear_infinite]" />
                {loadingSuggestions ? (
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    <CgSpinner className="animate-spin w-6 h-6" />
                    <span>Generating Suggestions...</span>
                  </div>
                ) : (
                  <span className="relative z-10">Get Suggestions</span>
                )}
              </Button>

              <div className="flex items-center gap-4 w-full max-w-md">
                <div className="flex-grow border-t border-primary/20"></div>
                <span className="text-muted-foreground">or</span>
                <div className="flex-grow border-t border-primary/20"></div>
              </div>

              <Button
                onClick={handleRandomize}
                disabled={loadingRandomize || loadingSuggestions}
                className="w-full max-w-md h-14 text-lg bg-gradient-to-br from-primary/40 via-primary/30 to-primary/20 hover:from-primary/50 hover:via-primary/40 hover:to-primary/30 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 relative overflow-hidden group backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent group-hover:via-primary/10 transition-all duration-300" />
                {loadingRandomize ? (
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    <CgSpinner className="animate-spin w-6 h-6" />
                    <span>Randomizing...</span>
                  </div>
                ) : (
                  <span className="relative z-10">Randomize</span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AnimatePresence>
        {responseLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Array(6)
              .fill()
              .map((_, index) => (
                <LoadingFav key={index} />
              ))}
          </motion.div>
        )}
      </AnimatePresence>

      {outfitsDisplay && (
        <motion.div
          ref={suggestionsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          {outfitsDisplay}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ClothingSuggestionForm;
