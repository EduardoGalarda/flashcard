"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HelpCircle } from "lucide-react"

export default function MarkdownGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Ajuda com Markdown</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Guia de Markdown</DialogTitle>
          <DialogDescription>Você pode usar Markdown para formatar o texto dos seus flashcards.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <h3 className="font-medium mb-2">Formatação Básica</h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">**texto**</code>
                <div className="font-bold">texto</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">*texto*</code>
                <div className="italic">texto</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">~~texto~~</code>
                <div className="line-through">texto</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">[link](url)</code>
                <div className="text-blue-500">link</div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Listas</h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">
                  - Item 1
                  <br />- Item 2
                </code>
                <div>
                  <ul className="list-disc pl-5">
                    <li>Item 1</li>
                    <li>Item 2</li>
                  </ul>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">
                  1. Primeiro
                  <br />
                  2. Segundo
                </code>
                <div>
                  <ol className="list-decimal pl-5">
                    <li>Primeiro</li>
                    <li>Segundo</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Títulos</h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded"># Título</code>
                <div className="text-xl font-bold">Título</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">## Subtítulo</code>
                <div className="text-lg font-bold">Subtítulo</div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Outros</h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">&gt; Citação</code>
                <div className="border-l-4 border-gray-300 pl-2 italic">Citação</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">`código`</code>
                <div>
                  <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">código</code>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">---</code>
                <div className="border-t border-gray-300 pt-1">Linha horizontal</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
