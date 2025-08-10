"use client";

import type React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-context";
import { useI18n } from "@/components/i18n/i18n";
import LanguageSwitcher from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const ACCENT = "#255957";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { toast } = useToast();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const loginDto = {
      identifier: identifier.trim(),
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/auth/login",
        loginDto
      );
      console.log("Login successful:", response.data);

      // Validate token before storing and redirecting
      const token = response?.data?.token;
      if (typeof token === "string" && token.length > 0) {
        localStorage.setItem("token", token);

        router.push("/main");
      } else {
        throw new Error("Invalid token received");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast({
        title: t("loginFailed"),
        description: t("invalidCredentials"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh bg-white flex items-center justify-center px-4">
      <div className="absolute top-3 right-4">
        <LanguageSwitcher compact />
      </div>
      <Card
        className="w-full max-w-sm border"
        style={{
          borderColor: "rgba(37,89,87,0.15)",
          boxShadow: "0 8px 36px rgba(0,0,0,0.06)",
        }}
      >
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{t("login")}</CardTitle>
          <CardDescription>{t("loginSub")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="identifier">{t("emailOrPhone")}</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="you@example.com or +251..."
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              style={{ background: ACCENT, color: "white" }}
            >
              {loading ? t("continue") + "..." : t("login")}
            </Button>
            <p className="text-xs text-gray-600 text-center">
              {t("noAccount")}{" "}
              <Link
                href="/signup"
                className="underline"
                style={{ color: ACCENT }}
              >
                {t("goSignup")}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
