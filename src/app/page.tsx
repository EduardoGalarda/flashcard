"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import FlashcardForm from "@/components/FlashcardForm";
import FlashcardList from "@/components/FlashcardList";

export default function HomePage() {
  const [showForm, setShowForm] = useState(false);
  const [flashcards, setFlashcards] = useState([]);

  const fetchFlashcards = async () => {
    try {
      const res = await fetch("/api/flashcards");
      const data = await res.json();
      setFlashcards(data);
    } catch (error) {
      console.error("Erro ao buscar flashcards:", error);
    }
  };

  // Função para controlar a visibilidade do formulário
  const handleCreateClick = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleFlashcardCreated = () => {
    fetchFlashcards(); // Atualiza a lista de flashcards após a criação
  };

  useEffect(() => {
    fetchFlashcards(); // Carrega os flashcards quando a página é carregada
  }, []);

  return (
    <>
      <Navbar onCreateClick={handleCreateClick} />
      <main className="p-6">
        {/* Exibe o formulário se showForm for verdadeiro */}
        {showForm && (
          <FlashcardForm
            onClose={handleCloseForm}
            onFlashcardCreated={handleFlashcardCreated}
          />
        )}

        {/* Exibe a lista de flashcards */}
        <FlashcardList flashcards={flashcards} />
      </main>
    </>
  );
}