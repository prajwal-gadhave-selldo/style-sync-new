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
    <section className="overflow-y-scroll scrollbar-hide px-4 max-w-7xl mx-auto">
      <Heading title="Clothes" subTitle="Your clothes" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => router.push("/clothes/new")}
          className="h-32 bg-primary-foreground hover:bg-muted-foreground hover:text-background hover:border-background border-dashed border-2 rounded-lg flex items-center justify-center gap-3 p-3 transition-all duration-300 ease-in outline-none shadow-sm hover:shadow-md"
        >
          <IoAddCircle className="w-10 h-10" />
          <div>
            <p className="text-2xl font-bold tracking-wider capitalize">
              Add new clothes
            </p>
            <p className="text-sm opacity-80">Upload photos of your items</p>
          </div>
        </button>

        <button
          onClick={() => router.push("/complementary")}
          className="h-32 bg-secondary hover:bg-muted-foreground hover:text-background hover:border-background border-dashed border-2 rounded-lg flex items-center justify-center gap-3 p-3 transition-all duration-300 ease-in outline-none shadow-sm hover:shadow-md"
        >
          <IoShirt className="w-10 h-10" />
          <div>
            <p className="text-2xl font-bold tracking-wider capitalize">
              Complementary outfits
            </p>
            <p className="text-sm opacity-80">
              Match items with your collection
            </p>
          </div>
        </button>
      </div>

      {/* <div className="flex justify-between items-center mb-6 border-b pb-2">
        <Button
          variant="link"
          onClick={() => setShowRecentlyAdded(true)}
          className={`cursor-pointer text-lg font-semibold hover:text-primary ${
            showRecentlyAdded ? "text-primary underline" : "text-foreground/70"
          }`}
        >
          Recently Added
        </Button>
        <Button
          variant="link"
          onClick={() => setShowRecentlyAdded(false)}
          className={`cursor-pointer text-lg font-semibold hover:text-primary ${
            !showRecentlyAdded ? "text-primary underline" : "text-foreground/70"
          }`}
        >
          Category
        </Button>
      </div> */}
      <ItemSelector
        clothes={data}
        loading={loading}
        onSelectItem={handleItemSelect}
        onDeleteItem={handleDeleteItem}
        email={email}
        router={"clothes"}
      />

      {/* {showRecentlyAdded ? (
        <div className="w-full h-full pb-5">
          <RecentAddedItem
            data={data}
            loading={loading}
            onDelete={handleDeleteItem}
            email={email}
          />
        </div>
      ) : (
        <CategoryItems
          data={data}
          loading={loading}
          onDelete={handleDeleteItem}
          email={email}
        />
      )} */}
    </section>
  );
};
export default ClothesPage;
