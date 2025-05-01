'use client';
import Heading from '@/components/Heading';
import React, { useEffect, useState } from 'react';
import WeatherWidget from '@/components/WeatherWidget';
import LoadingWeather from '@/components/LoadingWeather';
import fetchWeatherData, { getCount } from '@/lib/fetchWeatherData';
import ClothingSuggestionForm from '@/components/ClothingSuggestionForm';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FiPlus, FiUpload, FiWind, FiSun, FiCloud, FiCalendar, FiHeart, FiChevronRight } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import { GiClothes } from 'react-icons/gi';
import { MdOutlineStyle } from 'react-icons/md';
import { BsStars, BsArrowRight } from 'react-icons/bs';
import { cn } from '@/lib/utils';

const OutfitPage = () => {
  const [latLang, setLatLang] = useState('');
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const [clothes, setClothes] = useState([]);
  const [count, setCount] = useState(0);
  const [selectedAI, setSelectedAI] = useState('openai');
  const { resolvedTheme } = useTheme();

  const { data: session } = useSession();
  const email = session && session.user.email;

  useEffect(() => {
    fetchUserLatLong();
  }, []);

  useEffect(() => {
    if (email) {
      getUserItems();
    }
  }, [email]);

  useEffect(() => {
    if (email) {
      fetchCount();
    }
  }, [email]);

  useEffect(() => {
    if (latLang && latLang !== '') {
      getUserWeather();
    }
  }, [latLang]);

  const fetchCount = async () => {
    const count = await getCount(email);
    setCount(count);
  };

  const fetchUserLatLong = async () => {
    try {
      const locationFetch = await fetch(`/api/latLong`, { cache: 'no-store' });
      const locationData = await locationFetch.json();

      setLatLang(locationData.data);
    } catch (error) {
      console.error('Error fetching user lat/long:', error);
    }
  };

  const getUserWeather = async () => {
    const latLongString = `${latLang.location.latitude},${latLang.location.longitude}`;

    if (latLongString) {
      try {
        const response = await fetchWeatherData(latLongString);
        const data = await response;
        setWeather(data);
      } catch (error) {
        console.error('Error fetching user weather:', error);
      }
    }
  };

  const getUserItems = async () => {
    try {
      const response = await fetch(`/api/findItemsUser?email=${email}`, {
        cache: 'no-store',
      });
      if (response.ok) {
        const items = await response.json();
        setClothes(items);
        setLoading(false);
      } else {
        console.error('Failed to fetch user items');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user items:', error);
      setLoading(false);
    }
  };

  const renderClothingSuggestionForm = () => {
    if (count < 10) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto h-[60vh] flex flex-col items-center justify-center"
        >
          <Card className="w-full max-w-md bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-2 border-primary/20 shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(120,119,198,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_8s_linear_infinite]" />
            <CardHeader className="relative z-10">
              <div className="flex justify-center mb-6">
                <motion.div 
                  className="p-5 rounded-2xl bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 1 }}
                >
                  <GiClothes className="w-12 h-12 text-primary" />
                </motion.div>
              </div>
              <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                Build Your Wardrobe
              </CardTitle>
              <CardDescription className="text-center text-lg mt-3">
                Create your perfect style collection
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-8 relative z-10">
              <motion.div 
                className="flex items-center justify-center w-36 h-36 rounded-2xl bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 relative overflow-hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
                <FiUpload className="w-20 h-20 text-primary relative z-10" />
              </motion.div>
              <div className="text-center space-y-4">
                <p className="text-xl font-semibold">You have {count} clothing items</p>
                <p className="text-muted-foreground text-lg">Add {10 - count} more to unlock AI-powered outfit suggestions</p>
              </div>
              <Link href="/clothes/new" className="w-full">
                <Button 
                  className="w-full h-14 text-lg bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 transition-all duration-300 relative overflow-hidden group"
                  size="lg"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_8s_linear_infinite]" />
                  <FiPlus className="mr-3 h-6 w-6 relative z-10" />
                  <span className="relative z-10">Add Clothes</span>
                  <BsArrowRight className="ml-2 h-5 w-5 relative z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      );
    } else {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto space-y-12"
        >
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
                      <FiCalendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Event Type</h3>
                      <p className="text-sm text-muted-foreground">Select your occasion</p>
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
                      <FiHeart className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Mood & Style</h3>
                      <p className="text-sm text-muted-foreground">Express your vibe</p>
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

          <ClothingSuggestionForm 
            weather={weather} 
            clothes={clothes} 
            aiProvider={selectedAI} 
          />
        </motion.div>
      );
    }
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
              <MdOutlineStyle className="w-16 h-16 text-primary relative z-10" />
            </motion.div>
            <motion.h1 
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Your Personal Style Assistant
            </motion.h1>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Let AI help you create the perfect outfit for any occasion
            </motion.p>
          </div>
        </motion.div>

        {loading && Object.keys(weather).length === 0 && <LoadingWeather />}
        {!loading && Object.keys(weather).length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-12"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl blur-xl" />
              <WeatherWidget location={weather.location} weather={weather.current} />
            </motion.div>
            {renderClothingSuggestionForm()}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OutfitPage;
