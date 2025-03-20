"use client";

import generateClothingSuggestions from "@/lib/openai";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { TiHeart } from "react-icons/ti";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { CgSpinner } from "react-icons/cg";
import LoadingFav from "./LoadingFav";

const ClothingSuggestionForm = ({ clothes, weather }) => {
  const [eventType, setEventType] = useState("");
  const [mood, setMood] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [outfitsDisplay, setOutfitsDisplay] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingRandomize, setLoadingRandomize] = useState(false);
  const [responseLoading, setResponseLoading] = useState(false);

  useEffect(() => {
    if (suggestions.length > 0) {
      getUserOutfit().then(setOutfitsDisplay);
    }
  }, [suggestions]);

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
    const suggestions = await generateClothingSuggestions(
      event,
      feeling,
      weatherTemp,
      weatherCond,
      clothingDescriptions,
      wind,
      true
    );

    setSuggestions(suggestions);
    console.log(suggestions);
    setResponseLoading(false);
    setLoadingSuggestions(false);
  };

  const handleRandomize = async () => {
    setLoadingRandomize(true);
    setResponseLoading(true);
    const suggestions = await generateClothingSuggestions(
      event,
      feeling,
      weatherTemp,
      weatherCond,
      clothingDescriptions,
      wind,
      false
    );

    setSuggestions(suggestions);
    setResponseLoading(false);
    setLoadingRandomize(false);
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
      
      // return (
      //   <div className="flex gap-5 mt-5 max-w-3xl mx-auto flex-wrap">
      //     {groupedOutfits.length > 0 &&
      //       groupedOutfits.map((outfit, index) => {
      //         const firstQuoteIndex = outfit.description.indexOf('"') + 1;
      //         const lastQuoteIndex = outfit.description.lastIndexOf('"');
      //         const outfitPrefix = outfit.description.substring(
      //           0,
      //           firstQuoteIndex
      //         );
      //         const outfitName = outfit.description.substring(
      //           firstQuoteIndex,
      //           lastQuoteIndex + 1
      //         );
      //         const displayInformation = outfitPrefix + outfitName;

      //         return (
      //           <div key={index} className="w-full mt-5 relative">
      //             {/* Outfit Name */}
      //             <p className="text-xl font-semibold text-center">
      //               {displayInformation}
      //             </p>

      //             {/* Accuracy Rating */}
      //             <p className="text-lg text-gray-600 text-center mt-1">
      //               Accuracy:{" "}
      //               <span className="font-semibold">{outfit.accuracy}%</span>
      //             </p>

      //             {/* Accuracy Description */}
      //             {outfit.accuracy_description && (
      //               <p className="text-sm text-gray-500 text-center mt-1">
      //                 {outfit.accuracy_description}
      //               </p>
      //             )}

      //             {/* Like Button */}
      //             <button
      //               onClick={() =>
      //                 handleLikeOutfit(
      //                   index,
      //                   outfit.items.filter((item) => item),
      //                   email
      //                 )
      //               }
      //               className="absolute top-10 right-2 p-2 z-[8] rounded-md"
      //             >
      //               <TiHeart className="w-8 h-8 hover:text-red-500 transition-all duration-300 ease-in" />
      //             </button>

      //             {/* Outfit Items Grid */}
      //             <div className="grid grid-cols-2 justify-self-center gap-5 bg-secondary rounded-xl p-5">
      //               {outfit.items
      //                 .filter((item) => item)
      //                 .map((item, itemIndex) => (
      //                   <div
      //                     key={item._id + itemIndex}
      //                     className="relative flex items-center justify-center w-full h-full"
      //                     style={{
      //                       transform: `rotate(${item.rotationDegree}deg)`,
      //                     }}
      //                   >
      //                     <img
      //                       src={item.photoUrl}
      //                       alt={item.description}
      //                       className="object-cover h-40 w-40"
      //                     />
      //                   </div>
      //                 ))}
      //             </div>
      //           </div>
      //         );
      //       })}
      //   </div>
      // );

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
    <div className="mt-5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="mb-5 flex flex-col gap-2 lg:flex-row md:max-w-4xl md:mx-auto">
          <label className="text-xl font-semibold">
            I&apos;m going to
            <input
              type="text"
              autoComplete="off"
              {...register("eventType", { required: true })}
              className="bg-transparent h-4 w-44 md:w-60 border-b border-foreground focus:outline-none mx-2"
            />
            {errors.eventType && (
              <p className="text-red-500 text-sm ml-32 hidden lg:block">
                This field is required
              </p>
            )}
          </label>

          {errors.eventType && (
            <span className="text-red-500 text-sm ml-36 lg:hidden ">
              This field is required
            </span>
          )}

          <label className="text-xl font-semibold">
            I&apos;m feeling
            <input
              type="text"
              autoComplete="off"
              {...register("mood", { required: true })}
              className="bg-transparent h-4 w-48 md:w-60 border-b border-foreground focus:outline-none mx-2"
            />
            {errors.mood && (
              <p className="text-red-500 text-sm ml-32 hidden lg:block">
                This field is required
              </p>
            )}
          </label>
          {errors.mood && (
            <span className="text-red-500 text-sm ml-36 lg:hidden ">
              This field is required
            </span>
          )}
        </div>

        <Button
          type="submit"
          disabled={loadingRandomize || loadingSuggestions}
          className={`text-xl font-semibold mt-5 max-w-xl w-full mx-auto ${
            loadingRandomize || loadingSuggestions === true
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {loadingSuggestions ? (
            <div className="flex items-center justify-center gap-2">
              <CgSpinner className="animate-spin w-8 h-8" />
            </div>
          ) : (
            "Get Suggestions"
          )}
        </Button>
      </form>

      <div className="mt-5 flex flex-col items-center">
        <div className="flex items-center gap-2 w-full md:max-w-xl md:mx-auto">
          <div className="flex-grow border-t border-gray-300"></div>
          <p className="text-lg font-base px-2">or</p>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <Button
          onClick={handleRandomize}
          disabled={loadingRandomize || loadingSuggestions}
          className={`text-xl font-semibold mt-5 max-w-xl w-full mx-auto ${
            loadingRandomize || loadingSuggestions === true
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {loadingRandomize ? (
            <div className="flex items-center justify-center gap-2">
              <CgSpinner className="animate-spin w-8 h-8" />
            </div>
          ) : (
            "Randomize"
          )}
        </Button>
      </div>
      {responseLoading &&
        Array(8)
          .fill()
          .map((_, index) => <LoadingFav key={index} />)}
      {outfitsDisplay}
    </div>
  );
};

export default ClothingSuggestionForm;
