import { LandingHeader } from '@/components/landing/landing-header'
import { LandingFooter } from '@/components/landing/landing-footer'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck } from 'lucide-react'

const sections = [
  {
    title: '1. What This Platform Is',
    content: `Water Quality Analysis Platform is a free, educational web application for exploring water quality,
      infrastructure, and environmental research in the Baja California and Southern California border region.
      It is operated independently and is not affiliated with any government agency.
      The platform does not offer a commercial service, does not process payments, and does not require account creation.`,
  },
  {
    title: '2. Data We Collect',
    content: `We do not collect personal data for marketing purposes. The following limited data may be collected:
      \n\n• Verification reports submitted through the platform (report type, description, route, optional contact info you choose to provide).
      \n• Analytics data through Vercel Analytics (page views, referrer, country — no PII, no tracking cookies).
      \n• Research chatbot queries are processed transiently to generate responses and are not stored long-term or associated with identifiers.
      \n\nNo account registration is required. We do not use third-party advertising trackers.`,
  },
  {
    title: '3. Verification Reports',
    content: `When you submit a verification report through the platform, the following information is stored in our database:
      \n\n• Report type, category, and description you provide
      \n• The URL or entity the report refers to
      \n• Timestamp of submission
      \n\nReports are used to improve data accuracy on the platform. They are not shared with third parties.
      If you include contact information voluntarily, it is used only to follow up on the specific report.`,
  },
  {
    title: '4. Research Chatbot',
    content: `Research chatbot queries are sent to our embedding service and to the Groq API for answer generation.
      Queries are used only to produce the answer shown to you. We do not store your queries long-term or associate them with identifiers.
      Chatbot responses are generated from indexed scientific paper chunks stored in Supabase. No personal data is needed to use the chatbot.`,
  },
  {
    title: '5. Third-Party Services',
    content: `The platform uses the following third-party services:
      \n\n• Vercel — hosting and edge infrastructure (Privacy Policy: vercel.com/legal/privacy-policy)
      \n• Supabase — database for research paper chunks and verification reports (Privacy Policy: supabase.com/privacy)
      \n• Groq — LLM API for chatbot answer generation (Privacy Policy: groq.com/privacy)
      \n\nThese services receive the minimum data necessary to provide their respective functions.`,
  },
  {
    title: '6. Cookies',
    content: `This platform uses minimal cookies:
      \n\n• A theme preference cookie (light/dark mode) stored in your browser — this contains no personal information.
      \n• Vercel Analytics may set performance cookies for aggregate analytics. No advertising or cross-site tracking cookies are used.
      \n\nYou can disable cookies in your browser settings without affecting most functionality of the platform.`,
  },
  {
    title: '7. Data Retention',
    content: `Verification reports submitted to the platform are stored indefinitely unless you request deletion.
      Analytics data is retained according to Vercel Analytics retention policies.
      Chatbot queries are not stored beyond the session required to generate the response.`,
  },
  {
    title: '8. Your Rights',
    content: `You may request:
      \n\n• Deletion of any verification report you submitted (contact us with the report details)
      \n• Information about what data we may hold related to you
      \n\nTo exercise these rights, contact us using the information on the Contact page.`,
  },
  {
    title: '9. Children\'s Privacy',
    content: `This platform is not directed to children under the age of 13. We do not knowingly collect personal information from children.
      If you believe a child has submitted personal information through the platform, contact us and we will remove it.`,
  },
  {
    title: '10. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. Material changes will be noted at the top of this page with the effective date.
      Continued use of the platform after changes constitutes acceptance of the updated policy.`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 px-4 border-b border-border bg-gradient-to-b from-secondary/30 to-background">
          <div className="container mx-auto max-w-3xl text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <Badge variant="secondary">Privacy Policy</Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Your Privacy
            </h1>
            <p className="text-muted-foreground text-lg">
              We keep it simple: this is a free educational platform. We collect minimal data
              and do not sell, share, or monetize your information.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: March 2026
            </p>
          </div>
        </section>

        {/* Policy Sections */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="space-y-6">
              {sections.map((section) => (
                <Card key={section.title}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-lg border border-border bg-muted/30">
              <p className="text-sm text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us via the{' '}
                <a href="/contact" className="text-primary underline underline-offset-4">Contact page</a>.
              </p>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
