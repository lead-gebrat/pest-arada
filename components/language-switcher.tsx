"use client"

import { useI18n, type Lang } from "@/components/i18n/i18n"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useI18n()
  const label = { en: "EN", am: "አማ", ti: "ትግ", om: "OR" } as const
  return (
    <div className="min-w-[120px]">
      <Select value={lang} onValueChange={(v: Lang) => setLang(v)}>
        <SelectTrigger className={compact ? "h-8" : ""}>
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent align="end">
          {(Object.keys(label) as Lang[]).map((l) => (
            <SelectItem key={l} value={l}>
              {label[l]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
