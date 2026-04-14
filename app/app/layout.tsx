import { AppShell } from '@/components/app-shell/app-shell'
import { ChatWidget } from '@/components/chat/chat-widget'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppShell>
      {children}
      <ChatWidget />
    </AppShell>
  )
}
