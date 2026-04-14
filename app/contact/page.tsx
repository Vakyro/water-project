'use client'

import { useState } from 'react'
import { LandingHeader } from '@/components/landing/landing-header'
import { LandingFooter } from '@/components/landing/landing-footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mail, Github, BookOpen, Bug, MessageSquare, CheckCircle2 } from 'lucide-react'

const contactReasons = [
  { value: 'data-error', label: 'Data error or incorrect information' },
  { value: 'research', label: 'Research collaboration' },
  { value: 'technical', label: 'Technical issue or bug' },
  { value: 'media', label: 'Media or press inquiry' },
  { value: 'general', label: 'General question' },
  { value: 'other', label: 'Other' },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [subject, setSubject] = useState('')
  const [reason, setReason] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real implementation this would POST to an API route
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 px-4 border-b border-border bg-gradient-to-b from-secondary/30 to-background">
          <div className="container mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">Contact</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground">
              Found an error in the data? Have a research collaboration idea?
              Want to report a technical issue? Reach out below.
            </p>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Contact Options */}
              <div className="space-y-4">
                <h2 className="font-semibold text-lg">Other Ways to Reach Us</h2>

                <Card>
                  <CardContent className="pt-5 flex items-start gap-3">
                    <Bug className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Report a Data Error</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Use the Verification Center inside the app to flag incorrect
                        map data, chatbot answers, or city profiles.
                      </p>
                      <a href="/app/verification" className="text-xs text-primary underline underline-offset-4 mt-2 inline-block">
                        Open Verification Center →
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-5 flex items-start gap-3">
                    <Github className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-sm">GitHub Issues</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Technical bugs and feature requests can be submitted as
                        GitHub issues for faster triage.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-5 flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Research Inquiries</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        For academic collaborations, data sharing agreements, or
                        research partnerships, use the form and select Research Collaboration.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-5 flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Response Time</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        This is a small independent project. We aim to respond within
                        5–10 business days. Data error reports are prioritized.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="md:col-span-2">
                {submitted ? (
                  <Card>
                    <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
                      <CheckCircle2 className="h-12 w-12 text-teal-600" />
                      <h3 className="text-xl font-semibold">Message Sent</h3>
                      <p className="text-muted-foreground max-w-sm">
                        Thank you for reaching out. We review all messages and will
                        follow up if a response is needed.
                      </p>
                      <Button variant="outline" onClick={() => setSubmitted(false)}>
                        Send Another
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Send a Message</CardTitle>
                      <CardDescription>
                        All fields are optional except the message itself.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="email">Your Email (optional)</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="you@example.com"
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reason">Reason</Label>
                            <Select value={reason} onValueChange={setReason}>
                              <SelectTrigger id="reason">
                                <SelectValue placeholder="Select a reason" />
                              </SelectTrigger>
                              <SelectContent>
                                {contactReasons.map(r => (
                                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject (optional)</Label>
                          <Input
                            id="subject"
                            placeholder="Brief subject line"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            placeholder="Describe your question, issue, or idea..."
                            rows={6}
                            required
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                          />
                        </div>

                        <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                          Your message and email (if provided) will be stored securely.
                          We do not share contact information with third parties. See our{' '}
                          <a href="/privacy" className="text-primary underline underline-offset-4">
                            Privacy Policy
                          </a>
                          .
                        </div>

                        <Button type="submit" className="w-full">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Send Message
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
