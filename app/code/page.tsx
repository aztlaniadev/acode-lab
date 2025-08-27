import { Metadata } from 'next'
import { Code, GitBranch, Zap, Shield, Users, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Código - Acode Lab',
  description: 'Compartilhe, colabore e aprenda com código de qualidade na comunidade Acode Lab.',
}

const features = [
  {
    icon: Code,
    title: 'Snippets de Código',
    description: 'Compartilhe trechos de código úteis e reutilizáveis com a comunidade.',
  },
  {
    icon: GitBranch,
    title: 'Controle de Versão',
    description: 'Gerencie seus projetos com Git e colabore com outros desenvolvedores.',
  },
  {
    icon: Zap,
    title: 'Execução Rápida',
    description: 'Teste e execute código diretamente no navegador com sandbox seguro.',
  },
  {
    icon: Shield,
    title: 'Segurança',
    description: 'Ambiente isolado para execução de código sem riscos de segurança.',
  },
  {
    icon: Users,
    title: 'Colaboração',
    description: 'Trabalhe em equipe, revise código e aprenda com outros desenvolvedores.',
  },
  {
    icon: TrendingUp,
    title: 'Análise de Performance',
    description: 'Monitore e otimize o desempenho do seu código.',
  },
]

const codeExamples = [
  {
    language: 'JavaScript',
    title: 'Função de Debounce',
    description: 'Implementação eficiente de debounce para otimizar chamadas de API.',
    code: `function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}`,
  },
  {
    language: 'Python',
    title: 'Decorator de Cache',
    description: 'Decorator para cachear resultados de funções custosas.',
    code: `from functools import lru_cache

@lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)`,
  },
  {
    language: 'React',
    title: 'Hook Personalizado',
    description: 'Hook para gerenciar estado local com persistência.',
    code: `import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = value => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}`,
  },
]

export default function CodePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Compartilhe seu
            <span className="text-primary"> Código</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Uma plataforma completa para compartilhar, colaborar e aprender com código de qualidade. 
            Conecte-se com desenvolvedores e melhore suas habilidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Compartilhar Código
            </button>
            <button className="border border-border text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-muted transition-colors">
              Explorar Projetos
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-16">
            Por que escolher nossa plataforma?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Examples Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-16">
            Exemplos de Código da Comunidade
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {codeExamples.map((example, index) => (
              <div key={index} className="bg-background border border-border rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                      {example.language}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {example.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {example.description}
                  </p>
                </div>
                <div className="bg-muted p-4">
                  <pre className="text-sm text-foreground overflow-x-auto">
                    <code>{example.code}</code>
                  </pre>
                </div>
                <div className="p-4 border-t border-border">
                  <button className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors">
                    Ver Completo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Pronto para compartilhar seu código?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Junte-se a milhares de desenvolvedores que já estão compartilhando conhecimento 
            e construindo o futuro da programação.
          </p>
          <button className="bg-primary text-primary-foreground px-10 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors">
            Começar Agora
          </button>
        </div>
      </section>
    </div>
  )
}
