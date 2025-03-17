"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart4, MessageSquare, PieChart, Settings, User } from "lucide-react"

interface DashboardSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function DashboardSidebar({ activeTab, setActiveTab }: DashboardSidebarProps) {
  const navItems = [
    {
      name: "Messages",
      icon: <MessageSquare className="h-5 w-5" />,
      value: "messages",
    },
    {
      name: "Profile",
      icon: <User className="h-5 w-5" />,
      value: "profile",
    },
    {
      name: "Polls",
      icon: <PieChart className="h-5 w-5" />,
      value: "polls",
    },
    {
      name: "Analytics",
      icon: <BarChart4 className="h-5 w-5" />,
      value: "analytics",
    },
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      value: "settings",
    },
  ]

  return (
    <aside className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
      <div className="flex flex-col gap-2 p-4">
        {navItems.map((item) => (
          <Button
            key={item.value}
            variant={activeTab === item.value ? "default" : "ghost"}
            className="justify-start"
            onClick={() => setActiveTab(item.value)}
          >
            {item.icon}
            <span className="ml-2">{item.name}</span>
          </Button>
        ))}
      </div>
      <div className="mt-auto p-4">
        <div className="rounded-lg bg-muted p-4">
          <h3 className="font-semibold">Share your Sliich</h3>
          <p className="mt-1 text-sm text-muted-foreground">Let others send you anonymous messages</p>
          <Button className="mt-3 w-full" size="sm" asChild>
            <Link href="/share">Share Link</Link>
          </Button>
        </div>
      </div>
    </aside>
  )
}

