"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Bot, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  language?: string
}

export default function SuggestionsChatbot({ accent = "#255957" }) {
  const greetings = [
  "Hello! I'm your AI assistant for agricultural advice. How can I help you today? (English)",
  "ሰላም! እኔ ለግብርና ምክር የሚረዳዎ ኤአይ እባላለሁ። እንዴት ልረዳዎ? (Amharic)",
  "Akkam! Ani gorsa qonnaa siif kennuuf qopheedha. Maal siif godhu? (Afaan Oromoo)",
  "ሰላም! ንስኻ ምሕላፍ ኤአይ ነኻ። እንታይ እንደምትረዳ እትፈልጥ? (Tigrinya)"
];

const [messages, setMessages] = useState<Message[]>([
  {
    id: "bot-1",
    content: greetings.join("\n\n"),
    sender: "bot",
    language: "en",
  },
])

  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const detectLanguage = (text: string): string => {
    const cleanText = text.toLowerCase().trim()
    const amharicPattern = /[\u1200-\u137F]/
    if (amharicPattern.test(text)) return "am"

    const oromoWords = ["akkam", "maal", "eessa", "yeroo", "bishaan", "qonnaa", "koo", "jiru","kenna"]
    const oromoWordCount = oromoWords.filter((w) => cleanText.includes(w)).length
    if (oromoWordCount >= 2) return "or"

    return "en"
  }

  async function sendMessage() {
    if (!input.trim()) return
    const userLang = detectLanguage(input)

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      content: input.trim(),
      sender: "user",
      language: userLang,
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/ai/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, language: userLang }),
      })
      if (!res.ok) throw new Error("Failed to get AI response")
      const data = await res.json()

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        content: data.aiResponse,
        sender: "bot",
        language: userLang,
      }
      setMessages((prev) => [...prev, botMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-error-${Date.now()}`,
          content: "Sorry, I couldn't fetch advice. Please try again.",
          sender: "bot",
          language: "en",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Card className="max-w-md mx-auto border" style={{ borderColor: "rgba(37,89,87,0.2)" }}>
      <CardHeader>
        <CardTitle>Agri AI Chatbot</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[500px]">
        <ScrollArea className="flex-1 px-4 space-y-4 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "bot" && (
                <Avatar className="h-8 w-8 flex-shrink-0 mt-1 bg-[#255957]">
<AvatarFallback className=" text-black text-xs">
  <Bot className="h-4 w-4" stroke="currentColor" />
</AvatarFallback>


                </Avatar>
              )}
              <div
               className={`max-w-[70%] rounded-lg p-3 text-sm whitespace-pre-wrap break-words ${
  msg.sender === "user" ? "text-white" : "bg-muted text-foreground"
}`}
style={msg.sender === "user" ? { backgroundColor: "#255957" } : undefined}

              >
                {msg.content}
                
              </div>
              {msg.sender === "user" && (
                <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                  <AvatarFallback className="bg-secondary text-xs">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                <AvatarFallback className="bg-[#255957] text-white text-xs">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg p-3 text-sm max-w-[70%]">
                Typing...
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </ScrollArea>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
          className="flex gap-2 mt-4"
        >
          <Input
            placeholder="Ask your farming question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="flex-1 text-sm"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            style={{ background: accent, color: "white" }}
          >
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
