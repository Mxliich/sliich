"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/lib/supabase-provider"
import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageSquare, Share2, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface MessagesPanelProps {
  user: User | null
}

interface Message {
  id: string
  content: string
  created_at: string
  is_read: boolean
  is_answered: boolean
}

export function MessagesPanel({ user }: MessagesPanelProps) {
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
  if (!user) {
    return; // Exit early, implicitly returns undefined
  }

  async function fetchMessages() {
    setLoading(true);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("recipient_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching messages",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setMessages(data || []);
    setLoading(false);
  }

  fetchMessages();
}, [user, supabase, toast]); // Include all dependencies

      // Mark unread messages as read
      const unreadMessages = data?.filter((msg) => !msg.is_read).map((msg) => msg.id) || []
      if (unreadMessages.length > 0) {
        await supabase.from("messages").update({ is_read: true }).in("id", unreadMessages)
      }
    }

    fetchMessages()

    // Subscribe to new messages
    const channel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          setMessages((prev) => [payload.new as Message, ...prev])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, user, toast])

  const handleDeleteMessage = async (id: string) => {
    const { error } = await supabase.from("messages").delete().eq("id", id)

    if (error) {
      toast({
        title: "Error deleting message",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    setMessages(messages.filter((msg) => msg.id !== id))
    toast({
      title: "Message deleted",
      description: "The message has been deleted successfully.",
    })
  }

  const filteredMessages = messages.filter((message) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !message.is_read
    if (activeTab === "answered") return message.is_answered
    return true
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
        <Button>
          <Share2 className="mr-2 h-4 w-4" />
          Share Link
        </Button>
      </div>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Messages</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="answered">Answered</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredMessages.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-semibold">No messages yet</h3>
                <p className="text-muted-foreground">Share your Sliich link to start receiving anonymous messages.</p>
                <Button className="mt-4">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Link
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <Card key={message.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-muted-foreground">
                        Anonymous • {formatDate(message.created_at)}
                      </CardTitle>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteMessage(message.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg">{message.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Heart className="mr-2 h-4 w-4" />
                        Like
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Reply
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

