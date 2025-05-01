'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FiCloud, FiSun, FiWind } from 'react-icons/fi';

const LoadingWeather = () => {
  return (
    <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-2 border-primary/20 mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="h-8 w-32 bg-primary/10 rounded-md animate-pulse" />
            <div className="h-6 w-48 bg-primary/10 rounded-md animate-pulse" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-primary/10 animate-pulse">
                <FiSun className="w-6 h-6 text-primary/50" />
              </div>
              <div className="h-4 w-16 bg-primary/10 rounded-md animate-pulse" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-primary/10 animate-pulse">
                <FiWind className="w-6 h-6 text-primary/50" />
              </div>
              <div className="h-4 w-16 bg-primary/10 rounded-md animate-pulse" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-primary/10 animate-pulse">
                <FiCloud className="w-6 h-6 text-primary/50" />
              </div>
              <div className="h-4 w-16 bg-primary/10 rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingWeather;
