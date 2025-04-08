"use client"

import type { FlashcardType } from "@/types/Flashcard"
import Flashcard from "@/components/Flashcard"
import { useState, useEffect } from "react"

export default function FlashcardList({ flashcards: initialFlashcards }: { flashcards: FlashcardType[] }) {
  // Estado local para gerenciar os flashcards
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([])

  // Atualizar o estado local quando as props mudarem
  useEffect(() => {
    if (Array.isArray(initialFlashcards)) {
      setFlashcards(initialFlashcards)
    }
  }, [initialFlashcards])

  // Função para atualizar um flashcard na lista
  const handleUpdateFlashcard = (updatedCard: FlashcardType) => {
    setFlashcards((prevCards) => prevCards.map((card) => (card.id === updatedCard.id ? updatedCard : card)))
  }

  // Função para remover um flashcard da lista
  const handleDeleteFlashcard = (id: string) => {
    setFlashcards((prevCards) => prevCards.filter((card) => card.id !== id))
  }

  return (
    <div className="mt-8">
      {flashcards.length === 0 ? (
        <div className="text-center p-8 bg-card rounded-lg shadow-sm border">
          <h3 className="text-xl font-medium text-card-foreground">Nenhum flashcard ainda</h3>
          <p className="text-muted-foreground mt-2">Clique em "Criar flashcard" para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcards.map((card) => (
            <Flashcard key={card.id} card={card} onUpdate={handleUpdateFlashcard} onDelete={handleDeleteFlashcard} />
          ))}
        </div>
      )}
    </div>
  )
}
