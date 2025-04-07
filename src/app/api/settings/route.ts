import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Caminho para o arquivo JSON de configurações
const settingsFilePath = path.join(process.cwd(), "data", "settings.json")

// Interface para as configurações
interface Settings {
  categories: string[]
  subjects: string[]
}

// Função para garantir que o diretório e o arquivo existam
function ensureFileExists() {
  try {
    const dirPath = path.join(process.cwd(), "data")

    // Verifica se o diretório existe, se não, cria
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
      console.log("Diretório data criado com sucesso")
    }

    // Verifica se o arquivo existe, se não, cria com valores padrão
    if (!fs.existsSync(settingsFilePath)) {
      const defaultSettings: Settings = {
        categories: [],
        subjects: [],
      }
      fs.writeFileSync(settingsFilePath, JSON.stringify(defaultSettings, null, 2))
      console.log("Arquivo settings.json criado com sucesso")
    }

    return true
  } catch (error) {
    console.error("Erro ao verificar/criar arquivo de configurações:", error)
    return false
  }
}

// Função para ler as configurações do arquivo
function getSettings(): Settings {
  if (!ensureFileExists()) {
    return { categories: [], subjects: [] }
  }

  try {
    const data = fs.readFileSync(settingsFilePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Erro ao ler configurações:", error)
    return { categories: [], subjects: [] }
  }
}

// Função para salvar as configurações no arquivo
function saveSettings(settings: Settings): boolean {
  if (!ensureFileExists()) {
    return false
  }

  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2))
    return true
  } catch (error) {
    console.error("Erro ao salvar configurações:", error)
    return false
  }
}

// GET - Obter configurações
export async function GET() {
  try {
    const settings = getSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Erro ao buscar configurações:", error)
    return NextResponse.json({ error: "Erro ao buscar configurações" }, { status: 500 })
  }
}

// POST - Atualizar configurações
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { categories, subjects } = body

    // Validar os dados
    if (!Array.isArray(categories) || !Array.isArray(subjects)) {
      return NextResponse.json({ error: "Formato de dados inválido" }, { status: 400 })
    }

    // Limitar a 10 itens cada
    const limitedCategories = categories.slice(0, 10)
    const limitedSubjects = subjects.slice(0, 10)

    // Criar objeto de configurações
    const settings: Settings = {
      categories: limitedCategories,
      subjects: limitedSubjects,
    }

    // Salvar configurações
    const saved = saveSettings(settings)

    if (!saved) {
      throw new Error("Falha ao salvar configurações")
    }

    return NextResponse.json({
      message: "Configurações salvas com sucesso",
      settings,
    })
  } catch (error) {
    console.error("Erro ao salvar configurações:", error)
    return NextResponse.json({ error: "Erro ao salvar configurações" }, { status: 500 })
  }
}

