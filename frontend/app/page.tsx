'use client'

import { Navbar } from '@/components/navbar'
import { SnapshotCards } from '@/components/sections/snapshot-cards'
import { DrivesOverTimeSection } from '@/components/sections/drives-over-time-section'
import { WeeklySummaryTable } from '@/components/sections/weekly-summary-table'
import { CtcIntelligenceSection } from '@/components/sections/ctc-intelligence-section'
import { CompanyIntelligenceSection } from '@/components/sections/company-intelligence-section'
import { AllCompaniesTable } from '@/components/sections/all-companies-table'
import { DocumentExplorer } from '@/components/document-explorer'

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background">
        {/* Dashboard Container */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 space-y-8">
          {/* Section 1: Snapshot (KPI Cards) */}
          <section className="space-y-4">
            <SnapshotCards />
          </section>

          {/* Section 2: Drives Over Time */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Placement Drives</h2>
            <DrivesOverTimeSection />
          </section>

          {/* Section 3: Weekly Summary */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Weekly Summary</h2>
            <WeeklySummaryTable />
          </section>

          {/* Section 4: CTC Intelligence */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">CTC Info</h2>
            <CtcIntelligenceSection />
          </section>

          {/* Section 5: Company Intelligence */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Company Info</h2>
            <CompanyIntelligenceSection />
          </section>

          {/* Section 6: All Companies */}
          <section className="space-y-2">
            <h2 className="text-2xl font-bold text-white">All Companies</h2>
            <h3 className="text-sm text-muted-foreground ">*some repetitions</h3>
            <AllCompaniesTable />
          </section>

          {/* Document Explorer */}
          <section className="space-y-4">
            <DocumentExplorer />
          </section>
        </div>
      </main>
    </>
  )
}
