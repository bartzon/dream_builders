import '@testing-library/jest-dom'

// Mock console methods for cleaner test output
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (args[0]?.includes?.('Warning: ReactDOM.render')) return
    originalConsoleError.apply(console, args)
  }
  console.warn = (...args: any[]) => {
    if (args[0]?.includes?.('componentWillReceiveProps')) return
    originalConsoleWarn.apply(console, args)
  }
})

afterAll(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
}) 