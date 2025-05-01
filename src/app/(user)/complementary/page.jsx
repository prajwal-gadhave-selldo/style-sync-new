// app/clothes/complementary/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Heading from "@/components/Heading";
import ItemSelector from "@/components/ItemSelector";
import ComplementaryOutfitForm from "@/components/ComplementaryOutfitForm";
import { IoAddCircle, IoShirt } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FiSun, FiWind } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';

const ComplementaryOutfitPage = () => {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedAI, setSelectedAI] = useState('openai');
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
              Complementary Outfits
            </motion.h1>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Build perfect outfits around your favorite items
            </motion.p>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                whileHover={{ y: -4 }} 
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-xl blur-xl" />
                <Card className="h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(120,119,198,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_8s_linear_infinite]" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10">
                        <IoShirt className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Select Item</h3>
                        <p className="text-sm text-muted-foreground">Choose your favorite clothing item</p>
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
                <Card className="h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(120,119,198,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_8s_linear_infinite]" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10">
                        <BsStars className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">AI Assistant</h3>
                        <p className="text-sm text-muted-foreground">Choose your stylist</p>
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
                <Card className="h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(120,119,198,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_8s_linear_infinite]" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10">
                        <IoAddCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Get Suggestions</h3>
                        <p className="text-sm text-muted-foreground">Create perfect combinations</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="relative mt-6">
              <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="relative flex justify-center">
                <div className="px-3 py-1.5 bg-background rounded-full border border-primary/20 shadow-md">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-primary font-medium">Select AI Model</span>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-primary/20 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(120,119,198,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_8s_linear_infinite]" />
              <CardContent className="p-6 relative z-10">
                <Tabs defaultValue="openai" className="w-full" onValueChange={setSelectedAI}>
                  <TabsList className="grid w-full grid-cols-2 h-12 bg-background/50 rounded-lg p-1">
                    <TabsTrigger 
                      value="openai" 
                      className="flex items-center gap-2 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-primary/10 rounded-md transition-all duration-300"
                    >
                      <img src="/openai-logo.svg" alt="OpenAI" className="w-5 h-5" />
                      OpenAI
                    </TabsTrigger>
                    <TabsTrigger 
                      value="groq" 
                      className="flex items-center gap-2 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-primary/10 rounded-md transition-all duration-300"
                    >
                      <img src="/groq-logo.svg" alt="Groq" className="w-5 h-5" />
                      Groq
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="openai" className="mt-4">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <FiSun className="w-5 h-5" />
                      <span>Powered by GPT-3.5 - Your Fashion Expert</span>
                    </div>
                  </TabsContent>
                  <TabsContent value="groq" className="mt-4">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <FiWind className="w-5 h-5" />
                      <span>Powered by LLaMA 2 70B - Your Personal Stylist</span>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <ItemSelector
              clothes={clothes}
              loading={loading}
              onSelectItem={handleItemSelect}
              email={email}
            />

            {selectedItem && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-2 border-primary/20 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(120,119,198,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_8s_linear_infinite]" />
                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-center gap-6">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10">
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
                  </CardContent>
                </Card>

                <ComplementaryOutfitForm
                  selectedItem={selectedItem}
                  allClothes={clothes}
                  email={email}
                  aiProvider={selectedAI}
                />
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplementaryOutfitPage;
