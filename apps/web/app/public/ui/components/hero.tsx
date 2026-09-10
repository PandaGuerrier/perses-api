import { useEffect, useState } from 'react'
import { Link } from '@adonisjs/inertia/react'

import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'

interface Capture {
  id: number
  time: string
  peer: string
  domain: string
  flagged: boolean
}

const FEED: Omit<Capture, 'id' | 'time'>[] = [
  { peer: '10.8.0.2', domain: 'ws.chatgpt.com', flagged: true },
  { peer: '10.8.0.3', domain: 'registry.npmjs.org', flagged: false },
  { peer: '10.8.0.4', domain: 'api.anthropic.com', flagged: true },
  { peer: '10.8.0.3', domain: 'deb.debian.org', flagged: false },
  { peer: '10.8.0.2', domain: 'gemini.google.com', flagged: true },
  { peer: '10.8.0.4', domain: 'github.com', flagged: false },
]

const VISIBLE_ROWS = 6
const TICK_MS = 3200

function clock(secondsAgo: number) {
  return new Date(Date.now() - secondsAgo * 1000).toTimeString().slice(0, 8)
}

function CapturePanel() {
  const [captures, setCaptures] = useState<Capture[]>(() =>
    Array.from({ length: VISIBLE_ROWS }, (_, index) => ({
      id: -index,
      time: clock(index * 47),
      ...FEED[index % FEED.length],
    }))
  )

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cursor = VISIBLE_ROWS
    const timer = window.setInterval(() => {
      const next = { id: cursor, time: clock(0), ...FEED[cursor % FEED.length] }
      cursor += 1
      setCaptures((current) => [next, ...current.slice(0, VISIBLE_ROWS - 1)])
    }, TICK_MS)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <div id="capture" className="border border-border bg-card scroll-mt-20">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-sm font-medium">Live capture</span>
        <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span aria-hidden className="size-1.5 bg-signal" />
          wg0
        </span>
      </div>

      <ul className="divide-y divide-border">
        {captures.map((capture) => (
          <li
            key={capture.id}
            className={cn(
              'border-l-2 px-4 py-3',
              capture.flagged ? 'border-signal' : 'border-transparent'
            )}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span
                className={cn(
                  'truncate font-mono text-sm',
                  capture.flagged ? 'text-signal' : 'text-foreground'
                )}
              >
                {capture.domain}
              </span>
              {capture.flagged && (
                <span className="shrink-0 font-mono text-xs text-signal">flagged</span>
              )}
            </div>
            <div className="mt-1 flex items-baseline justify-between gap-3 font-mono text-xs text-muted-foreground">
              <span>{capture.peer}</span>
              <span>{capture.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Hero() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl border-x border-border px-6 py-14 sm:py-16 lg:py-24">
        <div className="grid items-start gap-12 sm:gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h1 className="max-w-[13ch] text-4xl font-extrabold leading-[0.92] tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-7xl">
              Nothing leaves the tunnel unseen.
            </h1>

            <p className="mt-6 max-w-[54ch] text-base leading-relaxed text-muted-foreground sm:mt-8 sm:text-lg">
              Perses reads the WireGuard tunnel and writes down the moment a peer reaches an AI
              service. Public key, domain, second. All this, with just an app.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5 sm:mt-10">
              <Button asChild className="h-12 w-full px-6 text-sm sm:w-auto">
                <Link route="internal.index">Open the console</Link>
              </Button>
              <a
                href="/"
                className="text-sm underline decoration-primary decoration-2 underline-offset-8 transition-colors hover:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                See a detection
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <CapturePanel />
          </div>
        </div>
      </div>
    </section>
  )
}
