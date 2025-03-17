"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase-provider"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { MessagesPanel } from "@/components/dashboard/messages-panel"
import { ProfilePanel } from "@/components/dashboard/profile-panel"
import { PollsPanel } from "@/components/dashboard/polls-panel"
import { SettingsPanel } from "@/components/dashboard/settings-panel"
import { AnalyticsPanel } from "@/components/dashboard/analytics-panel"
import type { User } from "@supabase/supabase-js"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("messages")

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      setUser(user)
      setLoading(false)
    }

    getUser()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />
      <div className="flex flex-1">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="hidden">
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="polls">Polls</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="messages" className="mt-0">
              <MessagesPanel user={user} />
            </TabsContent>
            <TabsContent value="profile" className="mt-0">
              <ProfilePanel user={user} />
            </TabsContent>
            <TabsContent value="polls" className="mt-0">
              <PollsPanel user={user} />
            </TabsContent>
            <TabsContent value="analytics" className="mt-0">
              <AnalyticsPanel user={user} />
            </TabsContent>
            <TabsContent value="settings" className="mt-0">
              <SettingsPanel user={user} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

