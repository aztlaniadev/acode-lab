"use client"

import { useState, useEffect } from 'react'
import { 
  Wand2, Lightbulb, Search, Tag, Users, Target, 
  CheckCircle, AlertCircle, TrendingUp, Award,
  ArrowRight, ArrowLeft, Sparkles, Brain
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'

interface QuestionWizardProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (question: QuestionData) => void
  suggestedTags?: string[]
  categories: Array<{
    id: string
    name: string
    description: string
    color: string
  }>
}

interface QuestionData {
  title: string
  content: string
  category: string
  tags: string[]
  difficulty: number
  expectedAnswerTime: number
  bounty?: number
  attachments?: File[]
}

interface AISuggestion {
  type: 'title' | 'content' | 'tags' | 'category'
  suggestion: string
  confidence: number
  reason: string
}

const difficultyLabels = ['Iniciante', 'Básico', 'Intermediário', 'Avançado', 'Expert']
const timeLabels = ['5 min', '15 min', '30 min', '1 hora', '1+ dia']

export const QuestionWizard = ({
  isOpen,
  onClose,
  onSubmit,
  suggestedTags = [],
  categories
}: QuestionWizardProps) => {
  const [step, setStep] = useState(1)
  const [questionData, setQuestionData] = useState<QuestionData>({
    title: '',
    content: '',
    category: '',
    tags: [],
    difficulty: 2,
    expectedAnswerTime: 2
  })
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [qualityScore, setQualityScore] = useState(0)
  const [customTag, setCustomTag] = useState('')
  const [similarQuestions, setSimilarQuestions] = useState<Array<{
    id: string
    title: string
    answers: number
    solved: boolean
  }>>([])

  // Simulate AI analysis
  const analyzeQuestion = async () => {
    setIsAnalyzing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const suggestions: AISuggestion[] = [
      {
        type: 'title',
        suggestion: 'Considere ser mais específico sobre a tecnologia usada',
        confidence: 85,
        reason: 'Títulos específicos recebem 40% mais respostas'
      },
      {
        type: 'tags',
        suggestion: 'javascript',
        confidence: 92,
        reason: 'Detectado código JavaScript no conteúdo'
      },
      {
        type: 'category',
        suggestion: 'programacao',
        confidence: 88,
        reason: 'Baseado no conteúdo da pergunta'
      }
    ]
    
    setAiSuggestions(suggestions)
    setQualityScore(75 + Math.random() * 20)
    
    // Simulate similar questions
    setSimilarQuestions([
      { id: '1', title: 'Como resolver erro similar em React', answers: 3, solved: true },
      { id: '2', title: 'Problema parecido com hooks', answers: 1, solved: false }
    ])
    
    setIsAnalyzing(false)
  }

  useEffect(() => {
    if (questionData.title && questionData.content && step === 2) {
      analyzeQuestion()
    }
  }, [questionData.title, questionData.content, step])

  const addTag = (tag: string) => {
    if (tag && !questionData.tags.includes(tag)) {
      setQuestionData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setQuestionData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const applySuggestion = (suggestion: AISuggestion) => {
    switch (suggestion.type) {
      case 'tags':
        addTag(suggestion.suggestion)
        break
      case 'category':
        setQuestionData(prev => ({ ...prev, category: suggestion.suggestion }))
        break
    }
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const canProceed = () => {
    switch (step) {
      case 1:
        return questionData.title.length >= 10 && questionData.content.length >= 50
      case 2:
        return questionData.category && questionData.tags.length > 0
      case 3:
        return true
      case 4:
        return qualityScore >= 60
      default:
        return false
    }
  }

  const handleSubmit = () => {
    onSubmit(questionData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl h-[90vh] bg-background rounded-xl shadow-2xl border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wand2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Assistente de Perguntas</h2>
              <p className="text-sm text-muted-foreground">
                Etapa {step} de 4 - Vamos criar uma pergunta incrível!
              </p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex h-[calc(100%-120px)]">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Step 1: Question Content */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Qual é sua pergunta?</h3>
                  <p className="text-muted-foreground">
                    Seja claro e específico para obter as melhores respostas
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título da pergunta</Label>
                    <Input
                      id="title"
                      placeholder="Como posso resolver..."
                      value={questionData.title}
                      onChange={(e) => setQuestionData(prev => ({ ...prev, title: e.target.value }))}
                      className="text-lg"
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-muted-foreground">
                        Mínimo 10 caracteres
                      </p>
                      <p className={`text-xs ${questionData.title.length >= 10 ? 'text-green-500' : 'text-red-500'}`}>
                        {questionData.title.length}/100
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="content">Descrição detalhada</Label>
                    <Textarea
                      id="content"
                      placeholder="Descreva seu problema em detalhes, inclua código se necessário..."
                      value={questionData.content}
                      onChange={(e) => setQuestionData(prev => ({ ...prev, content: e.target.value }))}
                      className="min-h-[200px]"
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-muted-foreground">
                        Mínimo 50 caracteres - Seja específico!
                      </p>
                      <p className={`text-xs ${questionData.content.length >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                        {questionData.content.length}
                      </p>
                    </div>
                  </div>

                  {/* Writing Tips */}
                  <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-blue-500" />
                        <CardTitle className="text-sm">Dicas para uma boa pergunta</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs">Inclua detalhes sobre o que você tentou</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs">Adicione código ou exemplos quando relevante</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs">Seja específico sobre seu ambiente/tecnologia</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 2: Categorization & AI Analysis */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Categorização e Análise</h3>
                  <p className="text-muted-foreground">
                    Ajude outros a encontrar sua pergunta
                  </p>
                </div>

                {/* AI Analysis */}
                {isAnalyzing ? (
                  <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="animate-spin">
                          <Brain className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">IA analisando sua pergunta...</h4>
                          <p className="text-sm text-muted-foreground">
                            Gerando sugestões personalizadas
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : aiSuggestions.length > 0 && (
                  <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        <CardTitle className="text-sm">Sugestões da IA</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {aiSuggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start justify-between p-3 bg-background/50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{suggestion.suggestion}</p>
                            <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {suggestion.confidence}% confiança
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => applySuggestion(suggestion)}
                          >
                            Aplicar
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Category Selection */}
                <div>
                  <Label>Categoria</Label>
                  <Select
                    value={questionData.category}
                    onValueChange={(value) => setQuestionData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                <div>
                  <Label>Tags</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Adicionar tag..."
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addTag(customTag)
                            setCustomTag('')
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          addTag(customTag)
                          setCustomTag('')
                        }}
                        disabled={!customTag}
                      >
                        Adicionar
                      </Button>
                    </div>

                    {/* Suggested Tags */}
                    {suggestedTags.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Tags sugeridas:</p>
                        <div className="flex flex-wrap gap-2">
                          {suggestedTags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                              onClick={() => addTag(tag)}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Selected Tags */}
                    {questionData.tags.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Tags selecionadas:</p>
                        <div className="flex flex-wrap gap-2">
                          {questionData.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="default"
                              className="cursor-pointer"
                              onClick={() => removeTag(tag)}
                            >
                              {tag} ×
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Difficulty & Expectations */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Configurações Avançadas</h3>
                  <p className="text-muted-foreground">
                    Ajude a comunidade a entender sua pergunta
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Nível de Dificuldade
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Slider
                          value={[questionData.difficulty]}
                          onValueChange={(value: number[]) => setQuestionData(prev => ({ ...prev, difficulty: value[0] }))}
                          max={4}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-center">
                          <Badge variant="outline" className="text-sm">
                            {difficultyLabels[questionData.difficulty]}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Tempo Esperado de Resposta
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Slider
                          value={[questionData.expectedAnswerTime]}
                          onValueChange={(value: number[]) => setQuestionData(prev => ({ ...prev, expectedAnswerTime: value[0] }))}
                          max={4}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-center">
                          <Badge variant="outline" className="text-sm">
                            {timeLabels[questionData.expectedAnswerTime]}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Bounty Option */}
                <Card className="bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      Recompensa (Opcional)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Ofereça pontos de reputação para atrair melhores respostas
                    </p>
                    <Input
                      type="number"
                      placeholder="Ex: 50 pontos"
                      value={questionData.bounty || ''}
                      onChange={(e) => setQuestionData(prev => ({ 
                        ...prev, 
                        bounty: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Review & Quality Check */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Revisão Final</h3>
                  <p className="text-muted-foreground">
                    Sua pergunta está quase pronta!
                  </p>
                </div>

                {/* Quality Score */}
                <Card className={`${qualityScore >= 80 ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' : 
                  qualityScore >= 60 ? 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800' :
                  'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'}`}>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle className={`h-4 w-4 ${qualityScore >= 80 ? 'text-green-500' : 
                        qualityScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`} />
                      Pontuação de Qualidade: {Math.round(qualityScore)}/100
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${qualityScore >= 80 ? 'bg-green-500' : 
                          qualityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${qualityScore}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {qualityScore >= 80 ? 'Excelente! Sua pergunta tem alta chance de receber boas respostas.' :
                       qualityScore >= 60 ? 'Boa pergunta! Considere adicionar mais detalhes.' :
                       'Sua pergunta precisa de melhorias para atrair respostas.'}
                    </p>
                  </CardContent>
                </Card>

                {/* Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Prévia da Pergunta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-lg">{questionData.title}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{categories.find(c => c.id === questionData.category)?.name}</Badge>
                        <Badge variant="secondary">{difficultyLabels[questionData.difficulty]}</Badge>
                        {questionData.bounty && (
                          <Badge variant="default" className="bg-yellow-500">
                            <Award className="h-3 w-3 mr-1" />
                            {questionData.bounty} pts
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm whitespace-pre-wrap">{questionData.content}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {questionData.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Similar Questions */}
                {similarQuestions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        Perguntas Similares Encontradas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Verifique se sua pergunta já foi respondida:
                      </p>
                      <div className="space-y-2">
                        {similarQuestions.map((q) => (
                          <div key={q.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{q.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {q.answers} resposta(s) {q.solved && '• Resolvida'}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              Ver
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Sidebar with Context */}
          <div className="w-80 border-l bg-muted/30 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Progress Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Progresso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`h-4 w-4 ${questionData.title.length >= 10 ? 'text-green-500' : 'text-muted-foreground'}`} />
                    <span className="text-sm">Título definido</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`h-4 w-4 ${questionData.content.length >= 50 ? 'text-green-500' : 'text-muted-foreground'}`} />
                    <span className="text-sm">Conteúdo detalhado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`h-4 w-4 ${questionData.category ? 'text-green-500' : 'text-muted-foreground'}`} />
                    <span className="text-sm">Categoria selecionada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`h-4 w-4 ${questionData.tags.length > 0 ? 'text-green-500' : 'text-muted-foreground'}`} />
                    <span className="text-sm">Tags adicionadas</span>
                  </div>
                </CardContent>
              </Card>

              {/* Tips for current step */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Dica da Etapa</CardTitle>
                </CardHeader>
                <CardContent>
                  {step === 1 && (
                    <p className="text-sm text-muted-foreground">
                      Título e descrição são cruciais. Seja específico sobre seu problema e contexto.
                    </p>
                  )}
                  {step === 2 && (
                    <p className="text-sm text-muted-foreground">
                      Categorias e tags ajudam especialistas a encontrar sua pergunta rapidamente.
                    </p>
                  )}
                  {step === 3 && (
                    <p className="text-sm text-muted-foreground">
                      Definir dificuldade e tempo ajuda a comunidade a priorizar respostas.
                    </p>
                  )}
                  {step === 4 && (
                    <p className="text-sm text-muted-foreground">
                      Revise cuidadosamente. Uma pergunta bem estruturada recebe melhores respostas.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Community Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Estatísticas da Comunidade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Perguntas hoje:</span>
                    <span className="font-medium">247</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxa de resposta:</span>
                    <span className="font-medium text-green-500">94%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tempo médio:</span>
                    <span className="font-medium">23 min</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between p-6 border-t bg-muted/30">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            
            {step < 4 ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
              >
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={qualityScore < 60}
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Publicar Pergunta
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}