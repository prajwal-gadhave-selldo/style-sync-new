"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import DarkModeSwitchCustom from "./ThemeToggler";
import { Button } from "./ui/button";

import Image from "next/image";
import { useTheme } from "next-themes";
import { PiSignOutBold } from "react-icons/pi";
import { AnimatedRibbonLogo } from "./DashboardNav";
import { useState } from "react";

const Nav = () => {
  const { data: session } = useSession();
  const { theme, resolvedTheme } = useTheme();
  const [logoHovered, setLogoHovered] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/95 dark:bg-background/80 backdrop-blur border-b border-primary/10 dark:border-primary/20 py-3 px-0">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 group"
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          <span className="w-9 h-9 flex items-center justify-center">
            <AnimatedRibbonLogo hovered={logoHovered} />
          </span>
          <div className="flex flex-col items-start ml-1">
            <span className="text-xl font-bold text-primary group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/60 group-hover:bg-clip-text group-hover:text-transparent transition-all">
              StyleSync
            </span>
            <span className="text-[12px] text-primary/60 mt-0.5 italic">
              Smarter, Faster, Better.
            </span>
          </div>
        </Link>
        <nav>
          <ul className="flex items-center space-x-4">
            <DarkModeSwitchCustom />
            {session ? (
              <li>
                <Link
                  href="/clothes"
                  className="flex items-center space-x-2 hover:bg-primary/10 dark:hover:bg-primary/20 p-2 rounded-lg transition-all"
                >
                  <div className="w-8 h-8 relative">
                    <Image
                      src={session.user?.image || "/user.svg"}
                      fill
                      alt=""
                      className="object-cover rounded-full"
                    />
                  </div>
                  <span className="font-medium">Dashboard</span>
                </Link>
              </li>
            ) : (
              <li>
                <Button
                  className="rounded-lg bg-primary/90 hover:bg-primary text-white dark:bg-slate-700/90 dark:hover:bg-slate-700 dark:text-white border-none shadow-sm hover:shadow transition-all px-4 font-medium"
                  onClick={() => {
                    signIn(["google", "credentials"], {
                      callbackUrl: "/clothes",
                    });
                  }}
                >
                  Sign in
                </Button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Nav;
