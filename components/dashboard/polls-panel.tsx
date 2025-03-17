"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/lib/supabase-provider"
import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Share2, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface PollsPanelProps {
  user: User | null
}

interface Poll {
  id: string
  question: string
  created_at: string
  is_active: boolean
  options: PollOption[]
  responses: PollResponse[]
}

interface PollOption {
  id: string
  poll_id: string
  option_text: string
}

interface PollResponse {
  id: string
  poll_id: string
  option_id: string
}

export function PollsPanel({ user }: PollsPanelProps) {
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [newPollQuestion, setNewPollQuestion] = useState("")
  const [newPollOptions, setNewPollOptions] = useState(["", ""])
  const [creatingPoll, setCreatingPoll] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (!user) return

    async function fetchPolls() {
      setLoading(true)

      // Fetch polls
      const { data: pollsData, error: pollsError } = await supabase
        .from("polls")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (pollsError) {
        toast({
          title: "Error fetching polls",
          description: pollsError.message,
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Fetch options for each poll
      const pollIds = pollsData?.map((poll) => poll.id) || []

      if (pollIds.length === 0) {
        setPolls([])
        setLoading(false)
        return
      }

      const { data: optionsData, error: optionsError } = await supabase
        .from("poll_options")
        .select("*")
        .in("poll_id", pollIds)

      if (optionsError) {
        toast({
          title: "Error fetching poll options",
          description: optionsError.message,
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Fetch responses for each poll
      const { data: responsesData, error: responsesError } = await supabase
        .from("poll_responses")
        .select("*")
        .in("poll_id", pollIds)

      if (responsesError) {
        toast({
          title: "Error fetching poll responses",
          description: responsesError.message,
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Combine data
      const combinedPolls = pollsData.map((poll) => {
        const options = optionsData?.filter((option) => option.poll_id === poll.id) || []
        const responses = responsesData?.filter((response) => response.poll_id === poll.id) || []

        return {
          ...poll,
          options,
          responses,
        }
      })

      setPolls(combinedPolls)
      setLoading(false)
    }

    fetchPolls()
  }, [supabase, user, toast])

  const handleCreatePoll = async () => {
    if (!user) return
    if (!newPollQuestion.trim()) {
      toast({
        title: "Question required",
        description: "Please enter a question for your poll.",
        variant: "destructive",
      })
      return
    }

    // Filter out empty options and ensure at least 2 options
    const validOptions = newPollOptions.filter((option) => option.trim() !== "")
    if (validOptions.length < 2) {
      toast({
        title: "Options required",
        description: "Please provide at least 2 options for your poll.",
        variant: "destructive",
      })
      return
    }

    setCreatingPoll(true)

    try {
      // Create poll
      const { data: pollData, error: pollError } = await supabase
        .from("polls")
        .insert({
          user_id: user.id,
          question: newPollQuestion,
          is_active: true,
        })
        .select()

      if (pollError) throw pollError

      const pollId = pollData[0].id

      // Create options
      const optionsToInsert = validOptions.map((option) => ({
        poll_id: pollId,
        option_text: option,
      }))

      const { error: optionsError } = await supabase.from("poll_options").insert(optionsToInsert)

      if (optionsError) throw optionsError

      // Fetch the created options
      const { data: createdOptions, error: fetchOptionsError } = await supabase
        .from("poll_options")
        .select("*")
        .eq("poll_id", pollId)

      if (fetchOptionsError) throw fetchOptionsError

      // Add the new poll to state
      const newPoll = {
        ...pollData[0],
        options: createdOptions,
        responses: [],
      }

      setPolls([newPoll, ...polls])

      // Reset form
      setNewPollQuestion("")
      setNewPollOptions(["", ""])
      setDialogOpen(false)

      toast({
        title: "Poll created",
        description: "Your poll has been created successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error creating poll",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setCreatingPoll(false)
    }
  }

  const handleDeletePoll = async (pollId: string) => {
    if (!user) return

    try {
      const { error } = await supabase.from("polls").delete().eq("id", pollId)

      if (error) throw error

      setPolls(polls.filter((poll) => poll.id !== pollId))

      toast({
        title: "Poll deleted",
        description: "Your poll has been deleted successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error deleting poll",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleTogglePollStatus = async (pollId: string, currentStatus: boolean) => {
    if (!user) return

    try {
      const { error } = await supabase.from("polls").update({ is_active: !currentStatus }).eq("id", pollId)

      if (error) throw error

      setPolls(polls.map((poll) => (poll.id === pollId ? { ...poll, is_active: !currentStatus } : poll)))

      toast({
        title: `Poll ${!currentStatus ? "activated" : "deactivated"}`,
        description: `Your poll has been ${!currentStatus ? "activated" : "deactivated"} successfully.`,
      })
    } catch (error: any) {
      toast({
        title: "Error updating poll",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const calculatePercentage = (optionId: string, responses: PollResponse[]) => {
    if (responses.length === 0) return 0
    const optionResponses = responses.filter((response) => response.option_id === optionId).length
    return Math.round((optionResponses / responses.length) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Polls</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Poll
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Poll</DialogTitle>
              <DialogDescription>Create a poll to gather opinions from your audience.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  value={newPollQuestion}
                  onChange={(e) => setNewPollQuestion(e.target.value)}
                  placeholder="What's your favorite color?"
                />
              </div>
              <div className="space-y-2">
                <Label>Options</Label>
                {newPollOptions.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const updatedOptions = [...newPollOptions]
                        updatedOptions[index] = e.target.value
                        setNewPollOptions(updatedOptions)
                      }}
                      placeholder={`Option ${index + 1}`}
                    />
                    {index > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updatedOptions = newPollOptions.filter((_, i) => i !== index)
                          setNewPollOptions(updatedOptions)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={() => setNewPollOptions([...newPollOptions, ""])}>
                  Add Option
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreatePoll} disabled={creatingPoll}>
                {creatingPoll ? "Creating..." : "Create Poll"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading polls...</p>
          </div>
        </div>
      ) : polls.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <PlusCircle className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">No polls yet</h3>
            <p className="text-muted-foreground">Create your first poll to gather opinions from your audience.</p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Poll
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {polls.map((poll) => (
            <Card key={poll.id} className={!poll.is_active ? "opacity-70" : undefined}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{poll.question}</CardTitle>
                    <CardDescription>Created on {formatDate(poll.created_at)}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleDeletePoll(poll.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {poll.options.map((option) => {
                  const percentage = calculatePercentage(option.id, poll.responses)
                  return (
                    <div key={option.id} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{option.option_text}</span>
                        <span>{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
                <p className="text-sm text-muted-foreground">
                  {poll.responses.length} {poll.responses.length === 1 ? "response" : "responses"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant={poll.is_active ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleTogglePollStatus(poll.id, poll.is_active)}
                >
                  {poll.is_active ? "Deactivate" : "Activate"}
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

