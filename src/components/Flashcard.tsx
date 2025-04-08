"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import type { FlashcardType } from "@/types/Flashcard"
import { Button } from "@/components/ui/button"
import { RefreshCw, Edit, Save, X, Trash2, Tag, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MarkdownRenderer from "./MarkdownRenderer"
import MarkdownGuide from "./MarkdownGuide"

interface FlashcardProps {
  card: FlashcardType
  onUpdate?: (updatedCard: FlashcardType) => void
  onDelete?: (id: string) => void
}

export default function Flashcard({ card, onUpdate, onDelete }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    title: card.title,
    subtitle: card.subtitle,
    description: card.description,
    backContent: card.backContent,
    category: card.category || "",
    subject: card.subject || "",
  })
  const [categories, setCategories] = useState<string[]>([])
  const [subjects, setSubjects] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false)
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false)
  const [showDeleteErrorModal, setShowDeleteErrorModal] = useState(false)

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

  const handleFlip = () => {
    if (!isEditing) {
      setIsFlipped(!isFlipped)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    // Garantir que estamos na frente do card ao editar
    setIsFlipped(false)
  }

  const handleCancelEdit = () => {
    // Restaurar os valores originais
    setEditForm({
      title: card.title,
      subtitle: card.subtitle,
      description: card.description,
      backContent: card.backContent,
      category: card.category || "",
      subject: card.subject || "",
    })
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    // Se o valor for "none-value", armazenamos como string vazia
    const finalValue = value === "none-value" ? "" : value
    setEditForm((prev) => ({ ...prev, [name]: finalValue }))
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const res = await fetch(`/api/flashcards/${card.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error("Erro na resposta da API:", data)
        throw new Error(data.error || "Falha ao atualizar o flashcard")
      }

      // Notificar o componente pai sobre a atualização
      if (onUpdate && data.flashcard) {
        onUpdate(data.flashcard)
      }

      setShowSuccessModal(true)

      // Fechar o modo de edição após um breve delay
      setTimeout(() => {
        setIsEditing(false)
        setShowSuccessModal(false)
      }, 1500)
    } catch (error) {
      console.error("Erro ao atualizar flashcard:", error)
      setShowErrorModal(true)

      setTimeout(() => {
        setShowErrorModal(false)
      }, 1500)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirmModal(true)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    setShowDeleteConfirmModal(false)

    try {
      const res = await fetch(`/api/flashcards/${card.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        console.error("Erro na resposta da API:", data)
        throw new Error(data.error || "Falha ao excluir o flashcard")
      }

      setShowDeleteSuccessModal(true)

      // Notificar o componente pai sobre a exclusão
      if (onDelete) {
        setTimeout(() => {
          onDelete(card.id)
          setShowDeleteSuccessModal(false)
        }, 1500)
      }
    } catch (error) {
      console.error("Erro ao excluir flashcard:", error)
      setShowDeleteErrorModal(true)

      setTimeout(() => {
        setShowDeleteErrorModal(false)
      }, 1500)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirmModal(false)
  }

  useEffect(() => {
    // Restaurar os valores originais
    setEditForm({
      title: card.title,
      subtitle: card.subtitle,
      description: card.description,
      backContent: card.backContent,
      category: card.category || "",
      subject: card.subject || "",
    })
    setIsEditing(false)
  }, [card])

  // Modo de edição
  if (isEditing) {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Editar Flashcard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Título</label>
                <Input name="title" value={editForm.title} onChange={handleChange} placeholder="Título principal" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Subtítulo</label>
                <Input name="subtitle" value={editForm.subtitle} onChange={handleChange} placeholder="Subtítulo" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Categoria</label>
                <Select value={editForm.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length === 0 ? (
                      <SelectItem value="" disabled>
                        Nenhuma categoria disponível
                      </SelectItem>
                    ) : (
                      <>
                        <SelectItem value="none-value">Nenhuma categoria</SelectItem>
                        {categories.map((category, index) => (
                          <SelectItem key={index} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Assunto</label>
                <Select value={editForm.subject} onValueChange={(value) => handleSelectChange("subject", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um assunto" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.length === 0 ? (
                      <SelectItem value="" disabled>
                        Nenhum assunto disponível
                      </SelectItem>
                    ) : (
                      <>
                        <SelectItem value="none-value">Nenhum assunto</SelectItem>
                        {subjects.map((subject, index) => (
                          <SelectItem key={index} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium">
                  Descrição (frente) <span className="text-xs text-muted-foreground">suporta Markdown</span>
                </label>
                <MarkdownGuide />
              </div>
              <Textarea
                name="description"
                value={editForm.description}
                onChange={handleChange}
                placeholder="Descrição ou conteúdo (suporta Markdown)"
                className="min-h-[120px] font-mono text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium">
                  Conteúdo do verso <span className="text-xs text-muted-foreground">suporta Markdown</span>
                </label>
                <MarkdownGuide />
              </div>
              <Textarea
                name="backContent"
                value={editForm.backContent}
                onChange={handleChange}
                placeholder="Conteúdo do verso (suporta Markdown)"
                className="min-h-[120px] font-mono text-sm"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isSaving}>
            <X className="h-4 w-4 mr-1" />
            Cancelar
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-1" />
            Salvar
          </Button>
        </CardFooter>

        {/* Modais de feedback */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="flex items-center gap-3 text-green-600 text-center justify-center">
            <CheckCircle className="w-6 h-6" />
            <DialogHeader>
              <DialogTitle>Flashcard atualizado com sucesso!</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
          <DialogContent className="flex items-center gap-3 text-red-600 text-center justify-center">
            <XCircle className="w-6 h-6" />
            <DialogHeader>
              <DialogTitle>Erro ao atualizar o flashcard.</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </Card>
    )
  }

  // Modo de visualização (frente ou verso)
  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
        {!isFlipped ? (
          // Frente do card
          <div className="flex flex-col h-full">
            <CardHeader className="pb-2 flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-xl">{card.title || "Sem título"}</CardTitle>
                {card.subtitle && <p className="text-sm text-muted-foreground">{card.subtitle}</p>}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDeleteClick}
                  className="h-8 w-8 -mt-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEdit}
                  className="h-8 w-8 -mt-1 -mr-2"
                  disabled={isDeleting}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              {/* Badges para categoria e assunto */}
              {(card.category || card.subject) && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {card.category && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {card.category}
                    </Badge>
                  )}
                  {card.subject && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {card.subject}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex-grow">
                {card.description ? (
                  <MarkdownRenderer content={card.description} />
                ) : (
                  <p className="text-muted-foreground italic">Sem descrição</p>
                )}
              </div>

              <div className="flex justify-end mt-4">
                <Button variant="outline" size="icon" onClick={handleFlip} className="h-8 w-8" disabled={isDeleting}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </div>
        ) : (
          // Verso do card
          <div className="flex flex-col h-full">
            <CardHeader className="pb-2 flex flex-row items-start justify-between">
              <CardTitle className="text-xl">{card.title || "Sem título"}</CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDeleteClick}
                  className="h-8 w-8 -mt-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEdit}
                  className="h-8 w-8 -mt-1 -mr-2"
                  disabled={isDeleting}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              {/* Badges para categoria e assunto */}
              {(card.category || card.subject) && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {card.category && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {card.category}
                    </Badge>
                  )}
                  {card.subject && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {card.subject}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex-grow">
                {card.backContent ? (
                  <MarkdownRenderer content={card.backContent} />
                ) : (
                  <p className="text-muted-foreground italic">Sem conteúdo no verso</p>
                )}
              </div>

              <div className="flex justify-end mt-4">
                <Button variant="outline" size="icon" onClick={handleFlip} className="h-8 w-8" disabled={isDeleting}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </div>
        )}
      </Card>

      {/* Modal de confirmação de exclusão */}
      <Dialog open={showDeleteConfirmModal} onOpenChange={setShowDeleteConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este flashcard? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleDeleteCancel} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de sucesso na exclusão */}
      <Dialog open={showDeleteSuccessModal} onOpenChange={setShowDeleteSuccessModal}>
        <DialogContent className="flex items-center gap-3 text-green-600 text-center justify-center">
          <CheckCircle className="w-6 h-6" />
          <DialogHeader>
            <DialogTitle>Flashcard excluído com sucesso!</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Modal de erro na exclusão */}
      <Dialog open={showDeleteErrorModal} onOpenChange={setShowDeleteErrorModal}>
        <DialogContent className="flex items-center gap-3 text-red-600 text-center justify-center">
          <XCircle className="w-6 h-6" />
          <DialogHeader>
            <DialogTitle>Erro ao excluir o flashcard.</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
