"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";

import { HiMenuAlt1 } from "react-icons/hi";
import { PiSignOutBold } from "react-icons/pi";
import { GiClothes } from "react-icons/gi";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";
import { MdFavoriteBorder, MdManageAccounts } from "react-icons/md";
import { usePathname } from "next/navigation";
import DarkModeSwitchCustom from "./ThemeToggler";
import { IoMdClose } from "react-icons/io";
import ProUser from "./ProUser";
import { fetchUserId } from "@/lib/fetchWeatherData";
import { useTheme } from "next-themes";

const scrambledPath = "M2 20 Q10 2 20 20 Q30 38 38 20 Q30 2 20 20 Q10 38 2 20"; // Larger, well-aligned infinity symbol
const sPath = "M0 8 Q6 32 20 20 Q34 8 40 32 Q34 8 20 20 Q6 32 0 8"; // Upright, elegant S shape

export function AnimatedRibbonLogo({ hovered }) {
  return (
    <motion.svg
      className="w-10 h-10 cursor-pointer"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d={hovered ? sPath : scrambledPath}
        initial={false}
        animate={{ d: hovered ? sPath : scrambledPath }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="stroke-primary"
      />
    </motion.svg>
  );
}

export const DashboardNav = () => {
  const [shown, setShown] = useState(false);
  const [isPro, setIsPro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { resolvedTheme } = useTheme();
  const email = session && session.user.email;
  const [logoHovered, setLogoHovered] = useState(true);

  useEffect(() => {
    if (email) {
      startTransition(() => {
        getUserData();
      });
    } else {
      setLoading(true);
    }
  }, [email]);

  const getUserData = async () => {
    try {
      setLoading(true);
      const userData = await fetchUserId(email);
      setIsPro(userData.isPro);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      startTransition(() => {
        setLoading(false);
      });
    }
  };

  const activeLink = (path) => {
    if (path === pathname || pathname.includes(path)) {
      return "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent text-primary font-medium";
    }
    return "";
  };

  const toggleSidebar = () => {
    setShown(!shown);
  };

  return (
    <>
      {!shown && (
        <motion.button
          onClick={toggleSidebar}
          className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-full bg-background/60 backdrop-blur-sm border border-primary/20 shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <HiMenuAlt1 className="w-5 h-5 text-primary" />
        </motion.button>
      )}

      <aside
        className={`md:static scrollbar-hide overflow-y-auto h-screen bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-r border-primary/20 shadow-lg transition-all duration-300 ease-in-out sidebar ${
          shown ? "shown" : ""
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0 relative overflow-y-auto">
          {/* Background effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.05),rgba(255,255,255,0))]" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(120,119,198,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_8s_linear_infinite]" />

          {/* Mobile close button */}
          <motion.button
            onClick={toggleSidebar}
            className="md:hidden absolute top-3 right-3 p-2 rounded-full bg-background/60 backdrop-blur-sm border border-primary/20 shadow-md z-10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IoMdClose className="w-4 h-4 text-primary" />
          </motion.button>

          {/* Animated Ribbon-to-S Logo Section */}
          <div className="py-6 border-b border-primary/10 relative">
            <div className="flex justify-center items-center">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 group"
                onMouseEnter={() => setLogoHovered(true)}
                onMouseLeave={() => setLogoHovered(false)}
              >
                {/* Animated ribbon morphing to S on hover */}
                <AnimatedRibbonLogo hovered={logoHovered} />
                {/* Logotype and Tagline */}
                <div className="flex flex-col items-start ml-1">
                  <span className="text-lg font-bold text-primary group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/60 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                    StyleSync
                  </span>
                  <span className="text-[12px] text-primary/60 mt-0.5 italic">
                    Smarter, Faster, Better.
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Navigation and content */}
          <div className="flex-1 flex flex-col justify-between p-3 relative z-10">
            <div className="space-y-1 my-2">
              <Link href="/clothes" onClick={toggleSidebar}>
                <motion.div
                  className={`p-3 rounded-xl flex items-center gap-3 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/10 hover:via-primary/5 hover:to-transparent ${activeLink(
                    "/clothes"
                  )}`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10">
                    <GiClothes className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">Closet</span>
                </motion.div>
              </Link>

              <Link href="/favorites" onClick={toggleSidebar}>
                <motion.div
                  className={`p-3 rounded-xl flex items-center gap-3 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/10 hover:via-primary/5 hover:to-transparent ${activeLink(
                    "/favorites"
                  )}`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10">
                    <MdFavoriteBorder className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">Favorites</span>
                </motion.div>
              </Link>

              <Link href="/outfit" onClick={toggleSidebar}>
                <motion.div
                  className={`p-3 rounded-xl flex items-center gap-3 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/10 hover:via-primary/5 hover:to-transparent ${activeLink(
                    "/outfit"
                  )}`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10">
                    <HiOutlineViewfinderCircle className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">Find Outfit</span>
                </motion.div>
              </Link>

              <Link href="/dashboard" onClick={toggleSidebar}>
                <motion.div
                  className={`p-3 rounded-xl flex items-center gap-3 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/10 hover:via-primary/5 hover:to-transparent ${activeLink(
                    "/dashboard"
                  )}`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10">
                    <MdManageAccounts className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">Account</span>
                </motion.div>
              </Link>
            </div>

            {/* Settings & Account Section */}
            <div className="mt-2 mb-4 px-2 py-4 rounded-2xl bg-gradient-to-br from-background/80 via-primary/5 to-background/90 border border-primary/10 shadow-sm flex flex-col gap-3">
              <span className="text-xs font-semibold text-primary/50 tracking-widest uppercase mb-1 ml-2">
                Settings & Account
              </span>
              {/* Theme toggle */}
              <motion.div
                className="relative p-3 rounded-xl overflow-hidden bg-background/80"
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-xl" />
                <div className="flex items-center justify-between relative z-10">
                  <span className="font-medium">Dark Mode</span>
                  <DarkModeSwitchCustom />
                </div>
              </motion.div>
              <div className="my-1 border-t border-primary/10" />
              {/* Pro user */}
              {isPro === false && (
                <motion.div
                  className="mb-2 border-l-4 border-primary/60 bg-primary/5 rounded-xl p-3 flex flex-col gap-1 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-xs font-bold text-primary/80 mb-1">
                    Upgrade to Pro
                  </span>
                  <ProUser
                    email={email}
                    loading={loading}
                    isPending={isPending}
                  />
                </motion.div>
              )}
              <div className="my-1 border-t border-primary/10" />
              {/* Sign out */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full relative overflow-hidden group border border-destructive text-destructive hover:bg-destructive hover:text-background transition-all"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.08)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_8s_linear_infinite]" />
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    <PiSignOutBold className="w-4 h-4" />
                    <span>Sign out</span>
                  </div>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {shown && (
        <motion.div
          className="md:hidden fixed inset-0 bg-background/40 backdrop-blur-sm z-9999"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};
