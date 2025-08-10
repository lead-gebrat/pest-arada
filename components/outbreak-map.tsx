"use client"

import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { useI18n } from "@/components/i18n/i18n"

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false })
const CircleMarker = dynamic(() => import("react-leaflet").then((m) => m.CircleMarker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false })
import "leaflet/dist/leaflet.css"

type Props = { accent?: string }

type Outbreak = {
  id: string
  name: string
  crop: string
  type: string
  severity: "low" | "medium" | "high"
  lat: number
  lng: number
}

const SAMPLE: Outbreak[] = [
  { id: "1", name: "Kisumu", crop: "Maize", type: "Fall Armyworm", severity: "high", lat: -0.0917, lng: 34.768 },
  { id: "2", name: "Nakuru", crop: "Wheat", type: "Leaf Rust", severity: "medium", lat: -0.3031, lng: 36.08 },
  { id: "3", name: "Eldoret", crop: "Beans", type: "Aphids", severity: "low", lat: 0.5204, lng: 35.2698 },
  { id: "4", name: "Nyeri", crop: "Potato", type: "Late Blight", severity: "high", lat: -0.4174, lng: 36.9516 },
]

export default function OutbreakMap({ accent = "#255957" }: Props) {
  const { t } = useI18n()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const center = useMemo<[number, number]>(() => [0.0236, 37.9062], [])
  const sevColor = (s: Outbreak["severity"]) => (s === "high" ? "#ef4444" : s === "medium" ? "#f59e0b" : "#10b981")

  if (!mounted) {
    return (
      <Card
        className="h-[420px] w-full rounded-xl overflow-hidden border"
        style={{ borderColor: "rgba(37,89,87,0.2)" }}
      >
        <div className="h-full w-full flex items-center justify-center text-sm text-gray-500">{t("loadingMap")}</div>
      </Card>
    )
  }

  return (
    <Card className="h-[420px] w-full rounded-xl overflow-hidden border" style={{ borderColor: "rgba(37,89,87,0.2)" }}>
      <MapContainer center={center} zoom={6} className="h-full w-full" style={{ outline: "none" }}>
        <TileLayer attribution="© OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {SAMPLE.map((o) => (
          <CircleMarker
            key={o.id}
            center={[o.lat, o.lng]}
            radius={12}
            pathOptions={{ color: "white", weight: 2, fillColor: sevColor(o.severity), fillOpacity: 0.85 }}
          >
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold">{o.type}</p>
                <p className="text-sm text-gray-700">
                  {o.crop} • {o.name}
                </p>
                <p className="text-xs" style={{ color: sevColor(o.severity) }}>
                  {o.severity.toUpperCase()}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </Card>
  )
}
