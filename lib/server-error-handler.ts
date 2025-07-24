// Global error handlers for the server
export function setupErrorHandlers() {
  if (typeof process !== 'undefined') {
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason)
      // Don't exit the process in development
      if (process.env.NODE_ENV === 'production') {
        process.exit(1)
      }
    })

    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error)
      // Don't exit the process in development
      if (process.env.NODE_ENV === 'production') {
        process.exit(1)
      }
    })
  }
}

// Auto-setup when imported
setupErrorHandlers()