import { Hero } from '#public/ui/components/hero'
import { SiteNavbar } from '#public/ui/components/site_navbar'

export default function PublicIndexPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteNavbar />
      <main>
        <Hero />
      </main>
    </div>
  )
}
