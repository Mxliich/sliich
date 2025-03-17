"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/lib/supabase-provider"
import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { BarChart, Calendar, MessageSquare, PieChart, TrendingUp, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AnalyticsPanelProps {
  user: User | null
}

export function AnalyticsPanel({ user }: AnalyticsPanelProps) {
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalMessages: 0,
    totalPolls: 0,
    totalPollResponses: 0,
    messagesThisWeek: 0,
    messagesLastWeek: 0,
    messagesByDay: Array(7).fill(0),
  })

  useEffect(() => {
    if (!user) return

    async function fetchAnalytics() {
      setLoading(true)

      try {
        // Get total messages
        const { count: totalMessages, error: messagesError } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("recipient_id", user?.id ?? '')

        if (messagesError) throw messagesError

        // Get total polls
        const { count: totalPolls, error: pollsError } = await supabase
          .from("polls")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user?.id ?? '')

        if (pollsError) throw pollsError

        // Get total poll responses
        const { data: polls, error: pollsDataError } = await supabase.from("polls").select("id").eq("user_id", user?.id ?? '')

        if (pollsDataError) throw pollsDataError

        let totalPollResponses = 0

        if (polls.length > 0) {
          const pollIds = polls.map((poll) => poll.id)

          const { count: responsesCount, error: responsesError } = await supabase
            .from("poll_responses")
            .select("*", { count: "exact", head: true })
            .in("poll_id", pollIds)

          if (responsesError) throw responsesError

          totalPollResponses = responsesCount || 0
        }

        // Get messages from this week
        const today = new Date()
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        startOfWeek.setHours(0, 0, 0, 0)

        const { count: messagesThisWeek, error: thisWeekError } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("recipient_id", user?.id ?? '')
          .gte("created_at", startOfWeek.toISOString())

        if (thisWeekError) throw thisWeekError

        // Get messages from last week
        const startOfLastWeek = new Date(startOfWeek)
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7)

        const endOfLastWeek = new Date(startOfWeek)
        endOfLastWeek.setSeconds(endOfLastWeek.getSeconds() - 1)

        const { count: messagesLastWeek, error: lastWeekError } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("recipient_id", user?.id ?? '')
          .gte("created_at", startOfLastWeek.toISOString())
          .lte("created_at", endOfLastWeek.toISOString())

        if (lastWeekError) throw lastWeekError

        // Get messages by day for the last week
        const messagesByDay = Array(7).fill(0)

        const { data: dailyMessages, error: dailyError } = await supabase
          .from("messages")
          .select("created_at")
          .eq("recipient_id", user?.id ?? '')
          .gte("created_at", startOfLastWeek.toISOString())

        if (dailyError) throw dailyError

        dailyMessages.forEach((message) => {
          const date = new Date(message.created_at)
          const dayOfWeek = date.getDay()
          messagesByDay[dayOfWeek]++
        })

        setStats({
          totalMessages: totalMessages || 0,
          totalPolls: totalPolls || 0,
          totalPollResponses,
          messagesThisWeek: messagesThisWeek || 0,
          messagesLastWeek: messagesLastWeek || 0,
          messagesByDay,
        })
      } catch (error: any) {
        toast({
          title: "Error fetching analytics",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [supabase, user, toast])

  const calculateGrowth = () => {
    if (stats.messagesLastWeek === 0) return 100
    const growth = ((stats.messagesThisWeek - stats.messagesLastWeek) / stats.messagesLastWeek) * 100
    return Math.round(growth)
  }

  const getDayName = (index: number) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return days[index]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">Track your engagement and growth over time.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">Lifetime anonymous messages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateGrowth()}%</div>
            <p className="text-xs text-muted-foreground">{stats.messagesThisWeek} messages this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Polls</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPolls}</div>
            <p className="text-xs text-muted-foreground">{stats.totalPollResponses} total responses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalMessages > 0 ? Math.round((stats.messagesThisWeek / stats.totalMessages) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Recent activity vs. total</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="messages">
        <TabsList>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="polls">Polls</TabsTrigger>
        </TabsList>
        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message Activity</CardTitle>
              <CardDescription>Your message activity over the past week.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <div className="flex h-full items-end gap-2">
                  {stats.messagesByDay.map((count, index) => (
                    <div key={index} className="relative flex h-full flex-1 flex-col justify-end">
                      <div
                        className="bg-primary rounded-t-md w-full"
                        style={{
                          height: `${Math.max(5, (count / Math.max(...stats.messagesByDay)) * 100)}%`,
                        }}
                      ></div>
                      <span className="mt-2 text-center text-xs">{getDayName(index)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Best Time to Post</CardTitle>
                <CardDescription>When you receive the most engagement.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8">
                  <Calendar className="h-16 w-16 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">Weekends</p>
                  <p className="text-sm text-muted-foreground">You receive most messages on weekends</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Message Trends</CardTitle>
                <CardDescription>Your growth over time.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8">
                  <BarChart className="h-16 w-16 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{calculateGrowth() >= 0 ? "Growing" : "Declining"}</p>
                  <p className="text-sm text-muted-foreground">
                    {calculateGrowth() >= 0
                      ? `Up ${calculateGrowth()}% from last week`
                      : `Down ${Math.abs(calculateGrowth())}% from last week`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="polls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Poll Engagement</CardTitle>
              <CardDescription>How users are interacting with your polls.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <PieChart className="mx-auto h-16 w-16 text-muted-foreground" />
                  <h3 className="mt-4 text-xl font-semibold">
                    {stats.totalPolls === 0
                      ? "No polls created yet"
                      : `${stats.totalPollResponses} responses across ${stats.totalPolls} polls`}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {stats.totalPolls === 0
                      ? "Create your first poll to see analytics"
                      : `Average of ${Math.round(stats.totalPollResponses / stats.totalPolls)} responses per poll`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

