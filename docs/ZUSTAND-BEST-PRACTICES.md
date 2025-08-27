# 🚀 Zustand - Melhores Práticas para Estado Global

## 📋 **Visão Geral**

O **Zustand** é a solução de estado global escolhida para o Acode Lab, oferecendo uma API simples, performática e TypeScript-first para gerenciar o estado da aplicação.

## ✨ **Por que Zustand?**

- **Simplicidade**: API minimalista e intuitiva
- **Performance**: Re-renderizações otimizadas
- **TypeScript**: Suporte nativo e excelente
- **Bundle Size**: Apenas 2.5KB (gzipped)
- **DevTools**: Integração com Redux DevTools
- **Middleware**: Sistema flexível de middlewares
- **Next.js**: Compatibilidade perfeita com SSR/SSG

## 🏗️ **Arquitetura dos Stores**

### **1. Estrutura de Arquivos**
```
lib/
├── stores/
│   ├── useAuthStore.ts      # Autenticação e usuário
│   ├── useForumStore.ts     # Dados do fórum
│   ├── useUIStore.ts        # Estado da interface
│   ├── useRealtimeStore.ts  # Dados em tempo real
│   └── index.ts             # Exportações centralizadas
├── hooks/
│   └── useStore.ts          # Hooks personalizados
└── types/
    └── store.ts             # Tipos compartilhados
```

### **2. Separação de Responsabilidades**
- **useAuthStore**: Usuário, autenticação, permissões
- **useForumStore**: Perguntas, respostas, categorias, tags
- **useUIStore**: Modais, notificações, tema, loading
- **useRealtimeStore**: WebSocket, usuários online, updates em tempo real

## 🎯 **Melhores Práticas**

### **1. Estrutura do Store**
```typescript
interface StoreState {
  // 1. Estado (State)
  data: Data[]
  isLoading: boolean
  error: string | null
  
  // 2. Ações (Actions)
  setData: (data: Data[]) => void
  addData: (item: Data) => void
  updateData: (id: string, updates: Partial<Data>) => void
  removeData: (id: string) => void
  
  // 3. Estados de Loading
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // 4. Valores Computados (Computed Values)
  getDataById: (id: string) => Data | undefined
  getFilteredData: () => Data[]
}
```

### **2. Criação do Store**
```typescript
export const useStore = create<StoreState>()(
  devtools( // Para Redux DevTools
    persist( // Para persistência (opcional)
      (set, get) => ({
        // Estado inicial
        data: [],
        isLoading: false,
        error: null,
        
        // Ações
        setData: (data) => set({ data }),
        addData: (item) => set((state) => ({ 
          data: [item, ...state.data] 
        })),
        updateData: (id, updates) => set((state) => ({
          data: state.data.map(item => 
            item.id === id ? { ...item, ...updates } : item
          )
        })),
        removeData: (id) => set((state) => ({
          data: state.data.filter(item => item.id !== id)
        })),
        
        // Estados de loading
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
        
        // Valores computados
        getDataById: (id) => {
          const state = get()
          return state.data.find(item => item.id === id)
        },
        getFilteredData: () => {
          const state = get()
          return state.data.filter(/* lógica de filtro */)
        }
      }),
      {
        name: 'store-name', // Nome para localStorage
        partialize: (state) => ({ 
          // Apenas dados específicos para persistir
          data: state.data 
        })
      }
    ),
    {
      name: 'store-name' // Nome para Redux DevTools
    }
  )
)
```

### **3. Hooks Personalizados**
```typescript
// ✅ BOM: Hook personalizado com lógica encapsulada
export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    login,
    logout
  } = useAuthStore()

  return {
    user,
    isAuthenticated,
    login,
    logout,
    
    // Valores computados
    isAdmin: user?.role === 'admin',
    displayName: user?.displayName || user?.username || 'Usuário'
  }
}

// ❌ RUIM: Usar o store diretamente no componente
const Component = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore()
  // Lógica espalhada pelo componente
}
```

### **4. Uso em Componentes**
```typescript
// ✅ BOM: Hook personalizado com seleção específica
const Component = () => {
  const { user, isAuthenticated, login } = useAuth()
  const { questions, addQuestion } = useForum()
  
  // Componente limpo e focado
}

// ❌ RUIM: Seleção desnecessária de todo o estado
const Component = () => {
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    updateUser, 
    setLoading, 
    setError, 
    clearError 
  } = useAuthStore()
  // Muitas propriedades não utilizadas
}
```

### **5. Middlewares Recomendados**
```typescript
// DevTools - Para desenvolvimento
devtools({
  name: 'store-name',
  enabled: process.env.NODE_ENV === 'development'
})

// Persist - Para persistência de dados
persist(
  (set, get) => ({ /* store logic */ }),
  {
    name: 'store-name',
    partialize: (state) => ({ 
      // Apenas dados essenciais
      user: state.user,
      theme: state.theme
    })
  }
)

// Immer - Para atualizações imutáveis (opcional)
import { immer } from 'zustand/middleware/immer'

immer((set) => ({
  updateData: (id, updates) => set((state) => {
    const item = state.data.find(d => d.id === id)
    if (item) {
      Object.assign(item, updates)
    }
  })
}))
```

## 🔄 **Padrões de Atualização**

### **1. Atualizações Simples**
```typescript
// ✅ BOM: Atualização direta
setData: (data) => set({ data })

// ✅ BOM: Atualização com spread
updateUser: (updates) => set((state) => ({
  user: { ...state.user, ...updates }
}))
```

