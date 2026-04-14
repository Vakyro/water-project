interface AppConfig {
  supabase: { url: string; key: string }
  groq: { apiKey: string; model: string; temperature: number; maxTokens: number }
  embedding: { serviceUrl: string; dimensions: number }
  search: { defaultThreshold: number; defaultCount: number }
}

class ConfigService {
  private static instance: ConfigService
  private config: AppConfig

  private constructor() {
    this.validateEnvironment()
    this.config = {
      supabase: {
        url: process.env.SUPABASE_URL!,
        key: process.env.SUPABASE_KEY!,
      },
      groq: {
        apiKey:      process.env.GROQ_API_KEY!,
        model:       'llama-3.1-8b-instant',
        temperature: 0.1,
        maxTokens:   900,
      },
      embedding: {
        serviceUrl: process.env.EMBEDDING_SERVICE_URL!,
        dimensions: 384,
      },
      search: {
        defaultThreshold: 0.5,
        defaultCount:     8,
      },
    }
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService()
    }
    return ConfigService.instance
  }

  private validateEnvironment(): void {
    const required = ['SUPABASE_URL', 'SUPABASE_KEY', 'GROQ_API_KEY', 'EMBEDDING_SERVICE_URL']
    const missing  = required.filter(k => !process.env[k])
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
  }

  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key]
  }
}

export const config = ConfigService.getInstance()
