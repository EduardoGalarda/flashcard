"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  X,
  Save,
  Plus,
  ChevronLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BookOpen,
  Palette,
  SettingsIcon,
  Tag,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface SettingsFormProps {
  onClose: () => void
}

type SettingsView = "main" | "content" | "appearance" | "advanced" | "categories" | "subjects"

export default function SettingsForm({ onClose }: SettingsFormProps) {
  const [categories, setCategories] = useState<string[]>([])
  const [subjects, setSubjects] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [newSubject, setNewSubject] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [currentView, setCurrentView] = useState<SettingsView>("main")
  const [activeContentTab, setActiveContentTab] = useState("categories")

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

  const handleAddCategory = () => {
    if (!newCategory.trim()) return

    if (categories.length >= 10) {
      setShowLimitModal(true)
      return
    }

    if (!categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()])
      setNewCategory("")
    }
  }

  const handleAddSubject = () => {
    if (!newSubject.trim()) return

    if (subjects.length >= 10) {
      setShowLimitModal(true)
      return
    }

    if (!subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()])
      setNewSubject("")
    }
  }

  const handleRemoveCategory = (category: string) => {
    setCategories(categories.filter((c) => c !== category))
  }

  const handleRemoveSubject = (subject: string) => {
    setSubjects(subjects.filter((s) => s !== subject))
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories, subjects }),
      })

      if (!res.ok) {
        throw new Error("Falha ao salvar configurações")
      }

      setShowSuccessModal(true)

      // Fechar o formulário após mostrar o modal de sucesso
      setTimeout(() => {
        setShowSuccessModal(false)
        onClose()
      }, 1500)
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
      setShowErrorModal(true)

      setTimeout(() => {
        setShowErrorModal(false)
      }, 1500)
    } finally {
      setIsSaving(false)
    }
  }

  const navigateTo = (view: SettingsView) => {
    setCurrentView(view)
  }

  const getHeaderTitle = () => {
    switch (currentView) {
      case "main":
        return "Configurações"
      case "content":
        return "Conteúdo"
      case "appearance":
        return "Aparência"
      case "advanced":
        return "Configurações Avançadas"
      case "categories":
        return "Categorias"
      case "subjects":
        return "Assuntos"
      default:
        return "Configurações"
    }
  }

  const renderBackButton = () => {
    if (currentView === "main") return null

    const goBack = () => {
      if (currentView === "categories" || currentView === "subjects") {
        navigateTo("content")
      } else {
        navigateTo("main")
      }
    }

    return (
      <Button variant="ghost" size="icon" onClick={goBack} className="mr-2">
        <ChevronLeft className="h-4 w-4" />
      </Button>
    )
  }

  const renderMainMenu = () => {
    return (
      <div className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-left font-normal h-12"
          onClick={() => navigateTo("content")}
        >
          <BookOpen className="mr-2 h-5 w-5" />
          <span>Conteúdo</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-left font-normal h-12"
          onClick={() => navigateTo("appearance")}
        >
          <Palette className="mr-2 h-5 w-5" />
          <span>Aparência</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-left font-normal h-12"
          onClick={() => navigateTo("advanced")}
        >
          <SettingsIcon className="mr-2 h-5 w-5" />
          <span>Configurações Avançadas</span>
        </Button>
      </div>
    )
  }

  const renderContentMenu = () => {
    return (
      <div className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-left font-normal h-12"
          onClick={() => navigateTo("categories")}
        >
          <Tag className="mr-2 h-5 w-5" />
          <span>Categorias</span>
          <Badge className="ml-auto">{categories.length}/10</Badge>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-left font-normal h-12"
          onClick={() => navigateTo("subjects")}
        >
          <BookOpen className="mr-2 h-5 w-5" />
          <span>Assuntos</span>
          <Badge className="ml-auto">{subjects.length}/10</Badge>
        </Button>
      </div>
    )
  }

  const renderCategoriesContent = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Nova categoria"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
          />
          <Button onClick={handleAddCategory} disabled={!newCategory.trim()}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Categorias ({categories.length}/10)</h3>
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma categoria definida</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  {category}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCategory(category)}
                    className="h-4 w-4 ml-1 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderSubjectsContent = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Novo assunto"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSubject()}
          />
          <Button onClick={handleAddSubject} disabled={!newSubject.trim()}>
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Assuntos ({subjects.length}/10)</h3>
          {subjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum assunto definido</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  {subject}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSubject(subject)}
                    className="h-4 w-4 ml-1 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderAppearanceContent = () => {
    return (
      <div className="p-4 border rounded-md bg-muted/30">
        <h3 className="text-lg font-medium mb-2">Aparência</h3>
        <p className="text-muted-foreground">Configurações de aparência serão implementadas em breve.</p>
      </div>
    )
  }

  const renderAdvancedContent = () => {
    return (
      <div className="p-4 border rounded-md bg-muted/30">
        <h3 className="text-lg font-medium mb-2">Configurações Avançadas</h3>
        <p className="text-muted-foreground">Configurações avançadas serão implementadas em breve.</p>
      </div>
    )
  }

  const renderContent = () => {
    switch (currentView) {
      case "main":
        return renderMainMenu()
      case "content":
        return renderContentMenu()
      case "appearance":
        return renderAppearanceContent()
      case "advanced":
        return renderAdvancedContent()
      case "categories":
        return renderCategoriesContent()
      case "subjects":
        return renderSubjectsContent()
      default:
        return renderMainMenu()
    }
  }

  const shouldShowSaveButton = () => {
    return currentView === "categories" || currentView === "subjects"
  }

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto mb-8 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center">
            {renderBackButton()}
            <CardTitle className="text-xl">{getHeaderTitle()}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
        {shouldShowSaveButton() && (
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Modal de sucesso */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="flex items-center gap-3 text-green-600 text-center justify-center">
          <CheckCircle className="w-6 h-6" />
          <DialogHeader>
            <DialogTitle>Configurações salvas com sucesso!</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Modal de erro */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="flex items-center gap-3 text-red-600 text-center justify-center">
          <XCircle className="w-6 h-6" />
          <DialogHeader>
            <DialogTitle>Erro ao salvar configurações.</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Modal de limite */}
      <Dialog open={showLimitModal} onOpenChange={setShowLimitModal}>
        <DialogContent className="flex items-center gap-3 text-yellow-600 text-center justify-center">
          <AlertTriangle className="w-6 h-6" />
          <DialogHeader>
            <DialogTitle>Limite máximo de 10 itens atingido.</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

