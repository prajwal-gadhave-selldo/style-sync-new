import BentoBox from "@/components/BentoBox";
import Companies from "@/components/Companies";
import DeepDive from "@/components/DeepDive";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import PricingCards from "@/components/PricingCards";
import Review from "@/components/Review";
import Showcase from "@/components/Showcase";
import Usage from "@/components/Usage";

// https://dribbble.com/shots/23851706-Talkee-SaaS-Product-Website-Design

export default function Home() {
  return (
    <main className="bg-background">
      {/* <h2 className="text-3xl text1 ">StyleSync</h2> */}
      <Hero />
      {/* <Companies /> */}
      <Usage />
      {/* <Showcase /> */}
      <DeepDive />
      <BentoBox />
      {/* <Review /> */}
      <PricingCards />
      <FAQ />
      <Footer />
    </main>
  );
}
