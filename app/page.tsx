import React from 'react'
import { HeroSection } from '@/components/sections/HeroSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { FreelancerSection } from '@/components/sections/FreelancerSection'
import { Footer } from '@/components/navigation/Footer'

/**
 * Página inicial do Acode Lab
 * Integra todos os componentes principais da plataforma
 */
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <FreelancerSection />
      <Footer />
    </main>
  )
}

