"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, Settings } from "lucide-react"
import { useState } from "react"
import SettingsForm from "./SettingsForm"

interface NavbarProps {
  onCreateClick?: () => void
}

export default function Navbar({ onCreateClick }: NavbarProps) {
  const [showSettings, setShowSettings] = useState(false)

  const handleSettingsClick = () => {
    setShowSettings(true)
  }

  const handleCloseSettings = () => {
    setShowSettings(false)
  }

  return (
    <>
      <nav
        className="w-full px-6 py-4 border-b shadow-md sticky top-0 z-10"
        style={{ backgroundColor: "var(--sidebar)" }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold" style={{ color: "var(--sidebar-foreground)" }}>
            Flashcards
          </h1>
          <div className="flex items-center gap-3">
            <Button
              onClick={onCreateClick}
              className="flex items-center gap-2"
              style={{
                backgroundColor: "var(--sidebar-foreground)",
                color: "var(--sidebar)",
              }}
            >
              <PlusCircle className="h-4 w-4" />
              Criar flashcard
            </Button>
            <Button
              onClick={handleSettingsClick}
              variant="ghost"
              size="icon"
              className="rounded-full"
              style={{
                color: "var(--sidebar-foreground)",
              }}
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Configurações</span>
            </Button>
          </div>
        </div>
      </nav>

      {showSettings && <SettingsForm onClose={handleCloseSettings} />}
    </>
  )
}

