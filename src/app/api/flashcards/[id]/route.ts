import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import type { FlashcardType } from "@/types/Flashcard"

// Caminho para o arquivo JSON
const dataFilePath = path.join(process.cwd(), "data", "flashcards.json")

// Função para garantir que o diretório e o arquivo existam
function ensureFileExists() {
  try {
    const dirPath = path.join(process.cwd(), "data")

    // Verifica se o diretório existe, se não, cria
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }

    // Verifica se o arquivo existe, se não, cria com um array vazio
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify([]))
    }

    return true
  } catch (error) {
    console.error("Erro ao verificar/criar arquivo:", error)
    return false
  }
}

// Função para ler os flashcards do arquivo
function getFlashcards(): FlashcardType[] {
  if (!ensureFileExists()) {
    return []
  }

  try {
    const data = fs.readFileSync(dataFilePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Erro ao ler flashcards:", error)
    return []
  }
}

// Função para salvar os flashcards no arquivo
function saveFlashcards(flashcards: FlashcardType[]): boolean {
  if (!ensureFileExists()) {
    return false
  }

  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(flashcards, null, 2))
    return true
  } catch (error) {
    console.error("Erro ao salvar flashcards:", error)
    return false
  }
}

// PUT - Atualizar um flashcard existente
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { title, subtitle, description, backContent, category, subject } = body

    // Obter todos os flashcards
    const flashcards = getFlashcards()

    // Encontrar o índice do flashcard a ser atualizado
    const index = flashcards.findIndex((card) => card.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Flashcard não encontrado" }, { status: 404 })
    }

    // Atualizar o flashcard mantendo os campos que não foram alterados
    const updatedFlashcard = {
      ...flashcards[index],
      title: title !== undefined ? title : flashcards[index].title,
      subtitle: subtitle !== undefined ? subtitle : flashcards[index].subtitle,
      description: description !== undefined ? description : flashcards[index].description,
      backContent: backContent !== undefined ? backContent : flashcards[index].backContent,
      category: category !== undefined ? category : flashcards[index].category,
      subject: subject !== undefined ? subject : flashcards[index].subject,
      // Não atualizamos o id ou createdAt
    }

    // Substituir o flashcard antigo pelo atualizado
    flashcards[index] = updatedFlashcard

    // Salvar os flashcards atualizados
    const saved = saveFlashcards(flashcards)

    if (!saved) {
      throw new Error("Falha ao salvar flashcard atualizado")
    }

    return NextResponse.json({
      message: "Flashcard atualizado com sucesso",
      flashcard: updatedFlashcard,
    })
  } catch (error) {
    console.error("Erro ao atualizar flashcard:", error)
    return NextResponse.json({ error: "Erro ao atualizar flashcard" }, { status: 500 })
  }
}

// DELETE - Excluir um flashcard
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Obter todos os flashcards
    const flashcards = getFlashcards()

    // Filtrar o flashcard a ser excluído
    const updatedFlashcards = flashcards.filter((card) => card.id !== id)

    // Verificar se algum flashcard foi removido
    if (flashcards.length === updatedFlashcards.length) {
      return NextResponse.json({ error: "Flashcard não encontrado" }, { status: 404 })
    }

    // Salvar os flashcards atualizados
    const saved = saveFlashcards(updatedFlashcards)

    if (!saved) {
      throw new Error("Falha ao salvar após exclusão do flashcard")
    }

    return NextResponse.json({
      message: "Flashcard excluído com sucesso",
    })
  } catch (error) {
    console.error("Erro ao excluir flashcard:", error)
    return NextResponse.json({ error: "Erro ao excluir flashcard" }, { status: 500 })
  }
}

