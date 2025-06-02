import '@testing-library/jest-dom'
import { beforeAll, afterAll } from 'vitest'

// Mock console methods for cleaner test output
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const firstArg = args[0]
    if (typeof firstArg === 'string' && firstArg.includes('Warning: ReactDOM.render')) return
    originalConsoleError.apply(console, args)
  }
  console.warn = (...args: unknown[]) => {
    const firstArg = args[0]
    if (typeof firstArg === 'string' && firstArg.includes('componentWillReceiveProps')) return
    originalConsoleWarn.apply(console, args)
  }
})

afterAll(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
}) 