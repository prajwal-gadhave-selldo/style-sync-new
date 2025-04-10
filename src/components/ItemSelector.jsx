// components/ItemSelector.jsx
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSkeleton from "./LoadingSkeleton";

const ItemSelector = ({ clothes, loading, onSelectItem }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get unique categories
  const categories = ["all", ...new Set(clothes.map((item) => item.category))];

  const filteredClothes =
    selectedCategory === "all"
      ? clothes
      : clothes.filter((item) => item.category === selectedCategory);

  return (
    <div className="w-full">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full overflow-x-auto flex-nowrap mb-6 bg-secondary/30 p-1">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              onClick={() => setSelectedCategory(category)}
              className="capitalize whitespace-nowrap px-4"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {loading
              ? Array(8)
                  .fill()
                  .map((_, index) => <LoadingSkeleton key={index} />)
              : filteredClothes.map((item) => (
                  <div
                    key={item._id}
                    className="border border-secondary rounded-lg p-3 cursor-pointer hover:border-primary transition-all duration-200 bg-background shadow-sm hover:shadow-md"
                    onClick={() => onSelectItem(item)}
                  >
                    <div className="aspect-square w-full relative mb-2 bg-white rounded-md overflow-hidden">
                      <img
                        src={item.photoUrl}
                        alt={item.category}
                        className="object-cover w-full h-full"
                        style={{
                          transform: `rotate(${item.rotationDegree || 0}deg)`,
                        }}
                      />
                    </div>
                    <div className="text-lg capitalize font-medium">
                      {item.category}
                    </div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {item.colors.join(", ")}
                    </div>
                  </div>
                ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ItemSelector;
