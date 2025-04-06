"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FlashcardType } from "@/types/Flashcard";

export default function FlashcardForm({
  onClose,
  onFlashcardCreated,
}: {
  onClose: () => void;
  onFlashcardCreated: (newFlashcard: FlashcardType) => void;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    backContent: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (showSuccessModal) {
      // Após mostrar o modal de sucesso, espera 2 segundos antes de fechar o formulário
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        // Fechar o formulário após 2 segundos, mas apenas se o botão "Salvar" for pressionado
        if (isSaving) {
          onClose();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, isSaving]);

  useEffect(() => {
    if (showValidationModal) {
      const timer = setTimeout(() => setShowValidationModal(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showValidationModal]);

  useEffect(() => {
    if (showErrorModal) {
      const timer = setTimeout(() => setShowErrorModal(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showErrorModal]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async ({
    closeAfterSave,
  }: {
    closeAfterSave: boolean;
  }) => {
    const hasAny = Object.values(form).some((value) => value.trim());
    if (!hasAny) {
      setShowValidationModal(true);
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error);

      // Limpa os campos após o sucesso
      setForm({ title: "", subtitle: "", description: "", backContent: "" });
      setShowSuccessModal(true); // Exibe o modal de sucesso

      // Chama onFlashcardCreated para atualizar a lista de flashcards na HomePage
      onFlashcardCreated(result.flashcard);

      // Se for para fechar o formulário, chama onClose após mostrar o modal
      if (closeAfterSave) {
        // Não fecha o formulário imediatamente, aguarda o modal aparecer
        setTimeout(() => {
          onClose(); // Fecha o formulário após 2 segundos do sucesso
        }, 2000);
      }
    } catch (err) {
      setShowErrorModal(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto mt-8 p-6 border rounded-2xl shadow-md bg-white">
        <div className="space-y-4">
          <Input
            name="title"
            placeholder="Título principal"
            value={form.title}
            onChange={handleChange}
          />
          <Input
            name="subtitle"
            placeholder="Título secundário"
            value={form.subtitle}
            onChange={handleChange}
          />
          <Textarea
            name="description"
            placeholder="Descrição ou conteúdo"
            value={form.description}
            onChange={handleChange}
          />
          <Textarea
            name="backContent"
            placeholder="Conteúdo do verso (resposta, explicação...)"
            value={form.backContent}
            onChange={handleChange}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {/* Botão para salvar e adicionar outro flashcard */}
          <Button
            onClick={() => handleSave({ closeAfterSave: false })}
            disabled={isSaving}
            variant="secondary"
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar e adicionar outro
          </Button>

          {/* Botão para salvar e fechar o formulário */}
          <Button
            onClick={() => handleSave({ closeAfterSave: true })}
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar
          </Button>
        </div>
      </div>

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
  );
}