"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import { useI18n } from "@/components/i18n/i18n"

type Props = { accent?: string }

export default function SuggestionsForm({ accent = "#255957" }: Props) {
  const { t } = useI18n()
  const [crop, setCrop] = useState("Maize")
  const [stage, setStage] = useState("Vegetative")
  const [notes, setNotes] = useState("")
  const [tips, setTips] = useState<string[]>([])

  const generate = () => {
    const out: string[] = []
    if (crop === "Maize" && stage === "Vegetative") {
      out.push("Scout daily for Fall Armyworm; check whorl leaves.")
      out.push("Apply pheromone traps at field edges.")
    }
    if (crop === "Wheat") out.push("Rotate fungicide modes to prevent resistance.")
    if (stage === "Flowering") out.push("Avoid stress—irrigate early; maintain soil moisture.")
    if (notes.toLowerCase().includes("humidity")) out.push("High humidity—ventilate and avoid overhead irrigation.")
    if (out.length === 0) out.push("No specific risks detected. Follow standard IPM checklist.")
    setTips(out)
  }

  return (
    <div className="space-y-4">
      <Card className="border" style={{ borderColor: "rgba(37,89,87,0.2)" }}>
        <CardHeader>
          <CardTitle>{t("smartTips")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{t("crop")}</Label>
              <Select value={crop} onValueChange={setCrop}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("crop")} />
                </SelectTrigger>
                <SelectContent>
                  {["Maize", "Wheat", "Potato", "Beans", "Rice"].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("stage")}</Label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("stage")} />
                </SelectTrigger>
                <SelectContent>
                  {["Seedling", "Vegetative", "Flowering", "Maturity"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("notes")}</Label>
            <Textarea
              placeholder="Weather, humidity, recent observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button className="gap-2" onClick={generate} style={{ background: accent, color: "white" }}>
            <Sparkles className="h-4 w-4" />
            {t("generate")}
          </Button>
        </CardContent>
      </Card>

      {tips.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" style={{ background: "rgba(37,89,87,0.08)", color: accent }}>
              {t("recommendations")}
            </Badge>
            <span className="text-sm text-gray-600">
              {tips.length} {t("tipsCount")}
            </span>
          </div>
          <ul className="space-y-2">
            {tips.map((ttext, i) => (
              <li
                key={i}
                className="rounded-lg border p-3 text-sm text-gray-800"
                style={{ borderColor: "rgba(37,89,87,0.2)" }}
              >
                {ttext}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
