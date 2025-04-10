// components/ItemSelector.jsx
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSkeleton from "./LoadingSkeleton";
import { RxRotateCounterClockwise } from "react-icons/rx";
import { FaTrashCan } from "react-icons/fa6";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

const ItemSelector = ({
  clothes,
  loading,
  onSelectItem,
  onDelete,
  email,
  router,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [items, setItems] = useState(clothes);
  const isClothesRoute = router === "clothes";
  console.log("isClothesRoute", isClothesRoute, router);

  useEffect(() => {
    setItems(clothes);
  }, [clothes]);

  // Get unique categories
  const categories = ["all", ...new Set(clothes.map((item) => item.category))];

  const filteredClothes =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const handleRotate = async (e, itemToRotate) => {
    // Prevent triggering the parent div's onClick
    e.stopPropagation();

    const newRotationDegree = (itemToRotate.rotationDegree || 0 + 90) % 360;

    try {
      const response = await fetch(`/api/items?id=${itemToRotate._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rotationDegree: newRotationDegree }),
      });

      if (response.ok) {
        // Update the state with the new rotation degree
        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === itemToRotate._id
              ? { ...item, rotationDegree: newRotationDegree }
              : item
          )
        );
      } else {
        console.error("Failed to update rotation degree");
      }
    } catch (error) {
      console.error("Error updating rotation degree:", error);
    }
  };

  const openDialog = (e, itemId) => {
    e.stopPropagation();
    setSelectedItemId(itemId);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleDelete = async (itemId) => {
    setIsDialogOpen(false);
    try {
      const response = await fetch(`/api/items?id=${itemId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        if (onDelete) {
          onDelete(itemId);
        }
        // Remove the item from the local state
        setItems((prevItems) =>
          prevItems.filter((item) => item._id !== itemId)
        );
      } else {
        console.error("Failed to delete the item");
      }
    } catch (error) {
      console.error("Error deleting the item:", error);
    }
  };

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
              ? Array(10)
                  .fill()
                  .map((_, index) => (
                    <div
                      key={index}
                      className="border border-secondary rounded-lg p-3 bg-background shadow-sm"
                    >
                      <div className="aspect-square w-full mb-2 bg-gray-200 rounded-md"></div>
                      <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))
              : filteredClothes.map((item) => (
                  <div
                    key={item._id}
                    className="border border-secondary rounded-lg p-3 cursor-pointer hover:border-primary transition-all duration-200 bg-background shadow-sm hover:shadow-md relative"
                    onClick={() => onSelectItem(item)}
                  >
                    {isClothesRoute && (
                      <div className="absolute top-0 left-0 right-0 flex justify-between p-2 z-10">
                        <button
                          onClick={(e) => handleRotate(e, item)}
                          className="p-2 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center gap-1 text-sm transition-all"
                        >
                          <RxRotateCounterClockwise />
                          <span className="hidden md:group-hover:inline">
                            Rotate
                          </span>
                        </button>

                        <button
                          onClick={(e) => openDialog(e, item._id)}
                          className="p-2 rounded-full bg-white/80 hover:bg-red-100 text-gray-700 hover:text-red-700 shadow-sm transition-all"
                        >
                          <FaTrashCan />
                        </button>
                      </div>
                    )}

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

      <ConfirmDeleteDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onConfirm={() => handleDelete(selectedItemId)}
        itemDescription={
          items.find((item) => item._id === selectedItemId)?.category
        }
      />
    </div>
  );
};

export default ItemSelector;
