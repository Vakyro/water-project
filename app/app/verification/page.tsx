"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getAllReports } from '@/src/data/reports'
import { Search, CheckCircle2, Clock, AlertTriangle, FileText, MapPin, MessageSquare, Settings } from 'lucide-react'
import { ReportIssueDialog } from '@/components/verification/report-issue-dialog'
import type { Report } from '@/src/core/types'

const statusConfig: Record<Report['status'], { label: string; className: string; icon: React.ReactNode }> = {
  new: {
    label: 'Pending',
    className: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
    icon: <Clock className="h-3 w-3 mr-1" />,
  },
  triaged: {
    label: 'Investigating',
    className: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
    icon: <AlertTriangle className="h-3 w-3 mr-1" />,
  },
  fixed: {
    label: 'Resolved',
    className: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
    icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
  },
  wont_fix: {
    label: "Won't Fix",
    className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    icon: null,
  },
}

const reportTypeLabels: Record<Report['reportType'], string> = {
  chat: 'Chatbot',
  map: 'Map',
  city_page: 'City Page',
  other: 'Other',
}

const reportTypeIcons: Record<Report['reportType'], React.ReactNode> = {
  chat: <MessageSquare className="h-3.5 w-3.5" />,
  map: <MapPin className="h-3.5 w-3.5" />,
  city_page: <FileText className="h-3.5 w-3.5" />,
  other: <Settings className="h-3.5 w-3.5" />,
}

type FilterTab = 'all' | 'pending' | 'investigating' | 'resolved'

const tabToStatuses: Record<FilterTab, Report['status'][]> = {
  all: ['new', 'triaged', 'fixed', 'wont_fix'],
  pending: ['new'],
  investigating: ['triaged'],
  resolved: ['fixed', 'wont_fix'],
}

export default function VerificationPage() {
  const [reports, setReports] = useState<Report[]>(() => getAllReports())
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  function handleReportAdded() {
    setReports(getAllReports())
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch =
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reasonCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.citySlug ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = tabToStatuses[activeTab].includes(report.status)
    return matchesSearch && matchesStatus
  })

  const pendingCount = reports.filter(r => r.status === 'new').length
  const investigatingCount = reports.filter(r => r.status === 'triaged').length
  const resolvedCount = reports.filter(r => r.status === 'fixed' || r.status === 'wont_fix').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Verification Center</h1>
          <p className="text-muted-foreground">Community-driven data verification and issue reporting</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <FileText className="mr-2 h-4 w-4" />
          Report Issue
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Investigating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky-600">{investigatingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">{resolvedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">How Verification Works</h3>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { step: '1', title: 'Report Issue', desc: 'Submit data concerns or corrections' },
              { step: '2', title: 'Community Review', desc: 'Others can view and flag the same issue' },
              { step: '3', title: 'Expert Verification', desc: 'Domain experts investigate the claim' },
              { step: '4', title: 'Data Updated', desc: 'Changes applied and report marked resolved' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                  {step}
                </div>
                <div>
                  <p className="font-medium text-sm">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by description, category, or city..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={activeTab} onValueChange={v => setActiveTab(v as FilterTab)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="investigating">Investigating</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredReports.length} of {reports.length} reports
        </p>

        {filteredReports.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No reports match your search.
            </CardContent>
          </Card>
        )}

        {filteredReports.map(report => {
          const status = statusConfig[report.status]
          const affectedRef = report.citySlug ?? report.entityId ?? report.route

          return (
            <Card key={report.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="pt-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start">
                  <div className="flex-1 space-y-2">
                    {/* Badges row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={status.className}>
                        {status.icon}
                        {status.label}
                      </Badge>
                      <Badge variant="outline" className="gap-1 text-xs">
                        {reportTypeIcons[report.reportType]}
                        {reportTypeLabels[report.reportType]}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          report.severity === 'high'
                            ? 'border-blue-500 text-blue-700'
                            : report.severity === 'medium'
                            ? 'border-sky-400 text-sky-700'
                            : 'border-slate-400 text-slate-600'
                        }`}
                      >
                        {report.severity} severity
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Category */}
                    <p className="font-medium">{report.reasonCategory}</p>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground">{report.description}</p>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>Source: <span className="font-medium">{affectedRef}</span></span>
                    </div>
                  </div>
                </div>

                {/* Suggested fix */}
                {report.suggestedFix && (
                  <div className={`mt-4 p-3 rounded-lg border-l-4 bg-muted/50 ${
                    report.status === 'fixed' ? 'border-l-teal-500' : 'border-l-sky-400'
                  }`}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                      {report.status === 'fixed' ? 'Resolution' : 'Suggested Fix'}
                    </p>
                    <p className="text-sm text-muted-foreground">{report.suggestedFix}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <ReportIssueDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onReportAdded={handleReportAdded} />
    </div>
  )
}