### **2. Atualizações Complexas**
```typescript
// ✅ BOM: Atualização com lógica
addQuestion: (question) => set((state) => ({
  questions: [question, ...state.questions],
  totalQuestions: state.totalQuestions + 1
}))

// ✅ BOM: Atualização condicional
updateQuestion: (id, updates) => set((state) => ({
  questions: state.questions.map(q => 
    q.id === id ? { ...q, ...updates, updatedAt: new Date() } : q
  )
}))
```

### **3. Valores Computados**
```typescript
// ✅ BOM: Função que retorna valor computado
getFilteredQuestions: () => {
  const state = get()
  let filtered = [...state.questions]
  
  if (state.selectedCategory) {
    filtered = filtered.filter(q => q.categoryId === state.selectedCategory)
  }
  
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase()
    filtered = filtered.filter(q => 
      q.title.toLowerCase().includes(query) ||
      q.content.toLowerCase().includes(query)
    )
  }
  
  return filtered
}
```

## 📱 **Integração com Next.js**

### **1. Server Components**
```typescript
// ❌ RUIM: Store em Server Component
const ServerComponent = () => {
  const data = useStore() // Erro: hooks não funcionam em Server Components
}

// ✅ BOM: Dados via props ou API
const ServerComponent = ({ data }: { data: Data[] }) => {
  return <div>{/* render data */}</div>
}
```

### **2. Client Components**
```typescript
// ✅ BOM: Store em Client Component
"use client"

const ClientComponent = () => {
  const { data, updateData } = useStore()
  return <div>{/* render data */}</div>
}
```

### **3. Hydration**
```typescript
// ✅ BOM: Evitar problemas de hydration
const Component = () => {
  const [isHydrated, setIsHydrated] = useState(false)
  
  useEffect(() => {
    setIsHydrated(true)
  }, [])
  
  if (!isHydrated) {
    return <div>Carregando...</div>
  }
  
  return <div>{/* conteúdo do store */}</div>
}
```

## 🧪 **Testes**

### **1. Teste de Store**
```typescript
import { renderHook, act } from '@testing-library/react'
import { useStore } from './useStore'

describe('useStore', () => {
  it('should add data', () => {
    const { result } = renderHook(() => useStore())
    
    act(() => {
      result.current.addData({ id: '1', name: 'Test' })
    })
    
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data[0].name).toBe('Test')
  })
})
```

### **2. Mock de Store**
```typescript
// Mock para testes
jest.mock('@/lib/stores/useStore', () => ({
  useStore: () => ({
    data: mockData,
    addData: jest.fn(),
    updateData: jest.fn()
  })
}))
```

## 🚨 **Anti-Padrões**

### **1. ❌ Store Gigante**
```typescript
// ❌ RUIM: Um store para tudo
interface MegaStore {
  user: User
  questions: Question[]
  answers: Answer[]
  categories: Category[]
  tags: Tag[]
  ui: UIState
  realtime: RealtimeState
  // ... mais 50 propriedades
}
```

### **2. ❌ Lógica de Negócio no Store**
```typescript
// ❌ RUIM: Lógica complexa no store
addQuestion: (question) => {
  // Validação complexa
  if (question.title.length < 10) {
    throw new Error('Título muito curto')
  }
  
  // Transformação de dados
  const transformedQuestion = {
    ...question,
    slug: question.title.toLowerCase().replace(/\s+/g, '-'),
    createdAt: new Date()
  }
  
  // Lógica de negócio
  if (question.tags.includes('urgent')) {
    sendNotification('Nova pergunta urgente!')
  }
  
  set((state) => ({ questions: [transformedQuestion, ...state.questions] }))
}
```

### **3. ❌ Dependências Externas no Store**
```typescript
// ❌ RUIM: API calls no store
addQuestion: async (question) => {
  const response = await fetch('/api/questions', {
    method: 'POST',
    body: JSON.stringify(question)
  })
  
  if (response.ok) {
    const savedQuestion = await response.json()
    set((state) => ({ 
      questions: [savedQuestion, ...state.questions] 
    }))
  }
}
```

## 📚 **Recursos Adicionais**

### **1. Middlewares Úteis**
- **immer**: Para atualizações imutáveis
- **persist**: Para persistência de dados
- **devtools**: Para debugging
- **subscribeWithSelector**: Para seletores otimizados

### **2. Ferramentas de Desenvolvimento**
- **Redux DevTools**: Para debugging
- **Zustand DevTools**: Para inspeção do estado
- **React DevTools**: Para análise de re-renderizações

### **3. Bibliotecas Complementares**
- **zustand/middleware**: Middlewares oficiais
- **zustand/shallow**: Para comparação superficial
- **zustand/context**: Para contexto React

## 🎉 **Conclusão**

O Zustand oferece uma solução elegante e performática para gerenciamento de estado global no Acode Lab. Seguindo estas melhores práticas, você terá:

- ✅ **Código limpo** e organizado
- ✅ **Performance otimizada** com re-renderizações mínimas
- ✅ **TypeScript** com tipagem completa
- ✅ **Debugging** fácil com DevTools
- ✅ **Manutenibilidade** alta com separação clara de responsabilidades
- ✅ **Escalabilidade** para projetos grandes

Lembre-se: **simplicidade é a chave**. Mantenha os stores focados, use hooks personalizados e evite over-engineering! 🚀
