'use client'

import { Button } from "@/components/ui/button"

interface NavbarProps {
  onCreateClick?: () => void
}

export default function Navbar({ onCreateClick }: NavbarProps) {
  return (
    <nav className="w-full px-6 py-4 border-b shadow-sm bg-white flex justify-between items-center">
      <h1 className="text-xl font-semibold">Flashcards</h1>
      <Button onClick={onCreateClick}>Criar flashcard</Button>
    </nav>
  )
}
