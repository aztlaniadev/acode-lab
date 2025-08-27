'use client'

import { useState, useEffect } from 'react'
import { 
  Code, 
  Smartphone, 
  Brain, 
  Palette, 
  Server, 
  Database,
  Tag,
  AlertCircle,
  CheckCircle,
  Loader2,
  LogIn
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Category, Tag as TagType } from '@/types/forum'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface FormData {
  title: string
  content: string
  categoryId: string // Mudou de category para categoryId
  tags: string[]
}

interface FormErrors {
  title?: string
  content?: string
  categoryId?: string // Mudou de category para categoryId
  tags?: string
}

export function AskQuestionForm() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    categoryId: '', // Mudou de category para categoryId
    tags: []
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Estados para dados reais
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<TagType[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)

  // Buscar dados reais das APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setApiError(null)

        const [categoriesResponse, tagsResponse] = await Promise.all([
          fetch('/api/forum/categories'),
          fetch('/api/forum/tags')
        ])

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

        // Garantir que os dados são arrays
        const categoriesArray = Array.isArray(categoriesData) ? categoriesData : categoriesData.categories || []
        const tagsArray = Array.isArray(tagsData) ? tagsData : tagsData.tags || []

        setCategories(categoriesArray)
        setTags(tagsArray)
      } catch (err) {
        console.error('Erro ao buscar dados:', err)
        setApiError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const validateForm = () => {
    const newErrors: FormErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'O título é obrigatório'
    } else if (formData.title.length < 10) {
      newErrors.title = 'O título deve ter pelo menos 10 caracteres'
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'O conteúdo é obrigatório'
    } else if (formData.content.length < 20) {
      newErrors.content = 'O conteúdo deve ter pelo menos 20 caracteres'
    }
    
    if (!formData.categoryId) { // Mudou de category para categoryId
      newErrors.categoryId = 'Selecione uma categoria'
    }
    
    if (formData.tags.length === 0) {
      newErrors.tags = 'Selecione pelo menos uma tag'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Enviar para API real
      const response = await fetch('/api/forum/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          categoryId: formData.categoryId, // Mudou de category para categoryId
          tags: formData.tags
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar pergunta')
      }

      const question = await response.json()
      
      setShowSuccess(true)
      setFormData({ title: '', content: '', categoryId: '', tags: [] })
      
      // Redirecionar para a pergunta criada após 2 segundos
      setTimeout(() => {
        router.push(`/forum/${question.slug}`)
      }, 2000)
      
    } catch (error) {
      console.error('Erro ao enviar pergunta:', error)
      setApiError(error instanceof Error ? error.message : 'Erro desconhecido')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTagToggle = (tagId: string) => {
    // Limitar a seleção de tags a 5
    if (formData.tags.length >= 5 && !formData.tags.includes(tagId)) {
      return
    }
    
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }))
    
    // Limpar erro de tags
    if (errors.tags) {
      setErrors(prev => ({ ...prev, tags: undefined }))
    }
  }

  const getSelectedCategory = () => {
    return categories.find(cat => cat.id === formData.categoryId) // Mudou de category para categoryId
  }

  // Verificar se usuário está autenticado
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Verificando autenticação...</span>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <div className="flex items-center justify-center gap-2 text-blue-800 mb-4">
          <LogIn className="w-8 h-8" />
          <h2 className="text-xl font-semibold">Faça login para criar uma pergunta</h2>
        </div>
        <p className="text-blue-700 mb-6">
          Você precisa estar logado para publicar perguntas no fórum.
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => router.push('/auth/signin')}
            size="lg"
            className="min-w-[140px]"
          >
            Fazer Login
          </Button>
          <Button 
            onClick={() => router.push('/auth/signin?callbackUrl=/forum/ask')}
            variant="outline"
            size="lg"
            className="min-w-[140px]"
          >
            Login e Voltar
          </Button>
        </div>
      </div>
    )
  }

  // Mostrar loading enquanto busca dados
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Carregando formulário...</span>
        </div>
      </div>
    )
  }

  // Mostrar erro se falhar ao buscar dados
  if (apiError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Erro ao carregar formulário</span>
        </div>
        <p className="text-red-700 text-sm mt-1">{apiError}</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline" 
          size="sm" 
          className="mt-2"
        >
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Mensagem de sucesso */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Pergunta enviada com sucesso!</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            Sua pergunta foi publicada e está visível para a comunidade.
            Redirecionando...
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título da pergunta */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Título da Pergunta</CardTitle>
            <p className="text-sm text-muted-foreground">
              Seja específico e imagine que está fazendo a pergunta para outra pessoa
            </p>
          </CardHeader>
          <CardContent>
            <input
              type="text"
              placeholder="Ex: Como implementar autenticação JWT em Next.js 14?"
              value={formData.title}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, title: e.target.value }))
                if (errors.title) setErrors(prev => ({ ...prev, title: undefined }))
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                errors.title ? 'border-red-300 focus:ring-red-500' : 'border-border focus:border-primary'
              }`}
            />
            {errors.title && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categoria */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categoria</CardTitle>
            <p className="text-sm text-muted-foreground">
              Escolha a categoria que melhor descreve sua pergunta
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((category) => (
                <div key={category.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, categoryId: category.id })) // Mudou de category para categoryId
                      if (errors.categoryId) setErrors(prev => ({ ...prev, categoryId: undefined })) // Mudou de category para categoryId
                    }}
                    className={`w-full p-4 border rounded-lg text-left transition-all duration-200 ${
                      formData.categoryId === category.id // Mudou de category para categoryId
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.icon}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {category.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {category.description}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
            {errors.categoryId && ( // Mudou de category para categoryId
              <div className="flex items-center gap-2 text-red-600 text-sm mt-3">
                <AlertCircle className="w-4 h-4" />
                {errors.categoryId}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tags</CardTitle>
            <p className="text-sm text-muted-foreground">
              Adicione até 5 tags para ajudar outros a encontrar sua pergunta
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div key={tag.id}>
                  <button
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    disabled={formData.tags.length >= 5 && !formData.tags.includes(tag.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                      formData.tags.includes(tag.id)
                        ? 'border-primary bg-primary text-primary-foreground'
                        : formData.tags.length >= 5 && !formData.tags.includes(tag.id)
                          ? 'border-border bg-muted text-muted-foreground cursor-not-allowed'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                    title={`${tag.description || 'Sem descrição'} • ${tag.usageCount || 0} perguntas`}
                  >
                    <Tag className="w-4 h-4" />
                    <span>{tag.name}</span>
                    <span className="text-xs opacity-70">
                      {tag.usageCount || 0}
                    </span>
                    
                    {/* Indicadores visuais */}
                    {tag.isPopular && (
                      <span className="text-yellow-500 text-xs">⭐</span>
                    )}
                    {tag.isNew && (
                      <span className="text-green-500 text-xs">🆕</span>
                    )}
                  </button>
                </div>
              ))}
            </div>
            {errors.tags && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-3">
                <AlertCircle className="w-4 h-4" />
                {errors.tags}
              </div>
            )}
            {/* Barra de progresso das tags */}
            <div className="mb-2">
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>{formData.tags.length}/5 tags selecionadas</span>
                <span className={formData.tags.length >= 5 ? 'text-destructive' : ''}>
                  {formData.tags.length >= 5 ? 'Limite atingido' : `${5 - formData.tags.length} restantes`}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    formData.tags.length >= 5 
                      ? 'bg-destructive' 
                      : formData.tags.length >= 4 
                        ? 'bg-yellow-500' 
                        : 'bg-primary'
                  }`}
                  style={{ width: `${(formData.tags.length / 5) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conteúdo da pergunta */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conteúdo da Pergunta</CardTitle>
            <p className="text-sm text-muted-foreground">
              Inclua todos os detalhes necessários para que alguém possa responder sua pergunta
            </p>
          </CardHeader>
          <CardContent>
            <textarea
              placeholder="Descreva sua pergunta em detalhes. Inclua código, erros específicos, ou contexto relevante..."
              value={formData.content}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, content: e.target.value }))
                if (errors.content) setErrors(prev => ({ ...prev, content: undefined }))
              }}
              rows={8}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none ${
                errors.content ? 'border-red-300 focus:ring-red-500' : 'border-border focus:border-primary'
              }`}
            />
            {errors.content && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <AlertCircle className="w-4 h-4" />
                {errors.content}
              </div>
            )}
            <div className="text-xs text-muted-foreground mt-2">
              {formData.content.length} caracteres
            </div>
          </CardContent>
        </Card>

        {/* Preview da pergunta */}
        {(formData.title || formData.content || formData.categoryId || formData.tags.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview da Pergunta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.title && (
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{formData.title}</h3>
                </div>
              )}
              
              {getSelectedCategory() && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Categoria:</span>
                  <Badge variant="secondary">
                    {getSelectedCategory()?.icon} {getSelectedCategory()?.name}
                  </Badge>
                </div>
              )}
              
              {formData.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Tags:</span>
                  <div className="flex gap-1">
                    {formData.tags.map(tagId => {
                      const tag = tags.find(t => t.id === tagId)
                      return tag ? (
                        <Badge key={tag.id} variant="outline" className="gap-1">
                          <Tag className="w-3 h-3" />
                          {tag.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
              )}
              
              {formData.content && (
                <div>
                  <span className="text-sm text-muted-foreground">Conteúdo:</span>
                  <div className="mt-2 p-3 bg-muted rounded-lg text-sm">
                    {formData.content}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Botões de ação */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" size="lg">
            Salvar Rascunho
          </Button>
          <Button 
            type="submit" 
            size="lg" 
            disabled={isSubmitting}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </div>
            ) : (
              'Publicar Pergunta'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
