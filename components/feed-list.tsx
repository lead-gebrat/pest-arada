"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Props = { accent?: string }

export default function FeedList({ accent = "#255957" }: Props) {
  const posts = [
    {
      id: "p1",
      title: "Biocontrol spotlight: Trichoderma vs. soil pathogens",
      summary: "A quick guide to deploying Trichoderma for smallholders.",
      tag: "Best Practice",
      time: "2h ago",
      image: "/biocontrol-illustration.png",
    },
    {
      id: "p2",
      title: "Weather window: High humidity tonight",
      summary: "Increase scouting for blight between 4–7am. Vent if under covers.",
      tag: "Weather",
      time: "5h ago",
      image: "/weather-humidity-fields.png",
    },
    {
      id: "p3",
      title: "Market note: Maize prices up 6%",
      summary: "Consider staggered harvest for marginal gains.",
      tag: "Market",
      time: "Yesterday",
      image: "/maize-market-graph.png",
    },
  ]

  return (
    <div className="space-y-4">
      {posts.map((p) => (
        <Card key={p.id} className="overflow-hidden border" style={{ borderColor: "rgba(37,89,87,0.2)" }}>
          <Image
            src={p.image || "/placeholder.svg"}
            alt={p.title}
            width={1200}
            height={400}
            className="h-40 w-full object-cover"
          />
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" style={{ background: "rgba(37,89,87,0.08)", color: accent }}>
                {p.tag}
              </Badge>
              <span className="text-xs text-gray-500">{p.time}</span>
            </div>
            <h3 className="font-semibold text-base">{p.title}</h3>
            <p className="text-sm text-gray-700">{p.summary}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
