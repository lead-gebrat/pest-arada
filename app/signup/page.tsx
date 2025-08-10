"use client";

import type React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth/auth-context";
import { useI18n } from "@/components/i18n/i18n";
import LanguageSwitcher from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const ACCENT = "#255957";

export default function SignUpPage() {
  const { signUp } = useAuth();
  const { t } = useI18n();
  const { toast } = useToast();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [photoFile, setPhotoFile] = useState<File | null>(null); // Store the file object
  const [loading, setLoading] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;

  const handleCreateAccount = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", fullName.trim());
    formData.append(
      "username",
      fullName.trim().toLowerCase().replace(/\s+/g, "")
    );
    formData.append("email", email.trim().toLowerCase());
    formData.append("phone", phone.trim() || "");
    formData.append("password", password);
    if (location.trim()) {
      formData.append("location", location.trim()); // Assuming CreateUserDto supports location
    }
    if (photoFile) {
      formData.append("profilePic", photoFile); // Match backend's expected field name
    }

    try {
      const response = await axios.post(
        `${BACKEND_API}/user/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("User created:", response.data);
      setShowCreateAccount(false);
      setLoginEmail(email.trim().toLowerCase());
      setLoginPassword(password);
      setShowSignIn(true);
      toast({ title: t("created"), description: t("nowLogin") });
    } catch (error) {
      console.error("Error creating user:", error);
      toast({ title: t("signupFailed"), description: t("failedToCreate") });
    } finally {
      setLoading(false);
    }
  };

  const onFile = (file?: File | null) => {
    if (!file) {
      setPhoto(undefined);
      setPhotoFile(null);
      return;
    }
    setPhotoFile(file); // Store the file object
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast({ title: t("required") });
      return;
    }
    setLoading(true);
    const res = await signUp({
      email: email.trim().toLowerCase(),
      password,
      fullName: fullName.trim(),
      phone: phone.trim() || undefined,
      location: location.trim() || undefined,
      photo,
    });
    setLoading(false);
    if (res.ok) {
      toast({ title: t("created"), description: t("nowLogin") });
      router.push("/login");
    } else {
      toast({ title: t("signupFailed"), description: res.error });
    }
  }

  return (
    <main className="min-h-dvh bg-white flex items-center justify-center px-4">
      <div className="absolute top-3 right-4">
        <LanguageSwitcher compact />
      </div>
      <Card
        className="w-full max-w-md border"
        style={{
          borderColor: "rgba(37,89,87,0.15)",
          boxShadow: "0 8px 36px rgba(0,0,0,0.06)",
        }}
      >
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{t("createAccount")}</CardTitle>
          <CardDescription>{t("createProfileSub")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                {photo ? (
                  <AvatarImage
                    src={photo || "/placeholder.svg"}
                    alt="Profile"
                  />
                ) : (
                  <AvatarFallback>YOU</AvatarFallback>
                )}
              </Avatar>
              <div className="grid gap-1">
                <Label htmlFor="photo">{t("profilePhoto")}</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fullName">{t("fullName")}</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">{t("phone")}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+251..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">{t("location")}</Label>
              <Textarea
                id="location"
                placeholder="City, Region"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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
              {loading ? t("continue") + "..." : t("createAccount")}
            </Button>
            <p className="text-xs text-gray-600 text-center">
              {t("haveAccount")}{" "}
              <Link
                href="/login"
                className="underline"
                style={{ color: ACCENT }}
              >
                {t("goLogin")}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
