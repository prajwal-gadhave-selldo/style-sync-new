"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { motion } from "framer-motion";

const FrequentlyAskedQuestions = () => {
  const questions = [
    {
      id: 1,
      question: "What subscription plans do you offer?",
      answer:
        "We offer a free plan and a pro plan. The pro plan includes all features and personalized recommendations for $10/month.",
    },
    {
      id: 2,
      question: "Can I change my plan later?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. The changes will be applied to your next billing cycle.",
    },
    {
      id: 3,
      question: "Why should I upgrade to the pro plan?",
      answer:
        "The pro plan gives you access to advanced features like AI-powered outfit recommendations, unlimited clothing uploads, and priority support.",
    },
    {
      id: 4,
      question: "What is included in the free plan?",
      answer:
        "The free plan includes basic closet organization, limited outfit creation, and community access with some restrictions on uploads and features.",
    },
    {
      id: 5,
      question: "How do I cancel my subscription?",
      answer:
        "You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.",
    },
    {
      id: 6,
      question: "What happens to my uploads if I cancel?",
      answer:
        "If you cancel your pro subscription, you'll still have access to your uploads but with the limitations of the free plan.",
    },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      {questions.map((item, index) => (
        <motion.div
          key={item.id}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <AccordionItem
            value={`item-${item.id}`}
            className="border-b border-border"
          >
            <AccordionTrigger className="hover:text-primary font-medium text-left transition-all">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        </motion.div>
      ))}
    </Accordion>
  );
};

export default FrequentlyAskedQuestions;
