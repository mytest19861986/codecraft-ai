import { HeroSection } from "@/components/marketing/hero-section";
import { LevelsSection } from "@/components/marketing/levels-section";
import { MiniCourseVideoGrid } from "@/components/marketing/mini-course-video-grid";
import { ParentsFaqSection } from "@/components/marketing/parents-faq-section";
import { WelcomeKitSection } from "@/components/marketing/welcome-kit-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MiniCourseVideoGrid />
      <LevelsSection />
      <WelcomeKitSection />
      <ParentsFaqSection />
    </>
  );
}
