import { Metadata } from 'next'

interface TagPageProps {
  params: {
    slug: string
  }
}

// Dados mockados para tags (copiados do page.tsx)
const tags = {
  'react': {
    id: 'react',
    name: 'React',
    description: 'Biblioteca JavaScript para construção de interfaces de usuário',
    color: '#61DAFB',
    questionsCount: 567,
    slug: 'react',
    relatedTags: ['javascript', 'typescript', 'nextjs', 'hooks'],
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-08-20'),
    isPopular: true,
    isNew: false
  },
  'javascript': {
    id: 'javascript',
    name: 'JavaScript',
    description: 'Linguagem de programação de alto nível e interpretada',
    color: '#F7DF1E',
    questionsCount: 890,
    slug: 'javascript',
    relatedTags: ['react', 'nodejs', 'typescript', 'es6'],
    createdAt: new Date('2019-01-01'),
    updatedAt: new Date('2024-08-20'),
    isPopular: true,
    isNew: false
  },
  'python': {
    id: 'python',
    name: 'Python',
    description: 'Linguagem de programação de alto nível e propósito geral',
    color: '#3776AB',
    questionsCount: 456,
    slug: 'python',
    relatedTags: ['django', 'flask', 'pandas', 'numpy'],
    createdAt: new Date('2019-01-01'),
    updatedAt: new Date('2024-08-20'),
    isPopular: false,
    isNew: false
  },
  'nodejs': {
    id: 'nodejs',
    name: 'Node.js',
    description: 'Runtime JavaScript para desenvolvimento server-side',
    color: '#339933',
    questionsCount: 234,
    slug: 'nodejs',
    relatedTags: ['javascript', 'express', 'npm', 'backend'],
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-08-20'),
    isPopular: false,
    isNew: false
  },
  'typescript': {
    id: 'typescript',
    name: 'TypeScript',
    description: 'Superset JavaScript com tipagem estática opcional',
    color: '#3178C6',
    questionsCount: 345,
    slug: 'typescript',
    relatedTags: ['javascript', 'react', 'angular', 'nodejs'],
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2024-08-20'),
    isPopular: false,
    isNew: true
  },
  'nextjs': {
    id: 'nextjs',
    name: 'Next.js',
    description: 'Framework React para aplicações web full-stack',
    color: '#000000',
    questionsCount: 189,
    slug: 'nextjs',
    relatedTags: ['react', 'typescript', 'vercel', 'ssr'],
    createdAt: new Date('2021-01-01'),
    updatedAt: new Date('2024-08-20'),
    isPopular: false,
    isNew: false
  },
  'css': {
    id: 'css',
    name: 'CSS',
    description: 'Linguagem de estilo para formatação de documentos HTML',
    color: '#1572B6',
    questionsCount: 678,
    slug: 'css',
    relatedTags: ['html', 'sass', 'tailwind', 'responsive'],
    createdAt: new Date('2019-01-01'),
    updatedAt: new Date('2024-08-20'),
    isPopular: false,
    isNew: false
  },
  'git': {
    id: 'git',
    name: 'Git',
    description: 'Sistema de controle de versão distribuído',
    color: '#F05032',
    questionsCount: 234,
    slug: 'git',
    relatedTags: ['github', 'version-control', 'collaboration', 'workflow'],
    createdAt: new Date('2019-01-01'),
    updatedAt: new Date('2024-08-20'),
    isPopular: false,
    isNew: false
  }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = tags[params.slug as keyof typeof tags]
  
  if (!tag) {
    return {
      title: 'Tag não encontrada - Fórum Acode Lab',
      description: 'A tag solicitada não foi encontrada.'
    }
  }

  return {
    title: `#${tag.name} - Fórum Acode Lab`,
    description: `${tag.description}. ${tag.questionsCount} perguntas relacionadas.`,
    keywords: `${tag.name.toLowerCase()}, programação, desenvolvimento, fórum, acode lab`,
    openGraph: {
      title: `#${tag.name} - Fórum Acode Lab`,
      description: `${tag.description}. ${tag.questionsCount} perguntas relacionadas.`,
      type: 'website',
    },
  }
}

// Exportar tags para uso no componente da página
export { tags }
