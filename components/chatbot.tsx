"use client"

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageCircle, Send, Bot, User, X, Minimize2, Maximize2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: string
  language?: string
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant for agricultural challenges. How can I help you today? / ሰላም! እኔ የግብርና ችግሮች AI ረዳት ነኝ። ዛሬ እንዴት ልረዳዎት እችላለሁ?',
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const detectLanguage = (text: string): string => {
    // Clean the text for analysis
    const cleanText = text.toLowerCase().trim()
    
    // Check for Amharic script (Unicode range for Ethiopic)
    const amharicPattern = /[\u1200-\u137F]/
    if (amharicPattern.test(text)) {
      return 'am'
    }
    
    // Check for Tigrinya script (also uses Ethiopic script but has specific patterns)
    const tigrinya = /[\u1275\u1295\u12A5\u1275\u1295]/
    if (tigrinya.test(text)) {
      return 'ti'
    }
    
    // More specific Afaan Oromo detection using common words and patterns
    const oromoWords = [
      'akkam', 'maal', 'eessa', 'yeroo', 'bishaan', 'qonnaa', 'midhaan', 
      'lafti', 'rooba', 'aduu', 'qorichi', 'dhukkuba', 'raammoo',
      'gargaarsa', 'barbaachisa', 'dandeessa', 'jira', 'hin', 'akka',
      'kana', 'sana', 'kun', 'sun', 'dhiira', 'dubartii'
    ]
    
    // Check if text contains multiple Oromo-specific words
    const oromoWordCount = oromoWords.filter(word => 
      cleanText.includes(word)
    ).length
    
    // Also check for Oromo-specific letter combinations
    const oromoPatterns = [
      /\bdhaa?\b/i,    // common Oromo ending
      /\bqaa?\b/i,     // common Oromo pattern
      /\btii?\b/i,     // common Oromo ending
      /\bchaa?\b/i,    // Oromo specific
      /\bnyaa?\b/i     // Oromo specific
    ]
    
    const oromoPatternMatches = oromoPatterns.filter(pattern => 
      pattern.test(cleanText)
    ).length
    
    // Only classify as Oromo if we have strong evidence
    if (oromoWordCount >= 2 || (oromoWordCount >= 1 && oromoPatternMatches >= 1)) {
      return 'or'
    }
    
    // Default to English for everything else
    return 'en'
  }

  const generateAIResponse = async (userMessage: string, language: string): Promise<string> => {
    try {
      const response = await fetch('/api/ai/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          language: language
        })
      })

      if (!response.ok) {
        throw new Error('AI response failed')
      }

      const { aiResponse } = await response.json()
      return aiResponse || 'I apologize, but I cannot provide a response at the moment. Please try again.'
    } catch (error) {
      console.error('Error generating AI response:', error)
      
      const fallbacks = {
        en: "I'm having trouble connecting right now. Please try again in a moment.",
        am: "አሁን ግንኙነት ችግር አለኝ። እባክዎ ትንሽ ቆይተው ይሞክሩ።",
        or: "Yeroo ammaa walqunnamtii rakkoo qaba. Maaloo yeroo muraasaaf eegdanii yaali."
      }
      
      return fallbacks[language as keyof typeof fallbacks] || fallbacks.en
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const language = detectLanguage(inputMessage)
    console.log('Detected language:', language, 'for message:', inputMessage) // Debug log
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
      language
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    const aiResponse = await generateAIResponse(inputMessage, language)
    
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        language
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <div className={`fixed bottom-4 right-4 shadow-lg transition-all duration-300 z-50 ${
      isMinimized ? 'w-80 h-14' : 'w-96 h-[500px]'
    }`}>
      <Card className="h-full w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 py-3 border-b">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Assistant
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6 p-0"
            >
              {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[440px]">
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 py-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.sender === 'bot' && (
                      <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`max-w-[280px] rounded-lg p-3 text-sm break-words overflow-wrap-anywhere ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                        style={{
                          wordBreak: 'break-word',
                          overflowWrap: 'anywhere',
                          hyphens: 'auto'
                        }}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                      
                      {message.language && message.language !== 'en' && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {message.language === 'am' ? 'አማርኛ' : 
                           message.language === 'or' ? 'Afaan Oromoo' : 
                           message.language === 'ti' ? 'ትግርኛ' : message.language}
                        </Badge>
                      )}
                    </div>

                    {message.sender === 'user' && (
                      <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                        <AvatarFallback className="bg-secondary text-xs">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3 text-sm max-w-[280px]">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isTyping}
                  className="flex-1 text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
