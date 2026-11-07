import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { ServicesCards } from './components/ServicesCards'
import { SkillsMarketplace } from './components/SkillsMarketplace'
import { SaaSDemoSection } from './components/SaaSDemoSection'
import { ProjectsShowcase } from './components/ProjectsShowcase'
import { InteractiveSandboxes } from './components/InteractiveSandboxes'
import { BlogSection } from './components/BlogSection'
import { AIChatWidget } from './components/AIChatWidget'
import { HireMeModal } from './components/HireMeModal'
import { CVModal } from './components/CVModal'
import { AdminDashboard } from './components/AdminDashboard'
import { Footer } from './components/Footer'
import { useLang } from './hooks/useLang'
import { useTelemetry } from './hooks/useTelemetry'

export function App() {
  const { lang, toggleLang } = useLang()
  const { visitorHash, trackEvent } = useTelemetry()

  // Modals state
  const [hireModalOpen, setHireModalOpen] = useState(false)
  const [hireModalInterest, setHireModalInterest] = useState<string | undefined>(undefined)
  const [hireModalBudget, setHireModalBudget] = useState<string | undefined>(undefined)

  const [cvModalOpen, setCvModalOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)

  const handleOpenHireModal = (interest?: string, budget?: string) => {
    setHireModalInterest(interest)
    setHireModalBudget(budget)
    setHireModalOpen(true)
    trackEvent('cta_click', interest || 'hire_general')
  }

  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text relative font-sans selection:bg-cyber-primary/30 selection:text-cyber-primary">
      {/* Top Navbar */}
      <Navbar
        lang={lang}
        onToggleLang={toggleLang}
        onOpenHireModal={handleOpenHireModal}
        onOpenCVModal={() => setCvModalOpen(true)}
      />

      {/* Main Content */}
      <main className="space-y-4">
        <Hero lang={lang} onOpenHireModal={handleOpenHireModal} />
        <ServicesCards lang={lang} onOpenHireModal={handleOpenHireModal} />
        <SkillsMarketplace lang={lang} />
        <SaaSDemoSection lang={lang} onOpenHireModal={handleOpenHireModal} />
        <ProjectsShowcase lang={lang} />
        <InteractiveSandboxes lang={lang} onOpenHireModal={() => handleOpenHireModal()} />
        <BlogSection lang={lang} />
      </main>

      {/* Floating AI Chat Assistant */}
      <AIChatWidget
        lang={lang}
        visitorHash={visitorHash}
        onOpenHireModal={() => handleOpenHireModal('chat_inquiry')}
      />

      {/* Hire / Consultation Modal */}
      <HireMeModal
        isOpen={hireModalOpen}
        onClose={() => setHireModalOpen(false)}
        lang={lang}
        initialServiceInterest={hireModalInterest}
        initialBudget={hireModalBudget}
      />

      {/* Full Curriculum / ATS CV Modal */}
      <CVModal
        isOpen={cvModalOpen}
        onClose={() => setCvModalOpen(false)}
        lang={lang}
      />

      {/* Private Admin & Telemetry Dashboard */}
      {adminOpen && (
        <AdminDashboard
          lang={lang}
          onClose={() => setAdminOpen(false)}
        />
      )}

      {/* Footer */}
      <Footer
        lang={lang}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenHireModal={() => handleOpenHireModal()}
      />
    </div>
  )
}
export default App
