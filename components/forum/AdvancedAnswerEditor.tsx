"use client"

import { useState, useRef, useEffect } from 'react'
import { 
  Code, Bold, Italic, Link, Image, List, Quote,
  Eye, EyeOff, Save, Send, Sparkles, Brain,
  FileText, Paperclip, Mic, Camera, Zap,
  CheckCircle, AlertTriangle, Lightbulb, Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AdvancedAnswerEditorProps {
  questionId: string
  questionTitle: string
  questionContent: string
  onSubmit: (answer: AnswerData) => void
  onSaveDraft: (draft: AnswerData) => void
  existingDraft?: AnswerData
  aiSuggestions?: AISuggestion[]
}

interface AnswerData {
  content: string
  codeBlocks: Array<{
    language: string
    code: string
    explanation?: string
  }>
  attachments: File[]
  tags: string[]
  confidence: number
  isCollaborative: boolean
  estimatedReadTime: number
  difficulty: number
  followUpQuestions?: string[]
}

interface AISuggestion {
  type: 'code' | 'explanation' | 'resource' | 'structure'
  title: string
  content: string
  confidence: number
  relevance: number
}

interface CodeBlock {
  id: string
  language: string
  code: string
  explanation: string
  isAiGenerated: boolean
}

const formatButtons = [
  { icon: Bold, label: 'Negrito', shortcut: 'Ctrl+B', markdown: '**' },
  { icon: Italic, label: 'Itálico', shortcut: 'Ctrl+I', markdown: '*' },
  { icon: Code, label: 'Código', shortcut: 'Ctrl+K', markdown: '`' },
  { icon: Link, label: 'Link', shortcut: 'Ctrl+L', markdown: '[](url)' },
  { icon: Quote, label: 'Citação', shortcut: 'Ctrl+Q', markdown: '> ' },
  { icon: List, label: 'Lista', shortcut: 'Ctrl+L', markdown: '- ' },
]

const programmingLanguages = [
  'javascript', 'typescript', 'python', 'java', 'csharp', 'cpp',
  'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'html', 'css',
  'sql', 'bash', 'json', 'yaml', 'xml', 'markdown'
]

export const AdvancedAnswerEditor = ({
  questionId,
  questionTitle,
  questionContent,
  onSubmit,
  onSaveDraft,
  existingDraft,
  aiSuggestions = []
}: AdvancedAnswerEditorProps) => {
  const [answerData, setAnswerData] = useState<AnswerData>(existingDraft || {
    content: '',
    codeBlocks: [],
    attachments: [],
    tags: [],
    confidence: 80,
    isCollaborative: false,
    estimatedReadTime: 2,
    difficulty: 2
  })
  
  const [activeTab, setActiveTab] = useState('write')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([])
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false)
  const [currentCodeBlock, setCurrentCodeBlock] = useState<Partial<CodeBlock>>({
    language: 'javascript',
    code: '',
    explanation: ''
  })
  const [aiSuggestionsExpanded, setAiSuggestionsExpanded] = useState(true)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      onSaveDraft(answerData)
    }, 2000)
    return () => clearTimeout(timer)
  }, [answerData, onSaveDraft])

  // Calculate estimated read time
  useEffect(() => {
    const wordCount = answerData.content.split(' ').length
    const readTime = Math.max(1, Math.ceil(wordCount / 200))
    setAnswerData(prev => ({ ...prev, estimatedReadTime: readTime }))
  }, [answerData.content])

  const insertFormatting = (markdown: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = answerData.content.substring(start, end)
    
    let newText = ''
    if (markdown === '**' || markdown === '*' || markdown === '`') {
      newText = markdown + selectedText + markdown
    } else if (markdown === '[](url)') {
      newText = `[${selectedText}](url)`
    } else {
      newText = markdown + selectedText
    }
    
    const newContent = answerData.content.substring(0, start) + newText + answerData.content.substring(end)
    setAnswerData(prev => ({ ...prev, content: newContent }))
  }

  const addCodeBlock = () => {
    if (!currentCodeBlock.code) return
    
    const newBlock: CodeBlock = {
      id: Date.now().toString(),
      language: currentCodeBlock.language || 'javascript',
      code: currentCodeBlock.code,
      explanation: currentCodeBlock.explanation || '',
      isAiGenerated: false
    }
    
    setCodeBlocks(prev => [...prev, newBlock])
    setCurrentCodeBlock({ language: 'javascript', code: '', explanation: '' })
  }

  const removeCodeBlock = (id: string) => {
    setCodeBlocks(prev => prev.filter(block => block.id !== id))
  }

  const generateAICodeSuggestion = async () => {
    setIsAiAnalyzing(true)
    
    // Simulate AI code generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const aiBlock: CodeBlock = {
      id: Date.now().toString(),
      language: 'javascript',
      code: `// AI suggested solution based on the question
function solveProblem() {
  // Implementation here
  return result;
}`,
      explanation: 'Esta é uma solução sugerida pela IA baseada na análise da pergunta.',
      isAiGenerated: true
    }
    
    setCodeBlocks(prev => [...prev, aiBlock])
    setIsAiAnalyzing(false)
  }

  const applySuggestion = (suggestion: AISuggestion) => {
    switch (suggestion.type) {
      case 'explanation':
        setAnswerData(prev => ({
          ...prev,
          content: prev.content + '\n\n' + suggestion.content
        }))
        break
      case 'code':
        const newBlock: CodeBlock = {
          id: Date.now().toString(),
          language: 'javascript',
          code: suggestion.content,
          explanation: '',
          isAiGenerated: true
        }
        setCodeBlocks(prev => [...prev, newBlock])
        break
    }
  }

  const handleSubmit = () => {
    const finalAnswer: AnswerData = {
      ...answerData,
      codeBlocks: codeBlocks.map(block => ({
        language: block.language,
        code: block.code,
        explanation: block.explanation
      }))
    }
    onSubmit(finalAnswer)
  }

  const getQualityScore = () => {
    let score = 0
    if (answerData.content.length > 100) score += 30
    if (codeBlocks.length > 0) score += 25
    if (answerData.content.includes('exemplo') || answerData.content.includes('example')) score += 15
    if (answerData.content.length > 300) score += 15
    if (answerData.tags.length > 0) score += 15
    return Math.min(100, score)
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">Respondendo: {questionTitle}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {questionContent}
              </p>
            </div>
            <Badge variant="outline" className="ml-4">
              Qualidade: {getQualityScore()}%
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-3 space-y-4">
          {/* Formatting Toolbar */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 flex-wrap">
                {formatButtons.map((button) => (
                  <Button
                    key={button.label}
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting(button.markdown)}
                    title={`${button.label} (${button.shortcut})`}
                    className="h-8 w-8 p-0"
                  >
                    <button.icon className="h-4 w-4" />
                  </Button>
                ))}
                <Separator orientation="vertical" className="h-6" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 w-8 p-0"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className="h-8 w-8 p-0"
                >
                  {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Editor */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="write">Escrever</TabsTrigger>
              <TabsTrigger value="code">Código</TabsTrigger>
              <TabsTrigger value="preview">Prévia</TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <Textarea
                    ref={textareaRef}
                    placeholder="Escreva sua resposta detalhada aqui..."
                    value={answerData.content}
                    onChange={(e) => setAnswerData(prev => ({ ...prev, content: e.target.value }))}
                    className="min-h-[400px] resize-none border-0 focus-visible:ring-0"
                  />
                </CardContent>
              </Card>

              {/* Code Blocks Display */}
              {codeBlocks.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Blocos de Código</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {codeBlocks.map((block) => (
                      <div key={block.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{block.language}</Badge>
                          <div className="flex items-center gap-2">
                            {block.isAiGenerated && (
                              <Badge variant="secondary" className="text-xs">
                                <Sparkles className="h-3 w-3 mr-1" />
                                IA
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCodeBlock(block.id)}
                            >
                              Remover
                            </Button>
                          </div>
                        </div>
                        <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                          <code>{block.code}</code>
                        </pre>
                        {block.explanation && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {block.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="code" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Adicionar Código</CardTitle>
                    <Button
                      onClick={generateAICodeSuggestion}
                      disabled={isAiAnalyzing}
                      variant="outline"
                      size="sm"
                    >
                      {isAiAnalyzing ? (
                        <>
                          <Brain className="h-4 w-4 mr-2 animate-spin" />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Sugerir com IA
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Linguagem</Label>
                    <Select
                      value={currentCodeBlock.language}
                      onValueChange={(value) => setCurrentCodeBlock(prev => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {programmingLanguages.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Código</Label>
                    <Textarea
                      placeholder="Cole seu código aqui..."
                      value={currentCodeBlock.code}
                      onChange={(e) => setCurrentCodeBlock(prev => ({ ...prev, code: e.target.value }))}
                      className="min-h-[200px] font-mono"
                    />
                  </div>

                  <div>
                    <Label>Explicação (opcional)</Label>
                    <Textarea
                      placeholder="Explique o que este código faz..."
                      value={currentCodeBlock.explanation}
                      onChange={(e) => setCurrentCodeBlock(prev => ({ ...prev, explanation: e.target.value }))}
                      className="h-20"
                    />
                  </div>

                  <Button
                    onClick={addCodeBlock}
                    disabled={!currentCodeBlock.code}
                    className="w-full"
                  >
                    Adicionar Bloco de Código
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Prévia da Resposta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap">{answerData.content}</div>
                    
                    {codeBlocks.map((block) => (
                      <div key={block.id} className="my-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{block.language}</Badge>
                          {block.isAiGenerated && (
                            <Badge variant="secondary" className="text-xs">
                              <Sparkles className="h-3 w-3 mr-1" />
                              IA
                            </Badge>
                          )}
                        </div>
                        <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                          <code>{block.code}</code>
                        </pre>
                        {block.explanation && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {block.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Answer Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Configurações da Resposta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Nível de Confiança: {answerData.confidence}%</Label>
                  <Slider
                    value={[answerData.confidence]}
                    onValueChange={(value: number[]) => setAnswerData(prev => ({ ...prev, confidence: value[0] }))}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-sm">Dificuldade da Resposta</Label>
                  <Select
                    value={answerData.difficulty.toString()}
                    onValueChange={(value) => setAnswerData(prev => ({ ...prev, difficulty: parseInt(value) }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Iniciante</SelectItem>
                      <SelectItem value="2">Básico</SelectItem>
                      <SelectItem value="3">Intermediário</SelectItem>
                      <SelectItem value="4">Avançado</SelectItem>
                      <SelectItem value="5">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Resposta Colaborativa</Label>
                  <p className="text-xs text-muted-foreground">
                    Permitir que outros melhorem esta resposta
                  </p>
                </div>
                <Switch
                  checked={answerData.isCollaborative}
                  onCheckedChange={(checked: boolean) => setAnswerData(prev => ({ ...prev, isCollaborative: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Section */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>~{answerData.estimatedReadTime} min de leitura</span>
                  <span>Qualidade: {getQualityScore()}%</span>
                  {answerData.content && <span>Rascunho salvo automaticamente</span>}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => onSaveDraft(answerData)}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Rascunho
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!answerData.content.trim() || getQualityScore() < 30}
                    className="bg-gradient-to-r from-green-500 to-green-600"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Publicar Resposta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* AI Suggestions */}
          {aiSuggestions.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-500" />
                    Sugestões da IA
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAiSuggestionsExpanded(!aiSuggestionsExpanded)}
                  >
                    {aiSuggestionsExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              {aiSuggestionsExpanded && (
                <CardContent className="space-y-3">
                  {aiSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="text-sm font-medium">{suggestion.title}</h5>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.confidence}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {suggestion.content}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applySuggestion(suggestion)}
                        className="text-xs"
                      >
                        Aplicar
                      </Button>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          )}

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                Dicas Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs">Explique seu raciocínio passo a passo</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs">Inclua exemplos práticos quando possível</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs">Teste seu código antes de compartilhar</p>
              </div>
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs">Responda diretamente à pergunta feita</p>
              </div>
            </CardContent>
          </Card>

          {/* Quality Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Métricas de Qualidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Extensão:</span>
                <Badge variant={answerData.content.length > 200 ? 'default' : 'outline'}>
                  {answerData.content.length > 200 ? 'Boa' : 'Curta'}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Código:</span>
                <Badge variant={codeBlocks.length > 0 ? 'default' : 'outline'}>
                  {codeBlocks.length > 0 ? 'Incluído' : 'Ausente'}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Estrutura:</span>
                <Badge variant={answerData.content.includes('\n\n') ? 'default' : 'outline'}>
                  {answerData.content.includes('\n\n') ? 'Organizada' : 'Linear'}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Confiança:</span>
                <Badge variant={answerData.confidence >= 80 ? 'default' : 'outline'}>
                  {answerData.confidence}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
        onChange={(e) => {
          const files = Array.from(e.target.files || [])
          setAnswerData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }))
        }}
      />
    </div>
  )
}