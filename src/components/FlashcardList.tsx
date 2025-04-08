"use client"

import { useState, useEffect, useCallback } from "react"
import type { FlashcardType } from "@/types/Flashcard"
import Flashcard from "@/components/Flashcard"
import FilterBar from "@/components/FilterBar"

export default function FlashcardList({ flashcards: initialFlashcards }: { flashcards: FlashcardType[] }) {
  // Estado local para gerenciar os flashcards
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([])
  const [filteredFlashcards, setFilteredFlashcards] = useState<FlashcardType[]>([])
  const [filters, setFilters] = useState({
    category: "",
    subject: "",
    searchQuery: "",
  })

  // Atualizar o estado local quando as props mudarem
  useEffect(() => {
    if (Array.isArray(initialFlashcards)) {
      setFlashcards(initialFlashcards)
    }
  }, [initialFlashcards])

  // Aplicar filtros aos flashcards
  useEffect(() => {
    let result = [...flashcards]

    // Filtrar por categoria
    if (filters.category) {
      result = result.filter((card) => card.category === filters.category)
    }

    // Filtrar por assunto
    if (filters.subject) {
      result = result.filter((card) => card.subject === filters.subject)
    }

    // Filtrar por texto de pesquisa
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      result = result.filter(
        (card) =>
          card.title.toLowerCase().includes(query) ||
          card.subtitle.toLowerCase().includes(query) ||
          card.description.toLowerCase().includes(query) ||
          card.backContent.toLowerCase().includes(query),
      )
    }

    setFilteredFlashcards(result)
  }, [flashcards, filters])

  // Função para atualizar um flashcard na lista
  const handleUpdateFlashcard = (updatedCard: FlashcardType) => {
    setFlashcards((prevCards) => prevCards.map((card) => (card.id === updatedCard.id ? updatedCard : card)))
  }

  // Função para remover um flashcard da lista
  const handleDeleteFlashcard = (id: string) => {
    setFlashcards((prevCards) => prevCards.filter((card) => card.id !== id))
  }

  // Função para atualizar os filtros
  const handleFilterChange = useCallback((newFilters: { category: string; subject: string; searchQuery: string }) => {
    setFilters(newFilters)
  }, [])

  // Funções para filtrar por categoria ou assunto ao clicar no card
  const handleFilterByCategory = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category }))
  }, [])

  const handleFilterBySubject = useCallback((subject: string) => {
    setFilters((prev) => ({ ...prev, subject }))
  }, [])

  return (
    <div>
      <FilterBar
        onFilterChange={handleFilterChange}
        totalCards={flashcards.length}
        filteredCount={filteredFlashcards.length}
        activeFilters={filters}
      />

      <div className="mt-6">
        {flashcards.length === 0 ? (
          <div className="text-center p-8 bg-card rounded-lg shadow-sm border">
            <h3 className="text-xl font-medium text-card-foreground">Nenhum flashcard ainda</h3>
            <p className="text-muted-foreground mt-2">Clique em "Criar flashcard" para começar</p>
          </div>
        ) : filteredFlashcards.length === 0 ? (
          <div className="text-center p-8 bg-card rounded-lg shadow-sm border">
            <h3 className="text-xl font-medium text-card-foreground">Nenhum flashcard encontrado</h3>
            <p className="text-muted-foreground mt-2">Tente ajustar os filtros para ver mais resultados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlashcards.map((card) => (
              <Flashcard
                key={card.id}
                card={card}
                onUpdate={handleUpdateFlashcard}
                onDelete={handleDeleteFlashcard}
                onFilterByCategory={handleFilterByCategory}
                onFilterBySubject={handleFilterBySubject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
