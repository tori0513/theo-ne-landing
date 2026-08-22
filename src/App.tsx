import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import WhatWeDoSection from "@/components/sections/WhatWeDoSection";
import ProductSection from "@/components/sections/ProductSection";
import FounderSection from "@/components/sections/FounderSection";
import HistorySection from "@/components/sections/HistorySection";
import FaqSection from "@/components/sections/FaqSection";
import CorporateInfoSection from "@/components/sections/CorporateInfoSection";
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-cream font-sans text-charcoal [font-variant-numeric:tabular-nums]">
      <div className="mx-auto flex max-w-[840px] flex-col gap-12 px-6 py-9 md:gap-14 md:py-14">
        <Navbar />
        <main className="flex flex-col gap-12 md:gap-14">
          <HeroSection />
          <WhatWeDoSection />
          <ProductSection />
          <FounderSection />
          <HistorySection />
          <FaqSection />
          <CorporateInfoSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
