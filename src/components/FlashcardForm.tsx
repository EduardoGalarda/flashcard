"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Save, CheckCircle, AlertTriangle, XCircle, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FlashcardType } from "@/types/Flashcard"
import MarkdownGuide from "./MarkdownGuide"

export default function FlashcardForm({
  onClose,
  onFlashcardCreated,
}: {
  onClose: () => void
  onFlashcardCreated: (newFlashcard: FlashcardType) => void
}) {
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    backContent: "",
    category: "",
    subject: "",
  })
  const [categories, setCategories] = useState<string[]>([])
  const [subjects, setSubjects] = useState<string[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showValidationModal, setShowValidationModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)

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

  useEffect(() => {
    if (showSuccessModal) {
      // Após mostrar o modal de sucesso, espera 2 segundos antes de fechar o formulário
      const timer = setTimeout(() => {
        setShowSuccessModal(false)
        // Fechar o formulário após 2 segundos, mas apenas se o botão "Salvar" for pressionado
        if (isSaving) {
          onClose()
        }
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessModal, isSaving, onClose])

  useEffect(() => {
    if (showValidationModal) {
      const timer = setTimeout(() => setShowValidationModal(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [showValidationModal])

  useEffect(() => {
    if (showErrorModal) {
      const timer = setTimeout(() => setShowErrorModal(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [showErrorModal])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    // Se o valor for "none-value", armazenamos como string vazia
    const finalValue = value === "none-value" ? "" : value
    setForm((prev) => ({ ...prev, [name]: finalValue }))
  }

  const handleSave = async ({
    closeAfterSave,
  }: {
    closeAfterSave: boolean
  }) => {
    const hasAny = Object.values(form).some((value) => value.trim())
    if (!hasAny) {
      setShowValidationModal(true)
      return
    }

    setIsSaving(closeAfterSave)

    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      })

      const result = await res.json()

      if (!res.ok) throw new Error(result.error)

      // Limpa os campos após o sucesso
      setForm({ title: "", subtitle: "", description: "", backContent: "", category: "", subject: "" })
      setShowSuccessModal(true) // Exibe o modal de sucesso

      // Chama onFlashcardCreated para atualizar a lista de flashcards na HomePage
      onFlashcardCreated(result.flashcard)

      // Se for para fechar o formulário, chama onClose após mostrar o modal
      if (closeAfterSave) {
        // Não fecha o formulário imediatamente, aguarda o modal aparecer
        setTimeout(() => {
          onClose() // Fecha o formulário após 2 segundos do sucesso
        }, 2000)
      }
    } catch (err) {
      setShowErrorModal(true)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto mb-8 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Criar novo flashcard</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  name="title"
                  placeholder="Título principal"
                  value={form.title}
                  onChange={handleChange}
                  className="mb-2"
                />
                <Input name="subtitle" placeholder="Título secundário" value={form.subtitle} onChange={handleChange} />
              </div>
              <div>
                <div className="mb-2">
                  <Select value={form.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <SelectItem value="none" disabled>
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
                <Select value={form.subject} onValueChange={(value) => handleSelectChange("subject", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um assunto" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.length === 0 ? (
                      <SelectItem value="none" disabled>
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
                placeholder="Descrição ou conteúdo (suporta Markdown)"
                value={form.description}
                onChange={handleChange}
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
                placeholder="Conteúdo do verso (suporta Markdown)"
                value={form.backContent}
                onChange={handleChange}
                className="min-h-[120px] font-mono text-sm"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            {/* Botão para salvar e adicionar outro flashcard */}
            <Button onClick={() => handleSave({ closeAfterSave: false })} disabled={isSaving} variant="secondary">
              <Save className="mr-2 h-4 w-4" />
              Salvar e adicionar outro
            </Button>

            {/* Botão para salvar e fechar o formulário */}
            <Button onClick={() => handleSave({ closeAfterSave: true })} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ✅ Modal - Sucesso */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="flex items-center gap-3 text-green-600 text-center justify-center">
          <CheckCircle className="w-6 h-6" />
          <DialogHeader>
            <DialogTitle>Flashcard salvo com sucesso!</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* ⚠️ Modal - Validação */}
      <Dialog open={showValidationModal} onOpenChange={setShowValidationModal}>
        <DialogContent className="flex items-center gap-3 text-yellow-600 text-center justify-center">
          <AlertTriangle className="w-6 h-6" />
          <DialogHeader>
            <DialogTitle>Preencha pelo menos um campo.</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* ❌ Modal - Erro */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="flex items-center gap-3 text-red-600 text-center justify-center">
          <XCircle className="w-6 h-6" />
          <DialogHeader>
            <DialogTitle>Erro ao salvar o flashcard.</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
