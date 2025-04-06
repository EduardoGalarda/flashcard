import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'
import { NextResponse } from 'next/server'

const filePath = join(process.cwd(), 'data', 'flashcards.json')

// GET: Retorna todos os flashcards
export async function GET() {
  try {
    const fileData = await readFile(filePath, 'utf8')
    const flashcards = JSON.parse(fileData)
    return NextResponse.json(flashcards)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao ler flashcards' }, { status: 500 })
  }
}

// POST: Cria um novo flashcard
export async function POST(req: Request) {
  const data = await req.json()

  const hasAnyValue = ['title', 'subtitle', 'description', 'backContent'].some(
    (key) => data[key]?.trim()
  )

  if (!hasAnyValue) {
    return NextResponse.json({ error: 'Preencha pelo menos um campo.' }, { status: 400 })
  }

  const newFlashcard = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: new Date().toISOString()
  }

  try {
    const fileData = await readFile(filePath, 'utf8')
    const flashcards = JSON.parse(fileData)
    flashcards.push(newFlashcard)

    await writeFile(filePath, JSON.stringify(flashcards, null, 2), 'utf8')

    return NextResponse.json({ success: true, flashcard: newFlashcard })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar flashcard' }, { status: 500 })
  }
}