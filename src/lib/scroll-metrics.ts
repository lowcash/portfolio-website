export interface ScrollMetrics {
  scrollY: number
  maxScroll: number
  progress: number
  viewportHeight: number
  documentHeight: number
}

type ScrollMetricsSubscriber = (metrics: ScrollMetrics) => void

const subscribers = new Set<ScrollMetricsSubscriber>()

let isListening = false
let frameId: number | null = null
let latestMetrics: ScrollMetrics = {
  scrollY: 0,
  maxScroll: 0,
  progress: 0,
  viewportHeight: 0,
  documentHeight: 0,
}

function computeScrollMetrics(): ScrollMetrics {
  const viewportHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const maxScroll = Math.max(0, documentHeight - viewportHeight)
  const scrollY = Math.min(maxScroll, Math.max(0, window.scrollY))
  const progress = maxScroll > 0 ? scrollY / maxScroll : 0

  return {
    scrollY,
    maxScroll,
    progress,
    viewportHeight,
    documentHeight,
  }
}

function notifySubscribers() {
  frameId = null
  latestMetrics = computeScrollMetrics()

  subscribers.forEach((subscriber) => {
    subscriber(latestMetrics)
  })
}

function scheduleNotify() {
  if (frameId !== null) {
    return
  }

  frameId = requestAnimationFrame(notifySubscribers)
}

function startListening() {
  if (isListening || typeof window === 'undefined') {
    return
  }

  isListening = true
  latestMetrics = computeScrollMetrics()

  window.addEventListener('scroll', scheduleNotify, { passive: true })
  window.addEventListener('resize', scheduleNotify)
}

function stopListening() {
  if (!isListening || typeof window === 'undefined') {
    return
  }

  window.removeEventListener('scroll', scheduleNotify)
  window.removeEventListener('resize', scheduleNotify)

  if (frameId !== null) {
    cancelAnimationFrame(frameId)
    frameId = null
  }

  isListening = false
}

interface SubscribeOptions {
  immediate?: boolean
}

export function subscribeToScrollMetrics(
  subscriber: ScrollMetricsSubscriber,
  { immediate = true }: SubscribeOptions = {},
) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  subscribers.add(subscriber)

  if (!isListening) {
    startListening()
  }

  if (immediate) {
    subscriber(latestMetrics)
  }

  return () => {
    subscribers.delete(subscriber)

    if (subscribers.size === 0) {
      stopListening()
    }
  }
}
