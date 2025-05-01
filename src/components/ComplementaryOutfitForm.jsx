import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { generateComplementaryOutfits } from "@/lib/openai";
import { generateComplementaryOutfits as generateComplementaryOutfitsGroq } from "@/lib/groqai";
import { useToast } from "@/components/ui/use-toast";
import { CgSpinner } from "react-icons/cg";
import { TiHeart } from "react-icons/ti";
import LoadingFav from "./LoadingFav";

const ComplementaryOutfitForm = ({ selectedItem, allClothes, email, aiProvider }) => {
  const [suggestions, setSuggestions] = useState("");
  const [outfitsDisplay, setOutfitsDisplay] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (suggestions.length > 0) {
      getUserOutfit();
    }
  }, [suggestions]);

  const onSubmit = async (data) => {
    setLoading(true);

    // Filter out items of the same category as the selected item
    const filteredClothes = allClothes.filter(
      (item) => item.category !== selectedItem.category
    );

    const clothingDescriptions = filteredClothes.map((item) => {
      let description = `${item.colors.join(" with ")} ${item.category}`;
      if (item.pattern) {
        description += ` ${item.pattern}`;
      }
      description += `, ${item._id};`;
      return description;
    });

    const selectedItemDesc = `${selectedItem.colors.join(" with ")} ${
      selectedItem.category
    }`;

    try {
      const outfits = aiProvider === 'openai'
        ? await generateComplementaryOutfits(
            data.eventType,
            selectedItemDesc,
            selectedItem._id,
            selectedItem.category,
            clothingDescriptions
          )
        : await generateComplementaryOutfitsGroq(
            data.eventType,
            selectedItemDesc,
            selectedItem._id,
            selectedItem.category,
            clothingDescriptions
          );

      setSuggestions(outfits);
    } catch (error) {
      console.error("Error generating outfits:", error);
      toast({
        title: "Failed to generate outfits",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLikeOutfit = (outfitItems) => {
    const itemIds = outfitItems.map((item) => item._id);
    handleSaveLikedOutfit(itemIds, email);
  };

  const handleSaveLikedOutfit = async (itemIds, email) => {
    try {
      const response = await fetch("/api/saveLikedOutfit?email=" + email, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemIds }),
      });
      await response.json();

      toast({
        title: "Outfit saved to Favorites",
        description: "Your outfit has been saved successfully.",
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Failed to save the outfit",
        description: "Please try again later.",
        variant: "destructive",
        duration: 3000,
      });
      console.error(error);
    }
  };

  const getUserOutfit = async () => {
    const outfitsText = suggestions ? suggestions.trim().split(/\n{2,}/) : [];

    if (outfitsText.length > 0) {
      const groupedOutfits = outfitsText.map((outfitText) => {
        const outfitProductIds = outfitText.match(/[\w\d]{6}/g) || [];
        const outfitItems = [selectedItem]; // Always include the selected item first

        // Add the rest of the items, excluding duplicates and same category items
        outfitProductIds.forEach((productId) => {
          const productIdLowercase = productId.toLowerCase();
          const item = allClothes.find(
            (item) => item._id.toLowerCase() === productIdLowercase
          );

          if (
            item &&
            item._id !== selectedItem._id &&
            item.category !== selectedItem.category
          ) {
            outfitItems.push(item);
          }
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

      setOutfitsDisplay(
        <div className="flex flex-row flex-wrap gap-5 mt-5 max-w-6xl mx-auto justify-center">
          {groupedOutfits.map((outfit, index) => {
            const firstQuoteIndex = outfit.description.indexOf('"') + 1;
            const lastQuoteIndex = outfit.description.lastIndexOf('"');
            const outfitPrefix = outfit.description.substring(
              0,
              firstQuoteIndex
            );
            const outfitName = outfit.description.substring(
              firstQuoteIndex,
              lastQuoteIndex > 0
                ? lastQuoteIndex + 1
                : outfit.description.length
            );
            const displayInformation =
              firstQuoteIndex > 0
                ? outfitPrefix + outfitName
                : outfit.description;

            // Extract the outfit name only (without the "Outfit X:" prefix)
            const outfitTitle = outfitName.replaceAll('"', "");

            return (
              <div
                key={index}
                className="flex-1 min-w-[320px] max-w-[350px] bg-secondary rounded-xl p-5 shadow-md relative"
              >
                {/* Outfit Title */}
                <p className="text-lg font-bold text-center">{outfitTitle}</p>

                {/* Like Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleLikeOutfit(outfit.items)}
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

                {/* Outfit Items Grid */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {/* Always include the selected item first with a label */}
                  <div className="relative flex items-center justify-center w-full">
                    <img
                      src={selectedItem.photoUrl}
                      alt={selectedItem.category}
                      className="object-cover h-32 w-32 rounded-lg"
                      style={{
                        transform: `rotate(${
                          selectedItem.rotationDegree || 0
                        }deg)`,
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1 rounded-b-lg">
                      Selected Item
                    </div>
                  </div>

                  {/* Display complementary items */}
                  {outfit.items
                    .filter((item) => item._id !== selectedItem._id)
                    .map((item, itemIndex) => (
                      <div
                        key={item._id + itemIndex}
                        className="relative flex items-center justify-center w-full"
                      >
                        <img
                          src={item.photoUrl}
                          alt={item.category}
                          className="object-cover h-32 w-32 rounded-lg"
                          style={{
                            transform: `rotate(${item.rotationDegree || 0}deg)`,
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1 rounded-b-lg capitalize">
                          {item.category}
                        </div>
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
        <div className="mb-5 flex flex-col gap-2 md:max-w-xl md:mx-auto">
          <label className="text-xl font-semibold">
            I&apos;m going to
            <input
              type="text"
              autoComplete="off"
              {...register("eventType", { required: true })}
              className="bg-transparent h-4 w-44 md:w-60 border-b border-foreground focus:outline-none mx-2"
              placeholder="a party, work, casual outing..."
            />
          </label>
          {errors.eventType && (
            <span className="text-red-500 text-sm">
              Please tell us where you&apos;re going
            </span>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className={`text-xl font-semibold mt-5 max-w-xl w-full mx-auto ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <CgSpinner className="animate-spin w-8 h-8" />
            </div>
          ) : (
            "Generate Complementary Outfit"
          )}
        </Button>
      </form>

      {loading &&
        Array(3)
          .fill()
          .map((_, index) => <LoadingFav key={index} />)}

      {outfitsDisplay}
    </div>
  );
};

export default ComplementaryOutfitForm;
