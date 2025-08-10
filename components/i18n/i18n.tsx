"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type Lang = "en" | "am" | "ti" | "om"

type I18nContext = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (k: string) => string
}

const DICT: Record<Lang, Record<string, string>> = {
  en: {
    // Global
    getStarted: "Get Started",
    launchApp: "Launch App",
    features: "Features",
    howItWorks: "How it works",
    openApp: "Open App",
    continue: "Continue",
    signOut: "Sign out",
    loadingMap: "Loading map...",

    // Tabs
    tabDetect: "Detect",
    tabAlerts: "Alerts",
    tabFeed: "Feed",
    tabMap: "Map",
    tabSuggestions: "Tips",
    tabProfile: "Profile",

    // Landing
    builtReliability: "Built for field reliability",
    headline: "AI early warning for crop pests and diseases",
    heroLead:
      "Ultra‑clean interface. Instant insights. A modern, mobile‑first tool to detect, monitor, and act before outbreaks spread.",
    exploreFeatures: "Explore features",
    outbreakHeadline: "Outbreak intelligence, at a glance",
    outbreakB1: "High‑contrast markers for instant clarity",
    outbreakB2: "Region and crop context baked in",
    outbreakB3: "Designed for speed, even on 3G",
    ctaTitle: "Ready to protect your crops?",
    ctaDesc: "Launch the platform and start detecting, alerting, and mapping outbreaks now.",

    // Auth
    createAccount: "Create account",
    createProfileSub: "Create your profile to access the platform.",
    login: "Log in",
    loginSub: "Access the platform.",
    haveAccount: "Already have an account?",
    noAccount: "New here?",
    goLogin: "Log in",
    goSignup: "Create account",
    fullName: "Full name",
    email: "Email",
    phone: "Phone",
    location: "Location",
    password: "Password",
    profilePhoto: "Profile photo",
    required: "Fill all required fields",
    created: "Account created",
    nowLogin: "Now log in to continue.",
    loginFailed: "Login failed",
    signupFailed: "Sign up failed",
    welcomeBack: "Welcome back",

    // Detect
    upload: "Upload",
    camera: "Camera",
    analyze: "Analyze",
    analyzing: "Analyzing...",
    runningModel: "Running vision model (demo)...",
    saveResult: "Save Result",
    reportOutbreak: "Report Outbreak",
    severityHigh: "HIGH",
    severityMedium: "MEDIUM",
    severityLow: "LOW",

    // Alerts
    filters: "Filters",
    all: "All",
    unread: "Unread",
    new: "NEW",

    // Suggestions
    smartTips: "Smart Tips",
    crop: "Crop",
    stage: "Growth Stage",
    notes: "Notes (optional)",
    generate: "Generate Suggestions",
    recommendations: "Recommendations",
    tipsCount: "tips",

    // Profile
    name: "Name",
    region: "Region",
    crops: "Crops",
    criticalAlerts: "Critical Alerts",
    criticalAlertsDesc: "Send me high‑severity notifications",
    cancel: "Cancel",
    save: "Save",
    changePhoto: "Change photo",
  },
  am: {
    // Global
    getStarted: "ጀምር",
    launchApp: "መተግበሪያ ክፈት",
    features: "ባህሪያት",
    howItWorks: "እንዴት ይሰራ",
    openApp: "መተግበሪያ ክፈት",
    continue: "ቀጥል",
    signOut: "መውጣት",
    loadingMap: "ካርታ በመጫን ላይ...",

    // Tabs
    tabDetect: "ማግኘት",
    tabAlerts: "ማንቂያዎች",
    tabFeed: "መረጃ",
    tabMap: "ካርታ",
    tabSuggestions: "ምክሮች",
    tabProfile: "መገለጫ",

    // Landing
    builtReliability: "ለመስክ ተስማሚ ታማኝነት",
    headline: "ለእፅዋት ተባባሪዎች እና በሽታዎች የAI ቀድሞ ማስጠንቀቂያ",
    heroLead: "እጅግ ንጹህ ገጽታ። በፍጥነት ማስተዋል። ከመብት የሚጀምር ዘመናዊ መሣሪያ ለማግኘት፣ ለመከታተል እና ለመከላከል።",
    exploreFeatures: "ባህሪያት አሳስብ",
    outbreakHeadline: "የመውጫ መረጃ በአንድ እይታ",
    outbreakB1: "ከፍተኛ ፍርም ምልክቶች ለፈጣን ግለጽ",
    outbreakB2: "ዞን እና የእርሻ መረጃ የተያያዙ",
    outbreakB3: "እንኳን በ3G በፍጥነት የተነደፈ",
    ctaTitle: "ዘሮችህን ለመጠበቅ ዝግጁ ነህ?",
    ctaDesc: "መተግበሪያውን ክፈት እና ማግኘት፣ ማንቂያ መላክ እና መውጫዎችን መካተት ጀምር።",

    // Auth
    createAccount: "መለያ ክፈት",
    createProfileSub: "መዳረሻ ለማግኘት መገለጫህን ፍጠር።",
    login: "ግባ",
    loginSub: "መተግበሪያውን እንድትጠቀም ግባ።",
    haveAccount: "መለያ አለህ?",
    noAccount: "አዲስ ነህ?",
    goLogin: "ግባ",
    goSignup: "መለያ ፍጠር",
    fullName: "ሙሉ ስም",
    email: "ኢሜይል",
    phone: "ስልክ",
    location: "አካባቢ",
    password: "የሚስጥር ቃል",
    profilePhoto: "የመገለጫ ፎቶ",
    required: "አስፈላጊ መረጃዎችን ሙሉ ሙሉ ሙላ",
    created: "መለያ ተፈጥሯል",
    nowLogin: "ለመቀጠል አሁን ግባ።",
    loginFailed: "መግባት አልተሳካም",
    signupFailed: "መመዝገብ አልተሳካም",
    welcomeBack: "እንኳን ደህና መጣህ",

    // Detect
    upload: "አስገባ",
    camera: "ካሜራ",
    analyze: "ተንትን",
    analyzing: "በመተንተን ላይ...",
    runningModel: "የእይታ ሞዴል በሙከራ...",
    saveResult: "ውጤት አስቀምጥ",
    reportOutbreak: "መውጫ አመልክት",
    severityHigh: "ከፍተኛ",
    severityMedium: "መካከለኛ",
    severityLow: "ዝቅተኛ",

    // Alerts
    filters: "ማጣሪያዎች",
    all: "ሁሉም",
    unread: "ያልተነበቡ",
    new: "አዲስ",

    // Suggestions
    smartTips: "የብልጥ ምክሮች",
    crop: "እርሻ",
    stage: "የእድገት ደረጃ",
    notes: "ማስታወሻ (አማራጭ)",
    generate: "ምክሮች ፍጠር",
    recommendations: "ምክሮች",
    tipsCount: "ምክሮች",

    // Profile
    name: "ስም",
    region: "ክልል",
    crops: "እርሻዎች",
    criticalAlerts: "አስቸኳይ ማንቂያዎች",
    criticalAlertsDesc: "ከፍተኛ አደጋ ላለው ማስታወቂያ ላክ",
    cancel: "ሰርዝ",
    save: "አስቀምጥ",
    changePhoto: "ፎቶ ቀይር",
  },
  ti: {
    getStarted: "ጀምር",
    launchApp: "መተግበሪ ክፈት",
    features: "ባህሪታት",
    howItWorks: "እንታይ እዩ ዝሰርሕ",
    openApp: "መተግበሪ ክፈት",
    continue: "ቀጽል",
    signOut: "ውጽእ",
    loadingMap: "ካርታ ተመርመር ኣሎ...",

    tabDetect: "መርመር",
    tabAlerts: "ማንቂያታት",
    tabFeed: "መረጃ",
    tabMap: "ካርታ",
    tabSuggestions: "ምክር",
    tabProfile: "ፕሮፋይል",

    builtReliability: "ናብ መስክ ታማኒ ዝሓለፈ",
    headline: "AI ቅድሚ ማስጠንቀቂ ስርዓት ንተባባሪ እና ሕማማት እርሻ",
    heroLead: "ጽሩይ ስነ ልቦና። ብፍጥነት ሓበሬታ። ዘመናዊ መሳርሒ ንመርመር፣ ንትሕተትቲ እና ንሕብረት ምሕደራ።",
    exploreFeatures: "ባህሪታት ተረኽቦ",
    outbreakHeadline: "ሓበሬታ ናይ ምውጻእ ብሓደ ረኣይ",
    outbreakB1: "ምልክታት ናይ ግልገሎ ሕቡእ",
    outbreakB2: "ናይ መንበር እና ናይ እርሻ ንእሽቶ",
    outbreakB3: "እንኳን ናብ 3G ብፍጥነት ዝግበር",
    ctaTitle: "እቲ እርሻኻ ንምጥቃም ተዘጋጅለ!",
    ctaDesc: "መተግበሪ ክፈት እና መርመር፣ ማንቂያ እና ካርታ ጀምር።",

    createAccount: "መለያ ፍጠር",
    createProfileSub: "ንመእተዊ መዳረሻ ፕሮፋይል ፍጠር።",
    login: "ግባ",
    loginSub: "መተግበሪ ክፈት ንምኽንያት ግባ።",
    haveAccount: "መለያ ኣለካ?",
    noAccount: "ሓደሽ ኢኻ?",
    goLogin: "ግባ",
    goSignup: "መለያ ፍጠር",
    fullName: "ሙሉ ስም",
    email: "ኢሜይል",
    phone: "ስልኪ",
    location: "ቦታ",
    password: "መሕለፊ ቃል",
    profilePhoto: "ስእሊ ፕሮፋይል",
    required: "ኣብ ዝደለኹም ሓበሬታ ሙሉ ሙሉ ሙሉ",
    created: "መለያ ተፈጥረ",
    nowLogin: "ለመቀጠል ክትግበ ድሕሪ እዚ።",
    loginFailed: "መእተዊ ኣይተሳካን",
    signupFailed: "መመዝገብ ኣይተሳካን",
    welcomeBack: "እንኳን ብደሓን መፃእካ",

    upload: "ኣስገባ",
    camera: "ካሜራ",
    analyze: "ተንትን",
    analyzing: "ተንትኔት ኣሎ...",
    runningModel: "ሞዴል እዩ ዝርከብ (ሞያ)...",
    saveResult: "ውጤት ኣቐምጥ",
    reportOutbreak: "መውጻእ ኣመልክት",
    severityHigh: "ከፍ",
    severityMedium: "መካከል",
    severityLow: "ዝቅ",

    filters: "ማጣሪያታት",
    all: "ኩሉ",
    unread: "ዘይኣንብብ",
    new: "ሓድሽ",

    smartTips: "ጥቅሞታት ሕቡራት",
    crop: "እርሻ",
    stage: "ደረጃ እድገት",
    notes: "ማስታወሻ (ኣመራርሓይ)",
    generate: "ጥቅሞታት ፍጠር",
    recommendations: "ምክሮታት",
    tipsCount: "ጥቅሞታት",

    name: "ስም",
    region: "ቦታ",
    crops: "እርሻታት",
    criticalAlerts: "ኣስቸኳይ ማንቂያታት",
    criticalAlertsDesc: "ኣስቸኳይ ማንቂያ ልኣኽ",
    cancel: "ደመልክነ",
    save: "ኣቐምጥ",
    changePhoto: "ስእሊ ለውጥ",
  },
  om: {
    getStarted: "Jalqabi",
    launchApp: "Appii banuu",
    features: "Amaloota",
    howItWorks: "Akkamitti hojjetti",
    openApp: "Appii banuu",
    continue: "Itti fufi",
    signOut: "Ba'i",
    loadingMap: "Kaartaan fe'amaa jirti...",

    tabDetect: "Argachuu",
    tabAlerts: "Beeksisa",
    tabFeed: "Odeeffannoo",
    tabMap: "Kaartaa",
    tabSuggestions: "Tartiiba",
    tabProfile: "Piroofaayilii",

    builtReliability: "Tajaajila dirreef amanamaa",
    headline: "Beeksisa dursee sirna AI balaa bineensotaa fi dhukkuboota midhaanotaa",
    heroLead:
      "Fuula qulqulluu. Deebii saffisaa. Meeshaa ammayyaa bilbila irratti jalqaba — argii, hordoffii, fi to'annoo dura ta'i.",
    exploreFeatures: "Amaloota ilaali",
    outbreakHeadline: "Odeeffannoo balaa saffisaan hubadhu",
    outbreakB1: "Mallattoolee ifa ta'an saffisaan baruuf",
    outbreakB2: "Naannoo fi midhaan waliin",
    outbreakB3: "3G irrattis saffisaaf qophaa'e",
    ctaTitle: "Midhaani kee eegi?",
    ctaDesc: "Appii banuu fi argachuu, beeksisuu, fi kaartaa irratti mul'isu jalqabi.",

    createAccount: "Akkaawuntii uumi",
    createProfileSub: "Saffisaa fayyadamuuf piroofaayilii kee uumi.",
    login: "Seeni",
    loginSub: "Appii fayyadamuuf seeni.",
    haveAccount: "Akkaawuntiin siif jiraa?",
    noAccount: "Haaraa ta'aa?",
    goLogin: "Seeni",
    goSignup: "Uumi",
    fullName: "Maqaa guutuu",
    email: "Imeelii",
    phone: "Bilbila",
    location: "Bakka",
    password: "Jecha iccitii",
    profilePhoto: "Suuraa piroofaayilii",
    required: "Iddoo barbaachisoo hundi guutamuu qaba",
    created: "Akkaawuntiin uumame",
    nowLogin: "Amma seeni itti fufuuf.",
    loginFailed: "Seenuun hin milkoofne",
    signupFailed: "Galmeen hin milkoofne",
    welcomeBack: "Baga nagaan dhufte",

    upload: "Olkaa'i",
    camera: "Kaameraa",
    analyze: "Goroo'ichi xiinxala",
    analyzing: "Xiinxalaa jira...",
    runningModel: "Moodeeli ilaalcha (demo) hojjechaa jira...",
    saveResult: "Bu'aa olkaa'i",
    reportOutbreak: "Balaa gabaasi",
    severityHigh: "OLAANAA",
    severityMedium: "GIDDU GALEESSAA",
    severityLow: "XIQQAA",

    filters: "Faayiltoota",
    all: "Hunda",
    unread: "Hin dubbifamne",
    new: "Haaraa",

    smartTips: "Tartiiba Ogummaa",
    crop: "Midhaan",
    stage: "Sadarkaa guddina",
    notes: "Yaada (filannoo)",
    generate: "Tartiiba uumi",
    recommendations: "Tartiiba",
    tipsCount: "tartiiba",

    name: "Maqaa",
    region: "Naannoo",
    crops: "Midhaanota",
    criticalAlerts: "Beeksisa Muraa",
    criticalAlertsDesc: "Beeksisa balaa ol'aanaa naa ergi",
    cancel: "Haquu",
    save: "Olkaa'i",
    changePhoto: "Suuraa jijjiiri",
  },
}

const Ctx = createContext<I18nContext | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en")

  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem("cs_lang") as Lang)) || "en"
    setLangState(saved || "en")
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem("cs_lang", l)
    } catch {}
  }

  const t = (k: string) => DICT[lang][k] ?? DICT.en[k] ?? k

  const value = useMemo(() => ({ lang, setLang, t }), [lang])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useI18n() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}
