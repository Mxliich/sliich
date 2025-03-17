import { HeroSection } from "sliich/components/landing/hero-section"
import { FeaturesSection } from "sliich/components/landing/features-section"
import { TestimonialsSection } from "sliich/components/landing/testimonials-section"
import { PricingSection } from "sliich/components/landing/pricing-section"
import { FooterSection } from "sliich/components/landing/footer-section"
import { LandingHeader } from "sliich/components/landing/landing-header"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
      </main>
      <FooterSection />
    </div>
  )
}

