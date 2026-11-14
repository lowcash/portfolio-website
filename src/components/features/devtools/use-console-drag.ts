'use client'

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type RefObject } from 'react'

type Position = { x: number; y: number }

function clampPosition(nextX: number, nextY: number, width: number, height: number): Position {
  if (typeof window === 'undefined') {
    return { x: nextX, y: nextY }
  }

  const maxX = Math.max(0, window.innerWidth - width)
  const maxY = Math.max(0, window.innerHeight - height)

  return {
    x: Math.min(Math.max(0, nextX), maxX),
    y: Math.min(Math.max(0, nextY), maxY),
  }
}

function readInitialPosition(canUseStorage: boolean): Position {
  if (!canUseStorage || typeof window === 'undefined') {
    return { x: 20, y: 20 }
  }

  try {
    const saved = localStorage.getItem('debug_position')
    if (saved) {
      const parsed = JSON.parse(saved) as Position
      const isValidX = parsed.x >= -200 && parsed.x < window.innerWidth
      const isValidY = parsed.y >= -200 && parsed.y < window.innerHeight
      if (isValidX && isValidY) {
        // Clamp without measuring the panel (refs unavailable in useState init)
        return clampPosition(parsed.x, parsed.y, 420, 200)
      }
    }
  } catch {
    // ignore corrupt storage
  }

  return { x: 20, y: 20 }
}

export type ConsoleDrag = {
  position: Position
  isDragging: boolean
  panelRef: RefObject<HTMLDivElement | null>
  panelSurfaceRef: RefObject<HTMLDivElement | null>
  handleMouseDown: (e: ReactMouseEvent) => void
}

export function useConsoleDrag(options: {
  canUseStorage: boolean
  isVisible: boolean
  isMobileViewport: boolean
  scale: number
}): ConsoleDrag {
  const { canUseStorage, isVisible, isMobileViewport, scale } = options

  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState<Position>(() => readInitialPosition(canUseStorage))

  const panelRef = useRef<HTMLDivElement>(null)
  const panelSurfaceRef = useRef<HTMLDivElement>(null)

  const clampPanelPosition = (nextX: number, nextY: number) => {
    const panel = panelSurfaceRef.current ?? panelRef.current
    if (!panel || typeof window === 'undefined') {
      return { x: nextX, y: nextY }
    }

    const rect = panel.getBoundingClientRect()
    return clampPosition(nextX, nextY, rect.width, rect.height)
  }

  // Clamp after mount once panel dimensions are known (async to avoid sync setState-in-effect lint)
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setPosition((current) => clampPanelPosition(current.x, current.y))
    })
    return () => cancelAnimationFrame(frameId)
  }, [])

  const handleMouseDown = (e: ReactMouseEvent) => {
    if ((e.target as HTMLElement).tagName !== 'BUTTON' && (e.target as HTMLElement).tagName !== 'INPUT') {
      const isMobile = window.innerWidth < 768
      const hamburgerRect = { top: 24, right: 24, width: 56, height: 56 }
      const scrollToTopRect = { bottom: 32, right: 32, width: 56, height: 56 }

      const clickX = e.clientX
      const clickY = e.clientY
      const winWidth = window.innerWidth
      const winHeight = window.innerHeight

      const inHamburgerZone =
        isMobile &&
        clickX > winWidth - hamburgerRect.right - hamburgerRect.width &&
        clickX < winWidth - hamburgerRect.right + hamburgerRect.width &&
        clickY > hamburgerRect.top - hamburgerRect.height &&
        clickY < hamburgerRect.top + hamburgerRect.height

      const inScrollToTopZone =
        clickX > winWidth - scrollToTopRect.right - scrollToTopRect.width &&
        clickX < winWidth - scrollToTopRect.right + scrollToTopRect.width &&
        clickY > winHeight - scrollToTopRect.bottom - scrollToTopRect.height &&
        clickY < winHeight - scrollToTopRect.bottom + scrollToTopRect.height

      if (inHamburgerZone || inScrollToTopZone) {
        return
      }

      setIsDragging(true)
      setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  useEffect(() => {
    if (!isDragging) return

    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'grabbing'

    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        const nextPosition = clampPanelPosition(e.clientX - dragOffset.x, e.clientY - dragOffset.y)
        setPosition(nextPosition)
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isDragging, dragOffset])

  useEffect(() => {
    if (isMobileViewport || !isVisible) {
      return
    }

    const handleViewportChange = () => {
      setPosition((current) => clampPanelPosition(current.x, current.y))
    }

    handleViewportChange()
    window.addEventListener('resize', handleViewportChange)

    return () => {
      window.removeEventListener('resize', handleViewportChange)
    }
  }, [isVisible, isMobileViewport, scale])

  useEffect(() => {
    if (!isDragging) {
      localStorage.setItem('debug_position', JSON.stringify(position))
    }
  }, [isDragging, position])

  return {
    position,
    isDragging,
    panelRef,
    panelSurfaceRef,
    handleMouseDown,
  }
}
