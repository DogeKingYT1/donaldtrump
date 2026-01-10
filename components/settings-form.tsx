"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload } from "lucide-react"
import type { Profile } from "@/lib/types"

interface SettingsFormProps {
  profile: Profile | null
  userEmail: string
}

export function SettingsForm({ profile, userEmail }: SettingsFormProps) {
  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const { error } = await supabase
      .from("profiles")
      .update({ 
        display_name: displayName, 
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString() 
      })
      .eq("id", profile?.id)

    if (error) {
      setMessage({ type: "error", text: error.message })
    } else {
      setMessage({ type: "success", text: "Profile updated successfully" })
      router.refresh()
    }
    setIsLoading(false)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please select an image file" })
      return
    }

    setIsUploading(true)
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${profile?.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)
      setAvatarUrl(data.publicUrl)
      setMessage({ type: "success", text: "Avatar uploaded successfully" })
    } catch (err) {
      console.error(err)
      setMessage({ type: "error", text: "Failed to upload avatar" })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-4">
              <Label>Profile Picture</Label>
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-muted">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploading ? "Uploading..." : "Change Avatar"}
                  </Button>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={userEmail} disabled />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </div>
            {message && (
              <p className={`text-sm ${message.type === "error" ? "text-destructive" : "text-green-600"}`}>
                {message.text}
              </p>
            )}
            <Button type="submit" disabled={isLoading || isUploading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Sign Out</h4>
            <p className="text-sm text-muted-foreground mb-4">Sign out of your account on this device</p>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
