"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, X, Tag, BookOpen, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface FilterBarProps {
  onFilterChange: (filters: { category: string; subject: string; searchQuery: string }) => void
  totalCards: number
  filteredCount: number
  activeFilters: {
    category: string
    subject: string
    searchQuery: string
  }
}

export default function FilterBar({ onFilterChange, totalCards, filteredCount, activeFilters }: FilterBarProps) {
  const [categories, setCategories] = useState<string[]>([])
  const [subjects, setSubjects] = useState<string[]>([])
  const [isFiltering, setIsFiltering] = useState(false)

  // Carregar categorias e assuntos ao iniciar
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings")
        if (res.ok) {
          const data = await res.json()
          setCategories(data.categories || [])
          setSubjects(data.subjects || [])
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error)
      }
    }

    fetchSettings()
  }, [])

  // Atualizar o estado de filtragem
  useEffect(() => {
    setIsFiltering(activeFilters.category !== "" || activeFilters.subject !== "" || activeFilters.searchQuery !== "")
  }, [activeFilters])

  const handleCategoryChange = (value: string) => {
    onFilterChange({
      ...activeFilters,
      category: value === "all" ? "" : value,
    })
  }

  const handleSubjectChange = (value: string) => {
    onFilterChange({
      ...activeFilters,
      subject: value === "all" ? "" : value,
    })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...activeFilters,
      searchQuery: e.target.value,
    })
  }

  const handleClearSearch = () => {
    onFilterChange({
      ...activeFilters,
      searchQuery: "",
    })
  }

  const handleClearCategory = () => {
    onFilterChange({
      ...activeFilters,
      category: "",
    })
  }

  const handleClearSubject = () => {
    onFilterChange({
      ...activeFilters,
      subject: "",
    })
  }

  const handleClearFilters = () => {
    onFilterChange({
      category: "",
      subject: "",
      searchQuery: "",
    })
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          {/* Barra de pesquisa */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar flashcards..."
              value={activeFilters.searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-10"
            />
            {activeFilters.searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Filtrar por</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
              <Select value={activeFilters.category || "all"} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <SelectValue placeholder="Todas as categorias" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category, index) => (
                    <SelectItem key={index} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={activeFilters.subject || "all"} onValueChange={handleSubjectChange}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <SelectValue placeholder="Todos os assuntos" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os assuntos</SelectItem>
                  {subjects.map((subject, index) => (
                    <SelectItem key={index} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isFiltering && (
              <Button variant="outline" size="sm" onClick={handleClearFilters} className="flex items-center gap-1">
                <X className="h-4 w-4" />
                Limpar tudo
              </Button>
            )}
          </div>
        </div>

        {isFiltering && (
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
            {activeFilters.searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Search className="h-3 w-3" />
                {activeFilters.searchQuery}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearSearch}
                  className="h-4 w-4 ml-1 p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {activeFilters.category && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {activeFilters.category}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearCategory}
                  className="h-4 w-4 ml-1 p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {activeFilters.subject && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {activeFilters.subject}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearSubject}
                  className="h-4 w-4 ml-1 p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            <span className="text-sm ml-auto">
              Mostrando {filteredCount} de {totalCards} flashcards
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
