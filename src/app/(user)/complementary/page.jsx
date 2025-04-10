// app/clothes/complementary/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Heading from "@/components/Heading";
import ItemSelector from "@/components/ItemSelector";
import ComplementaryOutfitForm from "@/components/ComplementaryOutfitForm";
import { IoAddCircle, IoShirt } from "react-icons/io5";

const ComplementaryOutfitPage = () => {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const router = useRouter();
  const { data: session } = useSession();
  const email = session && session.user.email;

  useEffect(() => {
    if (email) {
      getUserItems();
    }
  }, [email]);

  const getUserItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/findItemsUser?email=${email}`, {
        cache: "no-store",
        method: "GET",
      });
      if (response.ok) {
        const items = await response.json();
        setClothes(items);
      } else {
        console.error("Failed to fetch user items");
      }
    } catch (error) {
      console.error("Error fetching user items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
  };

  return (
    <section className="overflow-y-scroll scrollbar-hide px-4 max-w-7xl mx-auto">
      <Heading
        title="Complementary Outfit"
        subTitle="Find perfect matches for your selected item"
      />

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
          onClick={() => router.push("/outfit")}
          className="h-32 bg-secondary hover:bg-muted-foreground hover:text-background hover:border-background border-dashed border-2 rounded-lg flex items-center justify-center gap-3 p-3 transition-all duration-300 ease-in outline-none shadow-sm hover:shadow-md"
        >
          <IoShirt className="w-10 h-10" />
          <div>
            <p className="text-2xl font-bold tracking-wider capitalize">
              Generate Outfits
            </p>
            <p className="text-sm opacity-80">
              Discover curated outfit combinations tailored for you
            </p>
          </div>
        </button>
      </div>

      {!selectedItem ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Select an item to build your outfit around:
          </h2>
          <ItemSelector
            clothes={clothes}
            loading={loading}
            onSelectItem={handleItemSelect}
            router={router}
            email={email}
          />
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setSelectedItem(null)}
              className="flex items-center text-sm font-medium text-primary hover:underline mr-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to selection
            </button>
          </div>

          <div className="bg-secondary/30 rounded-lg p-4 mb-6 flex items-center">
            <div className="relative w-24 h-24 mr-5 bg-white rounded-md overflow-hidden">
              <img
                src={selectedItem.photoUrl}
                alt={selectedItem.category}
                className="object-cover w-full h-full"
                style={{
                  transform: `rotate(${selectedItem.rotationDegree || 0}deg)`,
                }}
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">
                Building outfit around:
              </h2>
              <p className="text-lg font-medium capitalize">
                {selectedItem.category}
              </p>
              <p className="text-sm text-muted-foreground capitalize">
                {selectedItem.colors.join(", ")}
              </p>
            </div>
          </div>

          <ComplementaryOutfitForm
            selectedItem={selectedItem}
            allClothes={clothes}
            email={email}
          />
        </div>
      )}
    </section>
  );
};

export default ComplementaryOutfitPage;
