"use client";

import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

const LogInBtn = () => {
  return (
    <>
      <div className="mb-5 flex w-[75%] justify-center items-center">
        <Button
          onClick={() =>
            signIn(["google", "credentials"], { callbackUrl: "/clothes" })
          }
          className="mr-5"
        >
          Get Started
        </Button>
        <p>or</p>
        <Button
          variant="outline"
          className="ml-5 z-20 cursor-pointer hover:bg-gray-400 hover:text-white transition-all delay-100 ease-in-out"
          onClick={() =>
            signIn(["google", "credentials"], { callbackUrl: "/clothes" })
          }
        >
          Login
        </Button>
      </div>
    </>
  );
};

export default LogInBtn;
