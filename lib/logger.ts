type LogLevel = 'error' | 'warn' | 'info' | 'debug'

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production'

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (!this.isDevelopment) return
    const prefix = `[${new Date().toISOString()}] [${level.toUpperCase()}]`
    switch (level) {
      case 'error': console.error(prefix, message, ...args); break
      case 'warn':  console.warn(prefix, message, ...args);  break
      case 'info':  console.info(prefix, message, ...args);  break
      case 'debug': console.debug(prefix, message, ...args); break
    }
  }

  error(message: string, ...args: unknown[]) { this.log('error', message, ...args) }
  warn(message: string,  ...args: unknown[]) { this.log('warn',  message, ...args) }
  info(message: string,  ...args: unknown[]) { this.log('info',  message, ...args) }
  debug(message: string, ...args: unknown[]) { this.log('debug', message, ...args) }
}

export const logger = new Logger()
