"use client";

import { Navbar } from "./navbar";
import { Hero } from "./hero";
import { FormBuilderPreviewSection } from "./form-builder-preview";
import { Features } from "./features";
import { Pricing } from "./pricing";
import { Footer } from "./footer";

export function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <FormBuilderPreviewSection />
      <Features />
      <Pricing />
      <Footer />
    </>
  );
}
