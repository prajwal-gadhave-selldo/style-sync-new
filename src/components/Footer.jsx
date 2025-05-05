"use client";

import React, { useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Send } from "lucide-react";

const Footer = () => {
  const { toast } = useToast();
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: "-100px" });

  const handleSubscribe = (e) => {
    e.preventDefault();
    toast({
      title: "Subscribed to newsletter!",
      description:
        "This is just a demo. The newsletter feature is not implemented yet.",
    });
  };

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "About", href: "#" },
    { name: "Features", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Contact", href: "#" },
  ];

  const resourceLinks = [
    { name: "Blog", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "Community", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ];

  const footerAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer
      ref={footerRef}
      className="relative bg-gradient-to-t from-background/90 via-muted/40 to-background/90 border-t border-border w-full pt-16 pb-8 mt-20"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full filter blur-[80px]"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full filter blur-[80px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerChildren}
        >
          {/* Brand & Newsletter */}
          <motion.div variants={childVariants} className="lg:col-span-2">
            <motion.div
              variants={childVariants}
              className="flex items-center mb-4"
            >
              <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                StyleSync
              </div>
            </motion.div>
            <motion.p
              variants={childVariants}
              className="text-muted-foreground mb-6 max-w-md"
            >
              StyleSync helps you organize your wardrobe, create stunning
              outfits, and stay on top of fashion trends.
            </motion.p>
            <motion.form
              variants={childVariants}
              onSubmit={handleSubscribe}
              className="flex gap-2 max-w-sm"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background/80 backdrop-blur-sm border-primary/20 focus:border-primary/50 shadow-sm"
                required
              />
              <Button
                type="submit"
                size="sm"
                className="bg-gradient-to-r from-primary to-purple-600 dark:from-black dark:to-purple-600 text-white font-medium shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5"
              >
                <span className="hidden sm:inline">Subscribe</span>
                <Send size={16} />
              </Button>
            </motion.form>
          </motion.div>

          {/* Navigation Links */}
          <motion.div variants={childVariants}>
            <motion.h3
              variants={childVariants}
              className="font-semibold text-lg mb-4"
            >
              Navigation
            </motion.h3>
            <motion.ul variants={staggerChildren} className="space-y-3">
              {navLinks.map((link) => (
                <motion.li key={link.name} variants={childVariants}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div variants={childVariants}>
            <motion.h3
              variants={childVariants}
              className="font-semibold text-lg mb-4"
            >
              Resources
            </motion.h3>
            <motion.ul variants={staggerChildren} className="space-y-3">
              {resourceLinks.map((link) => (
                <motion.li key={link.name} variants={childVariants}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="border-t border-border/60 pt-6 mt-10 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <p>© {new Date().getFullYear()} StyleSync. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
