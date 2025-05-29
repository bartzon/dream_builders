import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { FONT_SIZES, COLORS } from '../constants/ui'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: `linear-gradient(to bottom, ${COLORS.bgMedium}, ${COLORS.bgDark})`,
          color: 'white',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: FONT_SIZES.title, 
            marginBottom: '20px',
            color: COLORS.danger 
          }}>
            Oops! Something went wrong
          </h1>
          
          <p style={{ 
            fontSize: FONT_SIZES.body, 
            marginBottom: '30px',
            maxWidth: '600px' 
          }}>
            We encountered an unexpected error. The game state might be corrupted.
            You can try resetting the game or refreshing the page.
          </p>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{
              marginBottom: '30px',
              padding: '20px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '8px',
              maxWidth: '800px',
              width: '100%',
              textAlign: 'left'
            }}>
              <summary style={{ 
                cursor: 'pointer', 
                fontSize: FONT_SIZES.body,
                fontWeight: 'bold',
                marginBottom: '10px' 
              }}>
                Error Details (Development Only)
              </summary>
              <pre style={{ 
                fontSize: FONT_SIZES.small, 
                overflow: 'auto',
                whiteSpace: 'pre-wrap'
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}

          <div style={{ display: 'flex', gap: '20px' }}>
            <button
              onClick={this.handleReset}
              style={{
                padding: '15px 30px',
                fontSize: FONT_SIZES.medium,
                fontWeight: 'bold',
                background: COLORS.primary,
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
            
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '15px 30px',
                fontSize: FONT_SIZES.medium,
                fontWeight: 'bold',
                background: COLORS.warning,
                color: '#000',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}