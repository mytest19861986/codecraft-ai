import { HeroSection } from "@/components/marketing/hero-section";
import { LevelsSection } from "@/components/marketing/levels-section";
import { ParentsFaqSection } from "@/components/marketing/parents-faq-section";
import { WelcomeKitSection } from "@/components/marketing/welcome-kit-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LevelsSection />
      <WelcomeKitSection />
      <ParentsFaqSection />
    </>
  );
}
