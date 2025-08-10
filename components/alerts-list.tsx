"use client"

import { useMemo, useState } from "react"
import { BellRing, CheckCircle2, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useI18n } from "@/components/i18n/i18n"

type Props = { accent?: string }

type Alert = {
  id: string
  title: string
  region: string
  crop: string
  time: string
  severity: "low" | "medium" | "high"
  unread?: boolean
}

const DATA: Alert[] = [
  {
    id: "1",
    title: "Fall Armyworm detected",
    region: "Kisumu",
    crop: "Maize",
    time: "10m ago",
    severity: "high",
    unread: true,
  },
  {
    id: "2",
    title: "Leaf rust risk ↑",
    region: "Nakuru",
    crop: "Wheat",
    time: "1h ago",
    severity: "medium",
    unread: true,
  },
  { id: "3", title: "Aphids trending", region: "Eldoret", crop: "Beans", time: "3h ago", severity: "low" },
  { id: "4", title: "Late blight nearby", region: "Nyeri", crop: "Potato", time: "Yesterday", severity: "high" },
]

export default function AlertsList({ accent = "#255957" }: Props) {
  const { t } = useI18n()
  const [showUnread, setShowUnread] = useState(false)
  const [severity, setSeverity] = useState<"all" | Alert["severity"]>("all")

  const filtered = useMemo(() => {
    return DATA.filter((a) => (showUnread ? a.unread : true)).filter((a) =>
      severity === "all" ? true : a.severity === severity,
    )
  }, [showUnread, severity])

  const sevColor = (s: Alert["severity"]) => (s === "high" ? "#ef4444" : s === "medium" ? "#f59e0b" : "#10b981")

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
          style={{ borderColor: "rgba(37,89,87,0.2)" }}
        >
          <Filter className="h-4 w-4 text-gray-600" />
          <span className="text-gray-700">{t("filters")}</span>
        </div>
        <Button
          variant={severity === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSeverity("all")}
          style={{
            background: severity === "all" ? accent : undefined,
            color: severity === "all" ? "white" : undefined,
            borderColor: accent,
          }}
        >
          {t("all")}
        </Button>
        {(["high", "medium", "low"] as const).map((s) => (
          <Button
            key={s}
            variant={severity === s ? "default" : "outline"}
            size="sm"
            onClick={() => setSeverity(s)}
            style={{
              background: severity === s ? sevColor(s) : undefined,
              color: severity === s ? "white" : undefined,
              borderColor: sevColor(s),
            }}
          >
            {s}
          </Button>
        ))}
        <div className="ml-auto flex items-center gap-2 text-sm text-gray-700">
          <Switch checked={showUnread} onCheckedChange={setShowUnread} />
          {t("unread")}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((a) => (
          <Card key={a.id} className="border" style={{ borderColor: "rgba(37,89,87,0.2)" }}>
            <CardContent className="p-4 flex items-start gap-3">
              <div
                className="mt-0.5 h-9 w-9 rounded-full flex items-center justify-center"
                style={{ background: "rgba(37,89,87,0.08)", color: accent }}
              >
                {a.unread ? <BellRing className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{a.title}</p>
                  <Badge style={{ background: sevColor(a.severity), color: "white" }}>{a.severity.toUpperCase()}</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {a.crop} • {a.region}
                </p>
                <p className="text-xs text-gray-500">{a.time}</p>
              </div>
              {a.unread && (
                <Badge variant="outline" style={{ borderColor: accent, color: accent }}>
                  {t("new")}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
