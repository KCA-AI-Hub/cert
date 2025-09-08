import { v4 as uuidv4 } from 'uuid'
import { env } from './env'
import { UserInteraction } from './validators'

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private logLevel: LogLevel

  constructor() {
    this.logLevel = LogLevel[env.LOG_LEVEL as keyof typeof LogLevel] || LogLevel.INFO
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString()
    const dataStr = data ? ` | ${JSON.stringify(data)}` : ''
    return `[${timestamp}] ${level}: ${message}${dataStr}`
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage('DEBUG', message, data))
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', message, data))
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message, data))
    }
  }

  error(message: string, error?: Error, data?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorData = {
        ...data,
        error: error ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } : undefined,
      }
      console.error(this.formatMessage('ERROR', message, errorData))
    }
  }

  // User interaction logging
  logUserInteraction(type: UserInteraction['type'], sessionId: string, data?: any): void {
    const interaction: UserInteraction = {
      id: uuidv4(),
      type,
      sessionId,
      timestamp: new Date(),
      data,
    }

    this.info(`User interaction: ${type}`, {
      sessionId,
      interactionId: interaction.id,
      data: interaction.data,
    })

    // TODO: Send to external logging service
    // await logApi.sendInteraction(interaction)
  }

  // PII-safe logging (removes sensitive data)
  logPiiSafe(message: string, data: any): void {
    const sanitizedData = this.sanitizePii(data)
    this.info(message, sanitizedData)
  }

  private sanitizePii(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data
    }

    const sensitiveFields = ['email', 'phone', 'password', 'ssn', 'address']
    const sanitized = { ...data }

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]'
      }
    }

    return sanitized
  }
}

export const logger = new Logger()




