'use client'

import { FlashcardType } from "@/types/Flashcard" // Importe a interface FlashcardType
import Flashcard from "@/components/Flashcard"

export default function FlashcardList({ flashcards }: { flashcards: FlashcardType[] }) {
  // Garantir que flashcards seja sempre um array
  const flashcardsList = Array.isArray(flashcards) ? flashcards : []

  return (
    <div className="grid gap-4 mt-8">
      {flashcardsList.length === 0 ? (
        <p className="text-gray-500 text-center">Nenhum flashcard ainda.</p>
      ) : (
        flashcardsList.map((card) => <Flashcard key={card.id} card={card} />)
      )}
    </div>
  )
}
