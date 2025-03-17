"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSupabase } from "@/lib/supabase-provider"
import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CameraIcon, Instagram, Link2, Twitter } from "lucide-react"

interface ProfilePanelProps {
  user: User | null
}

interface Profile {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  website: string | null
}

export function ProfilePanel({ user }: ProfilePanelProps) {
  const { supabase } = useSupabase()
  const { toast } = useToast()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")
  const [website, setWebsite] = useState("")
  const [instagram, setInstagram] = useState("")
  const [twitter, setTwitter] = useState("")

  useEffect(() => {
    if (!user) return

    async function fetchProfile() {
      setLoading(true)

      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error) {
        toast({
          title: "Error fetching profile",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      setProfile(data)
      setFullName(data.full_name || "")
      setBio(data.bio || "")
      setWebsite(data.website || "")
      setAvatarUrl(data.avatar_url)
      setLoading(false)
    }

    fetchProfile()
  }, [supabase, user, toast])

  const handleUpdateProfile = async () => {
    if (!user) return

    setUpdating(true)

    const updates = {
      id: user.id,
      full_name: fullName,
      bio,
      website,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("profiles").update(updates).eq("id", user.id)

    if (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      // Update local state
      setProfile({
        ...profile!,
        ...updates,
      })
    }

    setUpdating(false)
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return
    }

    const file = event.target.files[0]
    const fileExt = file.name.split(".").pop()
    const filePath = `${user!.id}-${Math.random()}.${fileExt}`

    setUpdating(true)

    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

    if (uploadError) {
      toast({
        title: "Error uploading avatar",
        description: uploadError.message,
        variant: "destructive",
      })
      setUpdating(false)
      return
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath)

    // Update the profile with the new avatar URL
    const { error: updateError } = await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user!.id)

    if (updateError) {
      toast({
        title: "Error updating profile",
        description: updateError.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Avatar updated",
        description: "Your avatar has been updated successfully.",
      })

      setAvatarUrl(publicUrl)
      setProfile({
        ...profile!,
        avatar_url: publicUrl,
      })
    }

    setUpdating(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <Button onClick={handleUpdateProfile} disabled={updating}>
          {updating ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="edit">
        <TabsList>
          <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Upload a profile picture to personalize your account.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={avatarUrl || "/placeholder.svg?height=128&width=128"} alt={profile?.username || ""} />
                <AvatarFallback>{profile?.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                <Label htmlFor="avatar" className="cursor-pointer">
                  <div className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium">
                    <CameraIcon className="h-4 w-4" />
                    Upload Image
                  </div>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={updating}
                  />
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={profile?.username || ""} disabled />
                <p className="text-xs text-muted-foreground">Your username cannot be changed.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Connect your social media accounts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagram">
                  <div className="flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </div>
                </Label>
                <Input
                  id="instagram"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@yourusername"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">
                  <div className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </div>
                </Label>
                <Input
                  id="twitter"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="@yourusername"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage
                    src={avatarUrl || "/placeholder.svg?height=128&width=128"}
                    alt={profile?.username || ""}
                  />
                  <AvatarFallback>{profile?.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-2xl font-bold">{fullName || profile?.username}</h3>
                  <p className="text-muted-foreground">@{profile?.username}</p>
                </div>
                {bio && <p className="max-w-md text-center">{bio}</p>}
                <div className="flex gap-4">
                  {website && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={website} target="_blank" rel="noopener noreferrer">
                        <Link2 className="mr-2 h-4 w-4" />
                        Website
                      </a>
                    </Button>
                  )}
                  {instagram && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={`https://instagram.com/${instagram.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram className="mr-2 h-4 w-4" />
                        Instagram
                      </a>
                    </Button>
                  )}
                  {twitter && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={`https://twitter.com/${twitter.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter className="mr-2 h-4 w-4" />
                        Twitter
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

