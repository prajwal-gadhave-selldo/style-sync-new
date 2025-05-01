'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FiCloud, FiSun, FiWind, FiDroplet, FiThermometer } from 'react-icons/fi';
import { motion } from 'framer-motion';

const WeatherWidget = ({ location, weather }) => {
  
  const getWeatherIcon = (condition) => {
    const lowerCondition = condition?.toLowerCase();
    if (lowerCondition?.includes('cloud')) return FiCloud;
    if (lowerCondition?.includes('sun') || lowerCondition?.includes('clear')) return FiSun;
    if (lowerCondition?.includes('rain')) return FiDroplet;
    return FiSun;
  };

  const WeatherIcon = getWeatherIcon(weather.condition.text);

  return (
    <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-2 border-primary/20 mb-6">
      <CardContent className="p-6">
        <motion.div 
          className="flex items-center justify-between flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Weather in {location.name}, {location.region}, {location.country}</h2>
            <p className="text-muted-foreground">
              Perfect your outfit for today's weather
            </p>
          </div>
          <div className="w-full flex items-center justify-center gap-6 mt-4 md:mt-0 md:w-auto">
            <motion.div 
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="p-3 rounded-full bg-primary/10">
                <FiThermometer className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold">{weather.temp_c}°C</p>
                <p className="text-xs text-muted-foreground">Temperature</p>
              </div>
            </motion.div>
            <motion.div 
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="p-3 rounded-full bg-primary/10">
                <FiWind className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold">{weather.wind_kph} km/hr</p>
                <p className="text-xs text-muted-foreground">Wind Speed</p>
              </div>
            </motion.div>
            <motion.div 
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="p-3 rounded-full bg-primary/10">
                <WeatherIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold">{weather.condition.text}</p>
                <p className="text-xs text-muted-foreground">Condition</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
