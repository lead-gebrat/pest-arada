// components/feed-list.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Challenge = {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  imageUrl?: string;
  createdBy: { id: string; username: string };
  location?: { latitude?: number | null; longitude?: number | null };
  upvotes?: number;
  pointsNUMBER?: number;
  solutions: { id: string }[];
};

type Props = {
  accent?: string;
};

export default function FeedList({ accent = "#255957" }: Props) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API;
        if (!apiUrl) {
          throw new Error("Backend API URL is not defined");
        }
        const response = await fetch(`${apiUrl}/challenge/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add Authorization header if needed
            // Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch challenges: ${response.statusText}`);
        }

        const data: Challenge[] = await response.json();
        setChallenges(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading challenges...</p>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {challenges.length === 0 && (
        <p className="text-center text-gray-500">No challenges found.</p>
      )}
      {challenges.map((challenge) => (
        <Card
          key={challenge.id}
          className="overflow-hidden border"
          style={{ borderColor: `rgba(37, 89, 87, 0.2)` }}
        >
          <Image
            src={
              challenge.imageUrl
                ? `${process.env.NEXT_PUBLIC_BACKEND_API}${challenge.imageUrl}`
                : "/placeholder.svg"
            }
            alt={challenge.title}
            width={1200}
            height={400}
            className="h-40 w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg"; // Fallback on error
            }}
          />
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              {challenge.tags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  style={{
                    background: tag === "Outbreak" ? `rgba(255, 0, 0, 0.1)` : `rgba(37, 89, 87, 0.08)`,
                    color: tag === "Outbreak" ? "#D32F2F" : accent,
                  }}
                >
                  {tag}
                </Badge>
              ))}
              <span className="text-xs text-gray-500">
                Posted by {challenge.createdBy?.username || "Unknown"}
              </span>
            </div>
            <h3 className="font-semibold text-base">{challenge.title}</h3>
            <p className="text-sm text-gray-700">{challenge.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Upvotes: {challenge.upvotes || 0}</span>
        
              {challenge.location &&
                typeof challenge.location.latitude === "number" &&
                typeof challenge.location.longitude === "number" && (
                  <span>
                    Location: ({challenge.location.latitude.toFixed(2)},{" "}
                    {challenge.location.longitude.toFixed(2)})
                  </span>
                )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}