import { useState, useEffect } from 'react'
import { Category, Tag } from '@/types/forum'

interface ForumData {
  categories: Category[]
  tags: Tag[]
  loading: boolean
  error: string | null
}

export function useForumData(): ForumData {
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔄 Iniciando busca de dados do fórum...')
        setLoading(true)
        setError(null)

        // Buscar categorias e tags em paralelo
        const [categoriesResponse, tagsResponse] = await Promise.all([
          fetch('/api/forum/categories'),
          fetch('/api/forum/tags')
        ])

        console.log('📊 Resposta das categorias:', categoriesResponse.status)
        console.log('🏷️ Resposta das tags:', tagsResponse.status)

        if (!categoriesResponse.ok) {
          throw new Error(`Erro ao buscar categorias: ${categoriesResponse.status}`)
        }

        if (!tagsResponse.ok) {
          throw new Error(`Erro ao buscar tags: ${tagsResponse.status}`)
        }

        const [categoriesData, tagsData] = await Promise.all([
          categoriesResponse.json(),
          tagsResponse.json()
        ])

        console.log('📂 Dados das categorias:', categoriesData)
        console.log('🏷️ Dados das tags:', tagsData)

        // Verificar se os dados estão no formato correto
        const categoriesArray = Array.isArray(categoriesData) ? categoriesData : categoriesData.categories || []
        const tagsArray = Array.isArray(tagsData) ? tagsData : tagsData.tags || []

        console.log('✅ Categorias processadas:', categoriesArray.length)
        console.log('✅ Tags processadas:', tagsArray.length)

        setCategories(categoriesArray)
        setTags(tagsArray)
      } catch (err) {
        console.error('❌ Erro ao buscar dados do fórum:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    categories,
    tags,
    loading,
    error
  }
}
