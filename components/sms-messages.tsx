"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageSquare, Bot, User, RefreshCw } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface SMSMessage {
  id: string
  from: string
  body: string
  timestamp: string
  aiResponse?: string
  status: 'pending' | 'responded' | 'failed'
  language: 'en' | 'am' | 'or' | 'ti'
  hasResponse: boolean
}

export function SMSMessages() {
  const [messages, setMessages] = useState<SMSMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    fetchMessages()
    // Auto-refresh every 30 seconds to show new messages
    const interval = setInterval(fetchMessages, 30000)
    return () => clearInterval(interval)
  }, [])

  const detectLanguage = (text: string): 'en' | 'am' | 'or' | 'ti' => {
    const cleanText = text.toLowerCase().trim()
    
    // Check for Amharic script
    const amharicPattern = /[\u1200-\u137F]/
    if (amharicPattern.test(text)) {
      return 'am'
    }
    
    // Check for Tigrinya patterns
    const tigrinya = /[\u1275\u1295\u12A5\u1275\u1295]/
    if (tigrinya.test(text)) {
      return 'ti'
    }
    
    // More specific Afaan Oromo detection
    const oromoWords = [
      'akkam', 'maal', 'eessa', 'yeroo', 'bishaan', 'qonnaa', 'midhaan', 
      'lafti', 'rooba', 'aduu', 'qorichi', 'dhukkuba', 'raammoo',
      'gargaarsa', 'barbaachisa', 'dandeessa', 'jira', 'hin', 'akka',
      'kana', 'sana', 'kun', 'sun', 'dhiira', 'dubartii', 'gaarii'
    ]
    
    const oromoWordCount = oromoWords.filter(word => 
      cleanText.includes(word)
    ).length
    
    const oromoPatterns = [
      /\bdhaa\b/i, /\bqaa\b/i, /\btii\b/i, /\bchaa\b/i, 
      /\bnyaa\b/i, /\bitti\b/i, /\birraa\b/i, /\bkeessa\b/i
    ]
    
    const oromoPatternMatches = oromoPatterns.filter(pattern => 
      pattern.test(cleanText)
    ).length
    
    // Only classify as Oromo with strong evidence
    if (oromoWordCount >= 2 || (oromoWordCount >= 1 && oromoPatternMatches >= 1)) {
      return 'or'
    }
    
    return 'en'
  }

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/twilio/messages')
      const data = await response.json()
      
      console.log('Fetched data:', data)
      
      if (data.success && data.messages) {
        const formattedMessages: SMSMessage[] = data.messages.map((msg: any) => {
          const detectedLang = detectLanguage(msg.body)
          console.log('Language detection for:', msg.body, '-> detected:', detectedLang)
          
          return {
            id: msg.sid,
            from: msg.from,
            body: msg.body,
            timestamp: msg.dateCreated,
            status: msg.hasResponse ? 'responded' : 'pending',
            language: detectedLang,
            aiResponse: msg.aiResponse,
            hasResponse: msg.hasResponse
          }
        })
        
        setMessages(formattedMessages)
        console.log(`Loaded ${formattedMessages.length} messages`)
      } else {
        console.error('Failed to fetch messages:', data.error)
        setMessages([])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  const fetchDebugInfo = async () => {
    try {
      const response = await fetch('/api/twilio/debug')
      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      console.error('Error fetching debug info:', error)
    }
  }

  const handleManualResponse = async (messageId: string) => {
    try {
      const message = messages.find(m => m.id === messageId)
      if (!message || message.hasResponse) return

      console.log('Generating manual response for:', message.body, 'Language:', message.language)

      const response = await fetch('/api/ai/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.body,
          language: message.language
        })
      })

      if (!response.ok) {
        throw new Error(`AI API failed: ${response.status}`)
      }

      const { aiResponse } = await response.json()
      
      if (!aiResponse) {
        throw new Error('No AI response received')
      }

      console.log('AI response generated:', aiResponse)

      const smsResponse = await fetch('/api/twilio/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: message.from,
          body: aiResponse
        })
      })

      if (!smsResponse.ok) {
        throw new Error('Failed to send SMS')
      }

      setMessages(prev => prev.map(m => 
        m.id === messageId 
          ? { ...m, aiResponse, status: 'responded' as const, hasResponse: true }
          : m
      ))

      console.log('Manual response sent successfully')

    } catch (error) {
      console.error('Error in manual response:', error)
      setMessages(prev => prev.map(m => 
        m.id === messageId 
          ? { ...m, status: 'failed' as const }
          : m
      ))
    }
  }

  const getLanguageFlag = (language: string) => {
    switch (language) {
      case 'am': return '🇪🇹 አማርኛ'
      case 'or': return '🇪🇹 Afaan Oromoo'
      case 'ti': return '🇪🇹 ትግርኛ'
      default: return '🇺🇸 English'
    }
  }

  const pendingCount = messages.filter(m => !m.hasResponse).length
  const respondedCount = messages.filter(m => m.hasResponse).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">SMS Messages ({messages.length})</h2>
          <p className="text-sm text-muted-foreground">
            {respondedCount} responded • {pendingCount} pending
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchMessages} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={fetchDebugInfo}>
            Debug
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {messages.length === 0 && !loading && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  No SMS messages found. Try sending a message to {process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER || '+16205420981'}
                </p>
              </CardContent>
            </Card>
          )}
          {messages.map((message) => (
            <Card key={message.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {message.from}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {getLanguageFlag(message.language)}
                    </Badge>
                    <Badge 
                      variant={
                        message.status === 'responded' ? 'default' :
                        message.status === 'pending' ? 'secondary' : 'destructive'
                      }
                    >
                      {message.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(message.timestamp).toLocaleString()}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 mt-1 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Farmer Message:</p>
                    <p className="text-sm text-muted-foreground">{message.body}</p>
                  </div>
                </div>

                {message.aiResponse && (
                  <div className="flex items-start gap-3">
                    <Bot className="h-5 w-5 mt-1 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">AI Response:</p>
                      <p className="text-sm text-muted-foreground">{message.aiResponse}</p>
                    </div>
                  </div>
                )}

                {!message.hasResponse && (
                  <Button 
                    onClick={() => handleManualResponse(message.id)}
                    disabled={loading}
                    size="sm"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Generate AI Response
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {debugInfo && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto max-h-40">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
