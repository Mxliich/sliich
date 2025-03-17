"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Copy, Facebook, Instagram, Send, Twitter } from "lucide-react"

export default function SharePage() {
  const router = useRouter()
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    // Extract username from URL if present
    const pathParts = window.location.pathname.split("/")
    const usernameFromPath = pathParts[pathParts.length - 1] !== "share" ? pathParts[pathParts.length - 1] : null

    if (usernameFromPath) {
      setUsername(usernameFromPath)
      fetchProfile(usernameFromPath)
    } else {
      // Check if user is logged in
      async function checkUser() {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          // If no username in URL and no logged in user, redirect to home
          router.push("/")
          return
        }

        // Get the user's profile to get their username
        const { data, error } = await supabase.from("profiles").select("username").eq("id", user.id).single()

        if (error || !data) {
          router.push("/dashboard")
          return
        }

        setUsername(data.username)
        fetchProfile(data.username)
      }

      checkUser()
    }
  }, [supabase, router])

  const fetchProfile = async (username: string) => {
    setLoading(true)

    const { data, error } = await supabase.from("profiles").select("*").eq("username", username).single()

    if (error) {
      toast({
        title: "Profile not found",
        description: "The requested profile could not be found.",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    setProfile(data)
    setLoading(false)
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !profile) return

    setSending(true)

    try {
      const { error } = await supabase.from("messages").insert({
        recipient_id: profile.id,
        content: message,
      })

      if (error) throw error

      toast({
        title: "Message sent",
        description: "Your anonymous message has been sent successfully.",
      })

      setMessage("")
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/share/${username}`
    navigator.clipboard.writeText(shareUrl)

    toast({
      title: "Link copied",
      description: "Share link copied to clipboard.",
    })
  }

  const shareOnSocial = (platform: string) => {
    const shareUrl = `${window.location.origin}/share/${username}`
    let socialUrl = ""

    switch (platform) {
      case "twitter":
        socialUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("Send me anonymous messages on Sliich!")}`
        break
      case "facebook":
        socialUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case "instagram":
        // Instagram doesn't have a direct share URL, but we can show a toast with instructions
        toast({
          title: "Instagram Sharing",
          description: "Copy the link and share it in your Instagram bio or story.",
        })
        copyShareLink()
        return
    }

    if (socialUrl) {
      window.open(socialUrl, "_blank")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container max-w-lg py-12">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={profile.avatar_url || "/placeholder.svg?height=96&width=96"}
                    alt={profile.username}
                  />
                  <AvatarFallback>{profile.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="mt-4 text-2xl">{profile.full_name || profile.username}</CardTitle>
              <CardDescription>@{profile.username}</CardDescription>
              {profile.bio && <p className="mt-2 text-center text-sm">{profile.bio}</p>}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Send an anonymous message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your anonymous message here..."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleSendMessage} disabled={sending || !message.trim()}>
                {sending ? "Sending..." : "Send Message"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <div className="flex w-full items-center space-x-2">
                <Input readOnly value={`${window.location.origin}/share/${username}`} />
                <Button variant="outline" size="icon" onClick={copyShareLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="icon" onClick={() => shareOnSocial("twitter")}>
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Share on Twitter</span>
                </Button>
                <Button variant="outline" size="icon" onClick={() => shareOnSocial("facebook")}>
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Share on Facebook</span>
                </Button>
                <Button variant="outline" size="icon" onClick={() => shareOnSocial("instagram")}>
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Share on Instagram</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Sliich. All rights reserved.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            <a href="/" className="underline underline-offset-4">
              Home
            </a>{" "}
            |
            <a href="/privacy" className="underline underline-offset-4">
              {" "}
              Privacy
            </a>{" "}
            |
            <a href="/terms" className="underline underline-offset-4">
              {" "}
              Terms
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

