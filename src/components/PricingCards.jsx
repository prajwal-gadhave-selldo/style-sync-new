"use client";
import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import {
  CheckCircle2,
  Sparkles,
  Zap,
  Shield,
  Cloud,
  Users,
} from "lucide-react";

const PricingCards = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [billingCycle, setBillingCycle] = useState("monthly");

  const pricingPlans = [
    {
      id: 1,
      title: "Free Plan",
      description: "Perfect for getting started",
      price: {
        monthly: "$0",
        yearly: "$0",
      },
      features: [
        { icon: <Cloud className="h-4 w-4" />, text: "Up to 20 uploads" },
        { icon: <Zap className="h-4 w-4" />, text: "Basic outfit suggestions" },
        { icon: <Users className="h-4 w-4" />, text: "Community access" },
        {
          icon: <Shield className="h-4 w-4" />,
          text: "No credit card required",
        },
      ],
      popular: false,
      gradient: "from-blue-500/20 to-cyan-400/20",
      buttonText: "Get Started",
      buttonColor: "bg-primary/10 text-primary hover:bg-primary/20",
      onClick: () =>
        signIn(["google", "credentials"], { callbackUrl: "/dashboard" }),
    },
    {
      id: 2,
      title: "Pro Plan",
      description: "Unlock the full experience",
      price: {
        monthly: "$10",
        yearly: "$99",
      },
      savings: "Save $21 annually",
      features: [
        { icon: <Cloud className="h-4 w-4" />, text: "Unlimited uploads" },
        {
          icon: <Sparkles className="h-4 w-4" />,
          text: "AI-powered outfit suggestions",
        },
        { icon: <Zap className="h-4 w-4" />, text: "Priority support" },
        { icon: <Users className="h-4 w-4" />, text: "Advanced analytics" },
        { icon: <Shield className="h-4 w-4" />, text: "Cancel anytime" },
      ],
      popular: true,
      gradient: "from-primary/30 to-purple-500/30",
      buttonText: "Get Pro Access",
      buttonColor:
        "bg-gradient-to-r from-primary to-purple-600 text-white hover:opacity-90",
      onClick: () =>
        signIn(["google", "credentials"], { callbackUrl: "/dashboard" }),
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative pb-20 pt-16 overflow-hidden"
      id="pricing"
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Simple Pricing,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              Powerful Features
            </span>
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Choose the perfect plan that fits your needs. No hidden fees or
            surprises.
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            className="inline-flex items-center justify-center p-1 bg-muted rounded-full mb-12"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`relative px-6 py-2 text-sm rounded-full transition-all ${
                billingCycle === "monthly"
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              Monthly
              {billingCycle === "monthly" && (
                <motion.div
                  className="absolute inset-0 bg-card shadow-sm rounded-full -z-10"
                  layoutId="billingTabActive"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`relative px-6 py-2 text-sm rounded-full transition-all ${
                billingCycle === "yearly"
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              Yearly
              {billingCycle === "yearly" && (
                <motion.div
                  className="absolute inset-0 bg-card shadow-sm rounded-full -z-10"
                  layoutId="billingTabActive"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </button>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className="relative rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
              whileHover={{ translateY: -8, transition: { duration: 0.2 } }}
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-border/80 to-border/20 rounded-2xl p-[1px]">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-40 rounded-2xl`}
                ></div>
                <div className="absolute inset-[1px] bg-card rounded-2xl"></div>
              </div>

              {/* Content */}
              <div className="relative p-8">
                {plan.popular && (
                  <div className="absolute top-0 right-0 -mt-1 -mr-1">
                    <div className="bg-gradient-to-r from-primary to-purple-500 text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg font-medium flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> MOST POPULAR
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={billingCycle}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold">
                          {plan.price[billingCycle]}
                        </span>
                        <span className="text-muted-foreground ml-1">
                          /{billingCycle === "monthly" ? "month" : "year"}
                        </span>
                      </div>
                      {plan.savings && billingCycle === "yearly" && (
                        <div className="mt-2 text-sm text-primary font-medium">
                          {plan.savings}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mb-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: { delay: 0.3 + i * 0.1 },
                        }}
                      >
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          {feature.icon}
                        </div>
                        <span className="text-sm">{feature.text}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <motion.button
                  className={`w-full py-3 px-4 rounded-lg font-medium ${plan.buttonColor} transition-all shadow-sm`}
                  onClick={plan.onClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.buttonText}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingCards;
