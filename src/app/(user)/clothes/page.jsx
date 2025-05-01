"use client";

import Heading from "@/components/Heading";
import React, { useEffect, useState } from "react";
import { IoAddCircle, IoShirt } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import RecentAddedItem from "@/components/RecentAddedItem";
import CategoryItems from "@/components/CategoryItems";
import { Button } from "@/components/ui/button";
import ItemSelector from "@/components/ItemSelector";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const ClothesPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRecentlyAdded, setShowRecentlyAdded] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const router = useRouter();
  const { data: session } = useSession();
  const email = session && session.user.email;

  useEffect(() => {
    if (email !== undefined && email !== null) {
      getUserItems();
    }
  }, [email]);

  const handleItemSelect = (item) => {
    setSelectedItem(item);
  };

  const getUserItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/findItemsUser?email=${email}`, {
        cache: "no-store",
        method: "GET",
      });
      if (response.ok) {
        const items = await response.json();
        setData(items);
      } else {
        console.error("Failed to fetch user items");
      }
    } catch (error) {
      console.error("Error fetching user items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = (deletedItemId) => {
    setData((prevData) =>
      prevData.filter((item) => item._id !== deletedItemId)
    );
  };

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
              <IoShirt className="w-16 h-16 text-primary relative z-10" />
            </motion.div>
            <motion.h1 
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Your Wardrobe
            </motion.h1>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Manage and organize your clothing collection
            </motion.p>
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              whileHover={{ y: -4 }} 
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-xl blur-xl" />
              <Card onClick={() => router.push("/clothes/new")} className="cursor-pointer h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(120,119,198,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_8s_linear_infinite]" />
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10">
                      <IoAddCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Add New Clothes</h3>
                      <p className="text-sm text-muted-foreground">Upload photos of your items</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }} 
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-xl blur-xl" />
              <Card onClick={() => router.push("/complementary")} className="cursor-pointer h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(120,119,198,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_8s_linear_infinite]" />
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10">
                      <IoShirt className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Complementary Outfits</h3>
                      <p className="text-sm text-muted-foreground">Match items with your collection</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <ItemSelector
            clothes={data}
            loading={loading}
            onSelectItem={handleItemSelect}
            onDeleteItem={handleDeleteItem}
            email={email}
            router={"clothes"}
          />
        </div>
      </div>
    </div>
  );
};

export default ClothesPage;
