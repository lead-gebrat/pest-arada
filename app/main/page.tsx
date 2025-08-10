"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Map, Newspaper, User, Wand2, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import AlertsList from "@/components/alerts-list";
import FeedList from "@/components/feed-list";
import OutbreakMap from "@/components/outbreak-map";
import SuggestionsForm from "@/components/suggestions-form";
import Profile from "@/components/profile";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useI18n } from "@/components/i18n/i18n";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import Image from "next/image";

type TabKey = "detect" | "alerts" | "feed" | "map" | "suggestions" | "profile";
const ACCENT = "#255957";

interface User {
  id: string;
  name: string;
  points?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  profileUrl?: string;
  email: string;
  phone: string;
}

interface DecodedToken {
  id: string;
  username: string;
}

export default function PlatformPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("detect");
  const [user, setUser] = useState<User | null>(null);

  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;

  const tabs = useMemo(
    () =>
      [
        { key: "alerts", label: t("tabAlerts"), icon: Bell },
        { key: "feed", label: t("tabFeed"), icon: Newspaper },
        { key: "map", label: t("tabMap"), icon: Map },
        { key: "suggestions", label: t("tabSuggestions"), icon: Lightbulb },
        { key: "profile", label: t("tabProfile"), icon: User },
      ] as {
        key: Exclude<TabKey, "detect">;
        label: string;
        icon: React.ComponentType<{ className?: string }>;
      }[],
    [t]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found, redirecting to login");
      router.replace("/login");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const userId = decoded.id;
      if (userId) {
        fetchUser(userId, token);
      } else {
        throw new Error("Invalid token: missing user ID");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
      router.replace("/login");
    }
  }, [router]);

  const fetchUser = async (id: string, token: string) => {
    try {
      const response = await axios.get(`${BACKEND_API}/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
      setUser(null);
      router.replace("/login");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <main className="min-h-dvh bg-white text-gray-900 flex flex-col items-center">
      <header
        className="w-full sticky top-0 z-30 border-b"
        style={{
          borderColor: "rgba(37,89,87,0.15)",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "saturate(180%) blur(8px)",
        }}
      >
        <div className="mx-auto w-full max-w-screen-md px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <Image
                src="/logo.png"
                alt="Crop Sentinel Logo"
                width={32}
                height={32}
                className="h-8 w-8 rounded-md"
<<<<<<< HEAD
              ></Image>
            </div>
            <div className="leading-tight">
              <Image
                src="/name.png"
                alt="Crop Sentinel Logo"
                width={42}
                height={32}
                className="h-8 w-12 rounded-md"
              ></Image>
              <p className="text-xs text-gray-500">
                {user?.name || user?.email}
              </p>
            </div>
=======
              />
              <Image
                src="/images/logo.png"
                alt="Crop Sentinel Logo"
                width={64}
                height={64}
                className="h-16 w-16 rounded-md"
              />
            </div>
>>>>>>> 957e4f61abea4c936329a8630a77194b50abaf1b
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              {user?.profileUrl ? (
                (console.log(`${BACKEND_API}${user.profileUrl}`),
                (
                  <AvatarImage
                    src={
                      `${BACKEND_API}${user.profileUrl}` || "/placeholder.svg"
                    }
                    alt="Me"
                  />
                ))
              ) : (
                <AvatarFallback>ME</AvatarFallback>
              )}
            </Avatar>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="h-8 px-3 text-xs"
              style={{ borderColor: ACCENT, color: ACCENT }}
            >
              {t("signOut")}
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-screen-md flex-1 px-4 pb-32 pt-4">
        {tab === "detect" && (
          <div style={{ width: "100%", height: "80vh" }}>
            <iframe
              src="https://arada-ai.streamlit.app/?embed=true"
              style={{ border: "none", width: "100%", height: "100%" }}
              allowFullScreen
            />
          </div>
        )}
        {tab === "alerts" && <AlertsList accent={ACCENT} />}
        {tab === "feed" && <FeedList accent={ACCENT} />}
        {tab === "map" && <OutbreakMap accent={ACCENT} />}
        {tab === "suggestions" && <SuggestionsForm accent={ACCENT} />}
        {tab === "profile" && <Profile accent={ACCENT} />}
      </section>

      <nav className="fixed inset-x-0 bottom-3 z-40">
        <div className="mx-auto max-w-screen-sm px-4">
          <div className="relative">
            <div
              className="h-14 rounded-[22px] border backdrop-blur bg-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
              style={{ borderColor: "rgba(37,89,87,0.15)" }}
            />
            <button
              onClick={() => setTab("detect")}
              aria-label={t("tabDetect")}
              className={cn(
                "absolute -top-5 left-1/2 -translate-x-1/2 h-14 w-14 rounded-full shadow-xl border flex items-center justify-center",
                tab === "detect" ? "ring-4 ring-emerald-100" : ""
              )}
              style={{
                background: "linear-gradient(135deg, #255957, #317c76)",
                borderColor: "rgba(255,255,255,0.6)",
                color: "white",
              }}
            >
              <Wand2 className="h-6 w-6" />
            </button>
            <div className="absolute inset-0 grid grid-cols-5 items-center">
              {tabs.map(({ key, label, icon: Icon }, i) => {
                const onClick = () => setTab(key as TabKey);
                const active = tab === key;
                const base =
                  "mx-auto flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-gray-700";
                return (
                  <button
                    key={key}
                    onClick={onClick}
                    aria-label={label}
                    className={cn(base, i < 2 ? "col-span-1" : "col-span-1")}
                    style={{ color: active ? ACCENT : undefined }}
                  >
                    <Icon className={cn("h-5 w-5", active && "scale-[1.05]")} />
                    <span className="hidden xs:block">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </main>
  );
}
