import React from "react";
import "../../App.css";

// Import components
import { Navigation } from "../../components/LandingPage/Navigation";
import { HeroSection } from "../../components/LandingPage/HeroSection";
import { ProjectsSection } from "../../components/LandingPage/ProjectsSection";
import { AboutSection } from "../../components/LandingPage/AboutSection";
import { ContactSectionWrapper } from "../../components/LandingPage/ContactSectionWrapper";
import { Footer } from "../../components/LandingPage/Footer";

/**
 * Main landing page component
 */
export const LandingPage = () => {
  const sections = ["projects", "about", "contact"];

  /**
   * Scroll to a specific section on the page
   */
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="text-[#282828] px-40 py-4 w-[100vw] bg-[#F5F5F5]"
      style={{ fontFamily: "Neue Haas Grotesk" }}
    >
      <Navigation sections={sections} onSectionClick={scrollToSection} />
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <ContactSectionWrapper />
      <Footer />
    </div>
  );
};
