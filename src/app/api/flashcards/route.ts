import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
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
      console.log("Diretório data criado com sucesso")
    }

    // Verifica se o arquivo existe, se não, cria com um array vazio
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify([]))
      console.log("Arquivo flashcards.json criado com sucesso")
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

// GET - Obter todos os flashcards
export async function GET() {
  try {
    const flashcards = getFlashcards()
    console.log("Flashcards carregados:", flashcards.length)
    return NextResponse.json({ flashcards })
  } catch (error) {
    console.error("Erro ao buscar flashcards:", error)
    return NextResponse.json({ error: "Erro ao buscar flashcards", flashcards: [] }, { status: 500 })
  }
}

// POST - Criar um novo flashcard
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, subtitle, description, backContent, category, subject } = body

    // Criar novo flashcard
    const newFlashcard: FlashcardType = {
      id: uuidv4(),
      title: title || "",
      subtitle: subtitle || "",
      description: description || "",
      backContent: backContent || "",
      category: category || "",
      subject: subject || "",
      createdAt: new Date().toISOString(),
    }

    // Obter flashcards existentes e adicionar o novo
    const flashcards = getFlashcards()
    flashcards.unshift(newFlashcard) // Adiciona no início da lista

    // Salvar flashcards atualizados
    const saved = saveFlashcards(flashcards)

    if (!saved) {
      throw new Error("Falha ao salvar flashcard")
    }

    return NextResponse.json({
      message: "Flashcard criado com sucesso",
      flashcard: newFlashcard,
    })
  } catch (error) {
    console.error("Erro ao criar flashcard:", error)
    return NextResponse.json({ error: "Erro ao criar flashcard" }, { status: 500 })
  }
}

