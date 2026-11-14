import { afterEach, describe, expect, it, vi } from 'vitest'

describe('subscribeToScrollMetrics', () => {
  afterEach(() => {
    vi.resetModules()
    vi.unstubAllGlobals()
  })

  it('notifies subscribers immediately and on scroll via one rAF', async () => {
    const listeners = new Map<string, Set<EventListenerOrEventListenerObject>>()
    const rafCallbacks: FrameRequestCallback[] = []

    const fakeWindow = {
      innerHeight: 800,
      scrollY: 200,
      addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => {
        if (!listeners.has(type)) listeners.set(type, new Set())
        listeners.get(type)!.add(listener)
      },
      removeEventListener: (type: string, listener: EventListenerOrEventListenerObject) => {
        listeners.get(type)?.delete(listener)
      },
      requestAnimationFrame: (cb: FrameRequestCallback) => {
        rafCallbacks.push(cb)
        return rafCallbacks.length
      },
      cancelAnimationFrame: vi.fn(),
    }

    vi.stubGlobal('window', fakeWindow)
    vi.stubGlobal('requestAnimationFrame', fakeWindow.requestAnimationFrame)
    vi.stubGlobal('cancelAnimationFrame', fakeWindow.cancelAnimationFrame)
    vi.stubGlobal('document', {
      documentElement: { scrollHeight: 2800 },
    })

    const { subscribeToScrollMetrics } = await import('./scroll-metrics')
    const subscriber = vi.fn()
    const unsubscribe = subscribeToScrollMetrics(subscriber)

    expect(subscriber).toHaveBeenCalledTimes(1)
    expect(subscriber.mock.calls[0][0].progress).toBeCloseTo(0.1, 5)

    listeners.get('scroll')?.forEach((listener) => {
      if (typeof listener === 'function') {
        listener(new Event('scroll'))
      }
    })
    expect(rafCallbacks.length).toBeGreaterThan(0)
    rafCallbacks[0](0)

    expect(subscriber.mock.calls.length).toBeGreaterThanOrEqual(2)
    unsubscribe()
  })
})
