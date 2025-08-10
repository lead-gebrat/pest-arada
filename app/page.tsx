"use client"

import Image from "next/image"
import Link from "next/link"
import LanguageSwitcher from "@/components/language-switcher"
import { useI18n } from "@/components/i18n/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Wand2, Bell, Newspaper, Map, Lightbulb, User } from "lucide-react"

const ACCENT = "#255957"

export default function LandingPage() {
  const { t } = useI18n()
  return (
    <main className="bg-white text-gray-900">
      <Header />

      <section
        className="relative overflow-hidden"
        style={{
          background: "radial-gradient(1200px 300px at 50% -50px, rgba(37,89,87,0.08), rgba(255,255,255,0) 60%)",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 pt-10 sm:pt-14 pb-12 sm:pb-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
          
            <h1 className="mt-4 text-3xl sm:text-5xl font-semibold leading-[1.05] tracking-tight">{t("headline")}</h1>
            <p className="mt-3 text-gray-600 max-w-prose">{t("heroLead")}</p>
            <div className="mt-5 flex items-center gap-3">
              <Link href="/signup">
                <Button className="h-10 px-5" style={{ background: ACCENT, color: "white" }}>
                  {t("getStarted")}
                </Button>
              </Link>
              <a href="#features">
                <Button
                  variant="outline"
                  className="h-10 px-5 bg-transparent"
                  style={{ borderColor: ACCENT, color: ACCENT }}
                >
                  {t("exploreFeatures")}
                </Button>
              </a>
            </div>
          </div>

          <div className="relative">
            
              <Image
                src="/images/image.png"
                alt="Challenge slide"
                width={1600}
                height={1000}
                className="w-full h-[260px] sm:h-[340px] object-cover"
                priority
              />
             
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="mb-6 flex items-center justify-between">
          <Badge variant="secondary" style={{ background: "rgba(37,89,87,0.08)", color: ACCENT }}>
            {t("features")}
          </Badge>
          <LanguageSwitcher compact />
        </div>
        <FeaturesGrid />
      </section>

      <section id="map" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{t("outbreakHeadline")}</h2>
            <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
              <li>{t("outbreakB1")}</li>
              <li>{t("outbreakB2")}</li>
              <li>{t("outbreakB3")}</li>
            </ul>
            <div className="pt-2">
              <Link href="/login">
                <Button className="mt-2" style={{ background: ACCENT, color: "white" }}>
                  {t("launchApp")}
                </Button>
              </Link>
            </div>
          </div>
          <Card
            className="overflow-hidden border rounded-2xl"
            style={{ borderColor: "rgba(37,89,87,0.2)", boxShadow: "0 6px 30px rgba(0,0,0,0.06)" }}
          >
            <Image
              src={
                "/placeholder.svg"
              }
              alt="Outbreak map preview"
              width={900}
              height={520}
              className="w-full h-[320px] sm:h-[420px] object-cover"
              priority
            />
          </Card>
        </div>
      </section>

      <section
        className="mx-auto max-w-6xl px-4 py-12 sm:py-16"
        style={{
          background: "radial-gradient(1000px 200px at 50% 0, rgba(37,89,87,0.08), rgba(255,255,255,0) 60%)",
        }}
      >
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: "rgba(37,89,87,0.18)", boxShadow: "0 10px 40px rgba(0,0,0,0.06)" }}
        >
          <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-semibold">{t("ctaTitle")}</h3>
              <p className="text-gray-600 mt-1">{t("ctaDesc")}</p>
            </div>
            <Link href="/login">
              <Button className="h-10 px-5" style={{ background: ACCENT, color: "white" }}>
                {t("launchApp")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )

 

  function Header() {
    return (
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          borderColor: "rgba(37,89,87,0.12)",
          background: "rgba(255,255,255,0.78)",
          backdropFilter: "saturate(180%) blur(8px)",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
           <Image
                           src="/logo.png"
                           alt="Crop Sentinel Logo"
                           width={32}
                           height={32}
                           className="h-12 w-12 rounded-md"
                         ></Image>
                         <Image
                           src="/images/logo.png"
                           alt="Crop Sentinel Logo"
                           width={64}
                           height={64}
                           className="h-16 w-16 rounded-md"
                         ></Image>
           
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#features" className="text-gray-700 hover:text-gray-900">
              {t("features")}
            </a>
            <a href="#map" className="text-gray-700 hover:text-gray-900">
              Map
            </a>
            <a href="#how" className="text-gray-700 hover:text-gray-900">
              {t("howItWorks")}
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher compact />
            <Link href="/login">
              <Button size="sm" style={{ background: ACCENT, color: "white" }}>
                {t("launchApp")}
              </Button>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  function FeaturesGrid() {
    const items = [
      { icon: Wand2, title: t("tabDetect"), desc: "Upload or snap a photo. Get instant, readable results." },
      { icon: Bell, title: t("tabAlerts"), desc: "See high‑severity risks first. Never miss what matters." },
      { icon: Newspaper, title: t("tabFeed"), desc: "Actionable insights and updates—minimal noise." },
      { icon: Map, title: t("tabMap"), desc: "Watch clusters evolve and plan in real time." },
      { icon: Lightbulb, title: t("tabSuggestions"), desc: "Clear, practical steps tailored to your crop." },
      { icon: User, title: t("tabProfile"), desc: "Your regions, your crops, your preferences." },
    ] as const

    return (
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f, i) => (
          <Card key={i} className="border rounded-2xl" style={{ borderColor: "rgba(37,89,87,0.18)" }}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(37,89,87,0.08)", color: ACCENT }}
                  aria-hidden="true"
                >
                  <f.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{f.title}</div>
                  <p className="mt-1 text-sm text-gray-600">{f.desc}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  function Footer() {
    return (
      <footer className="border-t" style={{ borderColor: "rgba(37,89,87,0.12)" }}>
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-600 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Crop Sentinel</p>
          <div className="flex items-center gap-4">
            <a href="#features" className="hover:text-gray-900">
              {t("features")}
            </a>
            <a href="#how" className="hover:text-gray-900">
              {t("howItWorks")}
            </a>
            <Link href="/login" className="hover:text-gray-900">
              {t("openApp")}
            </Link>
          </div>
        </div>
      </footer>
    )
  }
}
