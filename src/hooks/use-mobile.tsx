"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    // Função para verificar o tamanho da tela
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640) // Telas menores que 640px (sm no Tailwind)
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024) // Entre 640px e 1024px (md e lg no Tailwind)
    }

    // Verificar tamanho inicial
    checkScreenSize()

    // Adicionar listener para redimensionamento
    window.addEventListener("resize", checkScreenSize)

    // Limpar listener ao desmontar
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet }
}
