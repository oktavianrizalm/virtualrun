type LogLevel = 'info' | 'warn' | 'error' | 'security'

export const logger = {
  log: (level: LogLevel, message: string, meta?: any) => {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      ...(meta && { meta })
    }
    
    // Structured JSON log formats allow easy filtering in APMs (Datadog/Sentry/Vercel)
    const logString = JSON.stringify(logEntry)

    switch (level) {
      case 'info':
        console.log(logString)
        break
      case 'warn':
        console.warn(logString)
        break
      case 'error':
      case 'security':
        console.error(logString)
        break
    }
  }
}
