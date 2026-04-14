import type { Report } from '@/src/core/types'

export const mockReports: Report[] = [
  {
    id: 'rpt-001',
    createdAt: new Date('2024-03-14T10:30:00'),
    reportType: 'chat',
    route: '/app',
    chatMessageId: 'msg-123',
    reasonCategory: 'Incorrect data',
    description: 'The chatbot stated that the Carlsbad Desalination Plant produces 100 MGD, but it actually produces 50 MGD.',
    suggestedFix: 'Update the capacity to 50 MGD as per official Poseidon Water documentation.',
    severity: 'medium',
    status: 'triaged',
  },
  {
    id: 'rpt-002',
    createdAt: new Date('2024-03-13T15:45:00'),
    reportType: 'map',
    route: '/app/map',
    entityId: 'tj-wwtp-1',
    reasonCategory: 'Outdated information',
    description: 'The PTAR San Antonio de los Buenos facility marker shows it as operational, but it has been under maintenance since February 2024.',
    severity: 'high',
    status: 'new',
  },
  {
    id: 'rpt-003',
    createdAt: new Date('2024-03-12T09:20:00'),
    reportType: 'city_page',
    route: '/app/contamination/tijuana',
    citySlug: 'tijuana',
    reasonCategory: 'Missing information',
    description: 'The contamination page does not mention the recent sewage spill incident from March 2024.',
    suggestedFix: 'Add information about the March 2024 spill event and its impact on beach closures.',
    severity: 'medium',
    status: 'fixed',
  },
  {
    id: 'rpt-004',
    createdAt: new Date('2024-03-11T14:00:00'),
    reportType: 'chat',
    route: '/app',
    chatMessageId: 'msg-456',
    reasonCategory: 'Misleading content',
    description: 'The chatbot implied that all Tijuana beaches are safe for swimming, which is not accurate given recent contamination events.',
    severity: 'high',
    status: 'triaged',
  },
  {
    id: 'rpt-005',
    createdAt: new Date('2024-03-10T11:30:00'),
    reportType: 'other',
    route: '/app/water-analysis',
    reasonCategory: 'Technical error',
    description: 'The water quality comparison chart shows incorrect units for salinity (should be ppt, not mg/L).',
    suggestedFix: 'Correct the unit labels on the salinity axis.',
    severity: 'low',
    status: 'wont_fix',
  },
]

let reports = [...mockReports]

export function getAllReports(): Report[] {
  return reports.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function getReportById(id: string): Report | undefined {
  return reports.find(r => r.id === id)
}

export function addReport(report: Omit<Report, 'id' | 'createdAt' | 'status'>): Report {
  const newReport: Report = {
    ...report,
    id: `rpt-${Date.now()}`,
    createdAt: new Date(),
    status: 'new',
  }
  reports = [newReport, ...reports]
  return newReport
}

export function getReportsByStatus(status: Report['status']): Report[] {
  return reports.filter(r => r.status === status)
}
