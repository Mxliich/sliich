"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useSupabase } from "@/lib/supabase-provider"
import { useState, useEffect } from "react"
import type { User } from "@supabase/supabase-js"

export function LandingHeader() {
  const { supabase } = useSupabase()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [supabase])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
              Sliich
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/features" className="transition-colors hover:text-foreground/80">
            Features
          </Link>
          <Link href="/pricing" className="transition-colors hover:text-foreground/80">
            Pricing
          </Link>
          <Link href="/about" className="transition-colors hover:text-foreground/80">
            About
          </Link>
          <Link href="/contact" className="transition-colors hover:text-foreground/80">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {!loading &&
            (user ? (
              <Button asChild variant="default">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild variant="default">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            ))}
        </div>
      </div>
    </header>
  )
}

