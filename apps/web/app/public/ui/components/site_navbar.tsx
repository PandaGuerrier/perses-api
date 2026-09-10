import { Link } from '@adonisjs/inertia/react'
import { MenuIcon, XIcon } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@workspace/ui/components/sheet'

type NavItem = { label: string } & ({ href: string } | { route: 'internal.index' })

const NAV_ITEMS: NavItem[] = [
  { label: 'Live capture', href: '#capture' },
  { label: 'Console', route: 'internal.index' },
]

const FOCUS_RING =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'

const NAV_LINK = `text-muted-foreground transition-colors hover:text-foreground ${FOCUS_RING}`

const MENU_ROW =
  'flex h-14 items-center border-b border-b-border border-l-2 border-l-transparent px-6 text-base ' +
  'outline-none transition-colors hover:border-l-signal ' +
  'focus-visible:border-l-signal focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary'

function BrandLockup() {
  return (
    <>
      <span aria-hidden className="relative block size-6 bg-primary">
        <span className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-background" />
      </span>
      <span className="text-base font-semibold tracking-tight">Perses</span>
    </>
  )
}

function TunnelStatus({ className = '' }: { className?: string }) {
  return (
    <span
      className={`flex items-center gap-2 font-mono text-xs text-muted-foreground ${className}`}
    >
      <span aria-hidden className="size-1.5 bg-signal" />
      wg0
    </span>
  )
}

function SignInButton({ className }: { className?: string }) {
  return (
    <Button asChild className={className}>
      {/* Ferriskey answers with an external redirect, so this can't be an Inertia visit. */}
      <a href="/auth/ferriskey/redirect">Sign in</a>
    </Button>
  )
}

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6 sm:gap-8">
        <Link route="public.index" className={`flex items-center gap-3 ${FOCUS_RING}`}>
          <BrandLockup />
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {NAV_ITEMS.map((item) =>
            'href' in item ? (
              <a key={item.label} href={item.href} className={NAV_LINK}>
                {item.label}
              </a>
            ) : (
              <Link key={item.label} route={item.route} className={NAV_LINK}>
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <TunnelStatus className="hidden md:flex" />
          <SignInButton className="hidden h-9 px-4 md:inline-flex" />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2 size-10 md:hidden">
                <MenuIcon className="size-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="top"
              showCloseButton={false}
              className="max-h-svh gap-0 overflow-y-auto border-border bg-background p-0"
            >
              <SheetTitle className="sr-only">Navigation</SheetTitle>

              <div className="flex h-16 items-center justify-between border-b border-border px-6">
                <span className="flex items-center gap-3">
                  <BrandLockup />
                </span>

                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="-mr-2 size-10">
                    <XIcon className="size-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </SheetClose>
              </div>

              <nav className="flex flex-col">
                {NAV_ITEMS.map((item) =>
                  'href' in item ? (
                    <SheetClose asChild key={item.label}>
                      <a href={item.href} className={MENU_ROW}>
                        {item.label}
                      </a>
                    </SheetClose>
                  ) : (
                    <SheetClose asChild key={item.label}>
                      <Link route={item.route} className={MENU_ROW}>
                        {item.label}
                      </Link>
                    </SheetClose>
                  )
                )}
              </nav>

              <div className="flex items-center justify-between gap-4 px-6 py-5">
                <TunnelStatus />
                <SignInButton className="h-11 px-6" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
