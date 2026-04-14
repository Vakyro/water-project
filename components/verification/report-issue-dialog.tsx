"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { REPORT_CATEGORIES } from '@/src/core/constants'
import { addReport } from '@/src/data/reports'
import { Loader2, CheckCircle2 } from 'lucide-react'

interface ReportIssueDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onReportAdded?: () => void
  reportType?: 'chat' | 'map' | 'city_page' | 'other'
  route?: string
  citySlug?: string
  entityId?: string
  chatMessageId?: string
}

export function ReportIssueDialog({
  open,
  onOpenChange,
  onReportAdded,
  reportType = 'other',
  route = '/',
  citySlug,
  entityId,
  chatMessageId,
}: ReportIssueDialogProps) {
  const [category, setCategory] = useState<string>('')
  const [description, setDescription] = useState('')
  const [suggestedFix, setSuggestedFix] = useState('')
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!category || !description) return

    setIsSubmitting(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    addReport({
      reportType,
      route,
      citySlug,
      entityId,
      chatMessageId,
      reasonCategory: category,
      description,
      suggestedFix: suggestedFix || undefined,
      severity,
    })

    setIsSubmitting(false)
    setIsSubmitted(true)
    onReportAdded?.()

    // Reset and close after showing success
    setTimeout(() => {
      setCategory('')
      setDescription('')
      setSuggestedFix('')
      setSeverity('medium')
      setIsSubmitted(false)
      onOpenChange(false)
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold">Report Submitted</h3>
            <p className="text-muted-foreground text-center mt-2">
              Thank you for helping improve data accuracy.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report an Issue</DialogTitle>
          <DialogDescription>
            Help us improve by reporting incorrect or misleading information.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category">Issue Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="suggested-fix">Suggested Fix (Optional)</Label>
            <Textarea
              id="suggested-fix"
              placeholder="How should this be corrected?"
              value={suggestedFix}
              onChange={(e) => setSuggestedFix(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Severity</Label>
            <RadioGroup 
              value={severity} 
              onValueChange={(v) => setSeverity(v as 'low' | 'medium' | 'high')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="font-normal">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="font-normal">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="font-normal">High</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!category || !description || isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
