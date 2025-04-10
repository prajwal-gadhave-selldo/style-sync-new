// components/RecentAddedItem.jsx
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { countAtom, decrementAtomCount } from "@/lib/atomStore";
// import { decrementCount } from "@/lib/api";
import { RxRotateCounterClockwise } from "react-icons/rx";
import { FaTrashCan } from "react-icons/fa6";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import LoadingSkeleton from "./LoadingSkeleton";
import Image from "next/image";

const RecentAddedItem = ({ data, loading, onDelete, email }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [items, setItems] = useState(data);
  const [count, setCount] = useAtom(countAtom);

  useEffect(() => {
    setItems(data);
  }, [data]);

  const handleDelete = async (itemId) => {
    setIsDialogOpen(false);
    try {
      const response = await fetch(`/api/items?id=${itemId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        onDelete(itemId);
        await decrementAtomCount(email);
        setCount(count - 1);
      } else {
        console.error("Failed to delete the item");
      }
    } catch (error) {
      console.error("Error deleting the item:", error);
    }
  };

  const updateRotation = async (itemId, rotationDegree) => {
    try {
      const response = await fetch(`/api/items?id=${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rotationDegree }),
      });
      if (response.ok) {
        return true;
      } else {
        console.error("Failed to update rotation degree");
        return false;
      }
    } catch (error) {
      console.error("Error updating rotation degree:", error);
      return false;
    }
  };

  const handleRotate = async (itemToRotate) => {
    const newRotationDegree = (itemToRotate.rotationDegree + 90) % 360;

    try {
      const success = await updateRotation(itemToRotate._id, newRotationDegree);
      if (success) {
        // Update the state with the new rotation degree
        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === itemToRotate._id
              ? { ...item, rotationDegree: newRotationDegree }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating rotation degree:", error);
    }
  };

  const openDialog = (itemId) => {
    setSelectedItemId(itemId);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {loading
          ? Array(8)
              .fill()
              .map((_, index) => <LoadingSkeleton key={index} />)
          : items.map((item) => (
              <div
                key={`${item._id}-${item.rotationDegree}`}
                className="border border-gray-200 relative rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 ease-in"
              >
                <div className="absolute top-0 left-0 right-0 flex justify-between p-2 z-10">
                  <button
                    onClick={() => handleRotate(item)}
                    className="p-2 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center gap-1 text-sm transition-all"
                  >
                    <RxRotateCounterClockwise />
                    <span className="hidden md:group-hover:inline">Rotate</span>
                  </button>

                  <button
                    onClick={() => openDialog(item._id)}
                    className="p-2 rounded-full bg-white/80 hover:bg-red-100 text-gray-700 hover:text-red-700 shadow-sm transition-all"
                  >
                    <FaTrashCan />
                  </button>
                </div>

                <div className="aspect-square w-full relative bg-gray-50">
                  <Image
                    src={item.photoUrl}
                    alt={item.category}
                    fill
                    unoptimized={true}
                    className="object-cover"
                    style={{ transform: `rotate(${item.rotationDegree}deg)` }}
                  />
                </div>

                <div className="p-3">
                  <div className="text-lg capitalize font-medium">
                    {item.category}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {item.colors.join(", ")}
                  </div>
                </div>
              </div>
            ))}
      </div>

      <ConfirmDeleteDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onConfirm={() => handleDelete(selectedItemId)}
        itemDescription={
          data.find((item) => item._id === selectedItemId)?.category
        }
      />

      {!loading && data.length === 0 && (
        <div className="w-full py-12 flex items-center flex-col justify-center text-center">
          <h2 className="text-3xl font-bold mb-6">Time to add something!</h2>
          <div className="max-w-md mx-auto mb-6">
            <Image
              src="/empty.png"
              alt="empty"
              width={400}
              height={400}
              className="mx-auto"
            />
          </div>
          <p className="text-foreground/70 font-semibold text-lg">
            No items added yet
          </p>
        </div>
      )}
    </>
  );
};

export default RecentAddedItem;
