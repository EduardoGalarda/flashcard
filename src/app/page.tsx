"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import FlashcardList from "@/components/FlashcardList"
import FlashcardForm from "@/components/FlashcardForm"
import type { FlashcardType } from "@/types/Flashcard"

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Carregar flashcards ao iniciar
  const fetchFlashcards = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/flashcards")
      const data = await res.json()

      if (Array.isArray(data.flashcards)) {
        setFlashcards(data.flashcards)
      } else {
        console.error("Dados de flashcards inválidos:", data)
        setFlashcards([])
      }
    } catch (error) {
      console.error("Erro ao carregar flashcards:", error)
      setFlashcards([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFlashcards()
  }, [])

  const handleCreateClick = () => {
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
  }

  const handleFlashcardCreated = (newFlashcard: FlashcardType) => {
    setFlashcards((prev) => [newFlashcard, ...prev])
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar onCreateClick={handleCreateClick} />
      <div className="container mx-auto px-4 py-8">
        {showForm && <FlashcardForm onClose={handleCloseForm} onFlashcardCreated={handleFlashcardCreated} />}

        {isLoading ? (
          <div className="flex justify-center mt-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <FlashcardList flashcards={flashcards} />
        )}
      </div>
    </main>
  )
}

