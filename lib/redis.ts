import Redis from 'ioredis'

// Configuração do Redis
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000,
}

// Cliente Redis principal
let redisClient: Redis | null = null

// Função para obter cliente Redis
export function getRedisClient(): Redis {
  if (!redisClient) {
    try {
      redisClient = new Redis(redisConfig)
      
      redisClient.on('connect', () => {
        console.log('✅ Redis conectado com sucesso')
      })
      
      redisClient.on('error', (error) => {
        console.error('❌ Erro na conexão Redis:', error)
        redisClient = null
      })
      
      redisClient.on('close', () => {
        console.log('🔌 Conexão Redis fechada')
        redisClient = null
      })
      
      redisClient.on('reconnecting', () => {
        console.log('🔄 Reconectando ao Redis...')
      })
    } catch (error) {
      console.error('❌ Falha ao criar cliente Redis:', error)
      throw error
    }
  }
  
  return redisClient
}

// Função para fechar conexão Redis
export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.quit()
      redisClient = null
      console.log('🔌 Conexão Redis fechada com sucesso')
    } catch (error) {
      console.error('❌ Erro ao fechar conexão Redis:', error)
    }
  }
}

// Função para verificar se Redis está disponível
export async function isRedisAvailable(): Promise<boolean> {
  try {
    const client = getRedisClient()
    await client.ping()
    return true
  } catch (error) {
    console.warn('⚠️ Redis não disponível, usando fallback local')
    return false
  }
}

// Função para limpar todas as chaves (apenas para desenvolvimento)
export async function clearAllKeys(): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    try {
      const client = getRedisClient()
      await client.flushdb()
      console.log('🧹 Todas as chaves Redis foram limpas')
    } catch (error) {
      console.error('❌ Erro ao limpar chaves Redis:', error)
    }
  }
}

// Função para obter estatísticas do Redis
export async function getRedisStats(): Promise<{
  connected: boolean
  keys: number
  memory: string
  uptime: number
}> {
  try {
    const client = getRedisClient()
    const [keys, memory, uptime] = await Promise.all([
      client.dbsize(),
      client.info('memory'),
      client.info('server')
    ])
    
    const memoryMatch = memory.match(/used_memory_human:(\S+)/)
    const uptimeMatch = uptime.match(/uptime_in_seconds:(\d+)/)
    
    return {
      connected: true,
      keys: keys,
      memory: memoryMatch ? memoryMatch[1] : 'N/A',
      uptime: uptimeMatch ? parseInt(uptimeMatch[1]) : 0
    }
  } catch (error) {
    return {
      connected: false,
      keys: 0,
      memory: 'N/A',
      uptime: 0
    }
  }
}

// Exportar cliente para uso direto (se necessário)
export { redisClient }
