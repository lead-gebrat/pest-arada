"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/components/auth/auth-context"

type Props = { accent?: string }

export default function Profile({ accent = "#255957" }: Props) {
  const { user, getUserStore, updateUserStore } = useAuth()
  const [name, setName] = useState(user?.fullName || "")
  const [region, setRegion] = useState("")
  const [crops, setCrops] = useState("Maize, Wheat")
  const [alerts, setAlerts] = useState(true)
  const [photo, setPhoto] = useState<string | undefined>(user?.photo)

  useEffect(() => {
    if (user?.email) {
      const stored = getUserStore(user.email)
      if (stored) {
        setRegion(stored.location || "")
        setName(stored.fullName || name)
        setPhoto(stored.photo || photo)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email])

  const onFile = (file?: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhoto(reader.result as string)
    reader.readAsDataURL(file)
  }

  const save = () => {
    if (!user?.email) return
    updateUserStore(user.email, { fullName: name, location: region, photo })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          {photo ? (
            <AvatarImage src={photo || "/placeholder.svg"} alt="Profile" />
          ) : (
            <AvatarFallback>{name?.[0] || "U"}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <p className="font-semibold">{name || user?.email}</p>
          <p className="text-sm text-gray-600">Ultra sleek • Mobile first</p>
        </div>
      </div>

      <Card className="border" style={{ borderColor: "rgba(37,89,87,0.2)" }}>
        <CardContent className="p-4 space-y-4">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Region</Label>
            <Input value={region} onChange={(e) => setRegion(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Crops</Label>
            <Input value={crops} onChange={(e) => setCrops(e.target.value)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Critical Alerts</Label>
              <p className="text-xs text-gray-600">Send me high-severity notifications</p>
            </div>
            <Switch checked={alerts} onCheckedChange={setAlerts} />
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
              <span className="underline">Change photo</span>
            </label>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" style={{ borderColor: accent, color: accent }}>
                Cancel
              </Button>
              <Button onClick={save} style={{ background: accent, color: "white" }}>
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
