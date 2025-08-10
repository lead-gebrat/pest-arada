"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Camera, Loader2, Sparkles, Upload } from "lucide-react"
import { useI18n } from "@/components/i18n/i18n"

type Props = { accent?: string }

type Result = {
  label: string
  confidence: number
  severity: "low" | "medium" | "high"
  recommendations: string[]
}

const SAMPLE_RESULTS: Result[] = [
  {
    label: "Leaf Blight",
    confidence: 0.94,
    severity: "high",
    recommendations: ["Isolate affected plants", "Apply copper-based fungicide", "Avoid overhead irrigation"],
  },
  {
    label: "Early Signs of Rust",
    confidence: 0.81,
    severity: "medium",
    recommendations: ["Remove infected leaves", "Improve airflow", "Rotate fungicide modes"],
  },
  {
    label: "Aphid Infestation",
    confidence: 0.88,
    severity: "medium",
    recommendations: ["Introduce ladybugs", "Use neem oil spray", "Monitor daily"],
  },
  {
    label: "Healthy",
    confidence: 0.92,
    severity: "low",
    recommendations: ["Maintain balanced nutrition", "Continue regular scouting"],
  },
]

export default function DetectWidget({ accent = "#255957" }: Props) {
  const { t } = useI18n()
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const analyze = async () => {
    if (!file) return
    setLoading(true)
    setResult(null)
    setProgress(0)
    const tmr = setInterval(() => setProgress((p) => Math.min(100, p + 10)), 120)
    await new Promise((r) => setTimeout(r, 1400 + Math.random() * 800))
    clearInterval(tmr)
    setProgress(100)
    const r = SAMPLE_RESULTS[Math.floor(Math.random() * SAMPLE_RESULTS.length)]
    setResult(r)
    setLoading(false)
  }

  const sevText = (s: Result["severity"]) =>
    s === "high" ? t("severityHigh") : s === "medium" ? t("severityMedium") : t("severityLow")

  const sevColor = (s: Result["severity"]) => (s === "high" ? "#ef4444" : s === "medium" ? "#f59e0b" : "#10b981")

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-0 shadow-none">
        <CardHeader className="p-0">
          <div
            className="rounded-xl overflow-hidden aspect-[16/10] w-full"
            style={{ background: "linear-gradient(120deg, #e9f4f3, #ffffff)" }}
          >
            {previewUrl ? (
              <Image
                src={previewUrl || "/placeholder.svg"}
                alt="Uploaded plant"
                width={1200}
                height={750}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-center px-8">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Upload a leaf or pest photo to run demo detection. Perfect for presentations.
                  </p>
                  <p className="text-xs text-gray-500">Tip: Use capture to open your camera on mobile.</p>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                setFile(f || null)
              }}
            />
            <Button
              variant="outline"
              onClick={() => inputRef.current?.click()}
              className="gap-2"
              style={{ borderColor: accent, color: accent }}
            >
              <Upload className="h-4 w-4" />
              {t("upload")}
            </Button>
            <Button
              onClick={analyze}
              disabled={!file || loading}
              className="gap-2"
              style={{ background: accent, color: "white" }}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? t("analyzing") : t("analyze")}
            </Button>
            <Button variant="ghost" onClick={() => inputRef.current?.click()} className="ml-auto gap-2 text-gray-700">
              <Camera className="h-4 w-4" />
              {t("camera")}
            </Button>
          </div>

          {loading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500">{t("runningModel")}</p>
            </div>
          )}

          {result && (
            <div className="rounded-xl border p-4" style={{ borderColor: "rgba(37,89,87,0.2)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{result.label}</CardTitle>
                  <CardDescription>Confidence {(result.confidence * 100).toFixed(0)}%</CardDescription>
                </div>
                <Badge variant="secondary" style={{ background: sevColor(result.severity), color: "white" }}>
                  {sevText(result.severity)}
                </Badge>
              </div>
              <ul className="mt-3 list-disc pl-5 text-sm text-gray-700 space-y-1">
                {result.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" style={{ borderColor: accent, color: accent }}>
                  {t("saveResult")}
                </Button>
                <Button size="sm" style={{ background: accent, color: "white" }}>
                  {t("reportOutbreak")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
