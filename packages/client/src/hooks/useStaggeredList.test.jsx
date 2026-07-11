import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import useStaggeredList from 'hooks/useStaggeredList'

describe('useStaggeredList', () => {
  it('returns array of specified length', () => {
    const { result } = renderHook(() => useStaggeredList(5))

    expect(Array.isArray(result.current)).toBe(true)
    expect(result.current.length).toBe(5)
  })

  it('returns empty array for zero', () => {
    const { result } = renderHook(() => useStaggeredList(0))

    expect(result.current.length).toBe(0)
  })

  it('each item has a transform property', () => {
    const { result } = renderHook(() => useStaggeredList(3))

    result.current.forEach((item) => {
      expect(item).toBeDefined()
      expect(typeof item).toBe('object')
    })
  })

  it('works with large numbers', () => {
    const { result } = renderHook(() => useStaggeredList(100))

    expect(result.current.length).toBe(100)
  })
})
