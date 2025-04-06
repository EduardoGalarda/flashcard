'use client'

import { FlashcardType } from "@/types/Flashcard"

export default function Flashcard({ card }: { card: FlashcardType }) {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h3 className="font-bold text-lg">{card.title}</h3>
      <h4 className="text-sm text-gray-600">{card.subtitle}</h4>
      <p className="mt-2">{card.description}</p>
      <div className="mt-4">
        <strong>Conteúdo do verso:</strong>
        <p>{card.backContent}</p>
      </div>
    </div>
  )
}
