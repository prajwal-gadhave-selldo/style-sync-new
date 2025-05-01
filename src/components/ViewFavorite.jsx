"use client";

import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { FaTrashCan } from "react-icons/fa6";
import LoadingFav from "./LoadingFav";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FiHeart } from "react-icons/fi";

const ViewFavorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [outfitIdToDelete, setOutfitIdToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const email = session && session.user.email;

  useEffect(() => {
    if (email && email.length > 0) {
      fetchUserFavorites();
    }
  }, [email]);

  const fetchUserFavorites = async () => {
    try {
      const response = await fetch(`/api/saveLikedOutfit?email=${email}`, {
        cache: "no-store",
      });
      const data = await response.json();
      setFavorites(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user favorites:", error);
    }
  };

  const openDeleteDialog = (likedOutfitId) => {
    setOutfitIdToDelete(likedOutfitId);
    setIsDeleteDialogOpen(true);
  };

  const onConfirmDelete = async () => {
    if (outfitIdToDelete) {
      await handleDeleteOutfit(outfitIdToDelete);
    }
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteOutfit = async (likedOutfitId) => {
    try {
      const response = await fetch(`/api/saveLikedOutfit`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ likedOutfitId }),
        cache: "no-store",
      });

      const result = await response.json();
      if (result.success) {
        setFavorites((prevFavorites) => ({
          ...prevFavorites,
          itemsGroupedByOutfit: Object.fromEntries(
            Object.entries(prevFavorites.itemsGroupedByOutfit).filter(
              ([outfitId, _]) => outfitId !== likedOutfitId
            )
          ),
        }));
      } else {
        console.error("Failed to delete outfit:", result.error);
      }
    } catch (error) {
      console.error("Error deleting outfit:", error);
    }
  };

  return (
    <div className="space-y-6">
      {loading === true ? (
        Array(8)
          .fill()
          .map((_, index) => <LoadingFav key={index} />)
      ) : (
        <>
          {favorites && Object.keys(favorites.itemsGroupedByOutfit).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(favorites.itemsGroupedByOutfit).map(
                ([outfitId, items], outfitIndex) => (
                  <motion.div
                    key={outfitId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: outfitIndex * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-xl blur-xl" />
                    <Card className="h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(120,119,198,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_8s_linear_infinite]" />
                      <CardHeader className="pb-0">
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                          <FiHeart className="w-4 h-4 text-primary" />
                          <span>Favorite Outfit</span>
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                          {items.length} items collection
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                          {items.map((item, itemIndex) => (
                            <motion.div
                              key={item._id + itemIndex}
                              className="relative flex items-center justify-center w-full h-full"
                              style={{
                                transform: `rotate(${item.rotationDegree}deg)`,
                              }}
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <div className="relative w-32 h-40 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
                                <img
                                  src={item.photoUrl}
                                  alt={item.description}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                      <button
                        onClick={() => openDeleteDialog(outfitId)}
                        className="absolute top-3 right-3 p-2 rounded-xl bg-background/80 backdrop-blur-sm border border-primary/20 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 ease-in z-10"
                      >
                        <FaTrashCan className="w-4 h-4 text-primary" />
                      </button>
                    </Card>
                  </motion.div>
                )
              )}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-[60vh] flex flex-col items-center justify-center space-y-8"
            >
              <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(120,119,198,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_8s_linear_infinite]" />
                <FiHeart className="w-16 h-16 text-primary relative z-10" />
              </div>
              <p className="text-center text-xl font-semibold text-muted-foreground">
                No favorites to display.
              </p>
              <img
                src="/noFav.png"
                alt="No favorites"
                className="object-cover w-48 h-48"
              />
              <Link
                href="/outfit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_8s_linear_infinite]" />
                <p className="text-center text-lg font-semibold text-background relative z-10">
                  Let's create outfits
                </p>
              </Link>
            </motion.div>
          )}
        </>
      )}
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={onConfirmDelete}
        itemDescription=""
      />
    </div>
  );
};

export default ViewFavorite;
