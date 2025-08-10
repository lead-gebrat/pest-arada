"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

export type StoredUser = {
  email: string
  fullName: string
  phone?: string
  location?: string
  photo?: string // data URL
  hash: string
  createdAt: string
}

export type SessionUser = Pick<StoredUser, "email" | "fullName" | "photo">

type AuthContextType = {
  user: SessionUser | null
  isAuthenticated: boolean
  isReady: boolean
  signUp: (data: {
    email: string
    password: string
    fullName: string
    phone?: string
    location?: string
    photo?: string
  }) => Promise<{ ok: true } | { ok: false; error: string }>
  signIn: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>
  signOut: () => void
  getUserStore: (email: string) => StoredUser | null
  updateUserStore: (email: string, patch: Partial<Omit<StoredUser, "email" | "createdAt">>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

async function sha256(input: string) {
  const data = new TextEncoder().encode(input)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

function readUsers(): Record<string, StoredUser | string> {
  try {
    const raw = localStorage.getItem("cs_users")
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}
function writeUsers(users: Record<string, StoredUser | string>) {
  try {
    localStorage.setItem("cs_users", JSON.stringify(users))
  } catch {}
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [isReady, setIsReady] = useState(false)

  // Bootstrap session
  useEffect(() => {
    try {
      const email = localStorage.getItem("cs_auth")
      if (email) {
        const all = readUsers()
        const record = all[email]
        if (record && typeof record !== "string") {
          setUser({ email, fullName: record.fullName, photo: record.photo })
        } else if (record) {
          setUser({ email, fullName: email.split("@")[0], photo: undefined })
        }
      }
    } finally {
      setIsReady(true)
    }
  }, [])

  const signUp: AuthContextType["signUp"] = useCallback(async (data) => {
    const { email, password, fullName, phone, location, photo } = data
    try {
      const users = readUsers()
      const key = email.trim().toLowerCase()
      if (users[key]) return { ok: false as const, error: "Account already exists" }
      const hash = await sha256(password)
      const stored: StoredUser = {
        email: key,
        fullName,
        phone,
        location,
        photo,
        hash,
        createdAt: new Date().toISOString(),
      }
      users[key] = stored
      writeUsers(users)
      return { ok: true as const }
    } catch {
      return { ok: false as const, error: "Sign up failed" }
    }
  }, [])

  const signIn: AuthContextType["signIn"] = useCallback(async (email, password) => {
    try {
      const key = email.trim().toLowerCase()
      const users = readUsers()
      const rec = users[key]
      if (!rec) return { ok: false as const, error: "Account not found" }
      const hash = await sha256(password)
      const ok = typeof rec === "string" ? rec === hash : rec.hash === hash
      if (!ok) return { ok: false as const, error: "Invalid credentials" }
      localStorage.setItem("cs_auth", key)
      if (typeof rec === "string") {
        setUser({ email: key, fullName: key.split("@")[0] })
      } else {
        setUser({ email: key, fullName: rec.fullName, photo: rec.photo })
      }
      return { ok: true as const }
    } catch {
      return { ok: false as const, error: "Login failed" }
    }
  }, [])

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem("cs_auth")
    } catch {}
    setUser(null)
  }, [])

  const getUserStore = useCallback((email: string) => {
    const u = readUsers()[email]
    return typeof u === "string" ? null : (u as StoredUser)
  }, [])

  const updateUserStore = useCallback((email: string, patch: Partial<Omit<StoredUser, "email" | "createdAt">>) => {
    const all = readUsers()
    const current = all[email]
    if (!current || typeof current === "string") return
    const updated: StoredUser = { ...current, ...patch }
    all[email] = updated
    writeUsers(all)
    setUser((u) => (u && u.email === email ? { email, fullName: updated.fullName, photo: updated.photo } : u))
  }, [])

  const value = useMemo<AuthContextType>(
    () => ({ user, isAuthenticated: !!user, isReady, signUp, signIn, signOut, getUserStore, updateUserStore }),
    [user, isReady, signUp, signIn, signOut, getUserStore, updateUserStore],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
