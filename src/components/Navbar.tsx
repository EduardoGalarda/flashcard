"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, Settings, Menu } from "lucide-react"
import { useState, useEffect } from "react"
import SettingsForm from "./SettingsForm"
import { useMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface NavbarProps {
  onCreateClick?: () => void
}

export default function Navbar({ onCreateClick }: NavbarProps) {
  const [showSettings, setShowSettings] = useState(false)
  const { isMobile } = useMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSettingsClick = () => {
    setShowSettings(true)
    setIsMenuOpen(false)
  }

  const handleCloseSettings = () => {
    setShowSettings(false)
  }

  const handleCreateClickMobile = () => {
    if (onCreateClick) {
      onCreateClick()
      setIsMenuOpen(false)
    }
  }

  // Fechar o menu quando a tela for redimensionada para desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false)
    }
  }, [isMobile])

  return (
    <>
      <nav
        className="w-full px-4 sm:px-6 py-3 sm:py-4 border-b shadow-md sticky top-0 z-10"
        style={{ backgroundColor: "var(--sidebar)" }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-lg sm:text-xl font-semibold" style={{ color: "var(--sidebar-foreground)" }}>
            Flashcards
          </h1>

          {isMobile ? (
            // Menu móvel
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  style={{ color: "var(--sidebar-foreground)" }}
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="z-50">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-3 mt-6">
                  <Button onClick={handleCreateClickMobile} className="flex items-center gap-2 w-full justify-start">
                    <PlusCircle className="h-4 w-4" />
                    Criar flashcard
                  </Button>
                  <Button
                    onClick={handleSettingsClick}
                    variant="outline"
                    className="flex items-center gap-2 w-full justify-start"
                  >
                    <Settings className="h-4 w-4" />
                    Configurações
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            // Menu desktop
            <div className="flex items-center gap-3">
              <Button onClick={onCreateClick} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Criar flashcard
              </Button>
              <Button
                onClick={handleSettingsClick}
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-transparent"
                style={{
                  color: "var(--sidebar-foreground)",
                }}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Configurações</span>
              </Button>
            </div>
          )}
        </div>
      </nav>

      {showSettings && <SettingsForm onClose={handleCloseSettings} />}
    </>
  )
}
