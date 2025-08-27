"use client"

import React from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Code, 
  Github, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Mail,
  MessageSquare,
  Users,
  Briefcase,
  Heart
} from 'lucide-react'

/**
 * Componente Footer com links de navegação, redes sociais e informações da empresa
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { label: 'Fórum Q&A', href: '/forum' },
      { label: 'Rede Social', href: '/network' },
      { label: 'Marketplace', href: '/freelancer' },
      { label: 'Documentação', href: '/docs' },
      { label: 'API', href: '/api' }
    ],
    company: [
      { label: 'Sobre Nós', href: '/about' },
      { label: 'Carreiras', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Imprensa', href: '/press' },
      { label: 'Parcerias', href: '/partners' }
    ],
    support: [
      { label: 'Central de Ajuda', href: '/help' },
      { label: 'Comunidade', href: '/community' },
      { label: 'Status', href: '/status' },
      { label: 'Contato', href: '/contact' },
      { label: 'Reportar Bug', href: '/bug-report' }
    ],
    legal: [
      { label: 'Termos de Uso', href: '/terms' },
      { label: 'Política de Privacidade', href: '/privacy' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'Licenças', href: '/licenses' },
      { label: 'Segurança', href: '/security' }
    ]
  }

  const socialLinks = [
    { icon: Github, href: 'https://github.com/acodelab', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com/acodelab', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/acodelab', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://youtube.com/acodelab', label: 'YouTube' },
    { icon: Mail, href: 'mailto:contato@acodelab.com', label: 'Email' }
  ]

  const stats = [
    { icon: Users, value: '50K+', label: 'Desenvolvedores' },
    { icon: MessageSquare, value: '100K+', label: 'Discussões' },
    { icon: Briefcase, value: '10K+', label: 'Projetos' },
    { icon: Heart, value: '99%', label: 'Satisfação' }
  ]

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Code className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">Acode Lab</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              A plataforma completa para desenvolvedores: fórum, rede social e marketplace freelancer. 
              Conecte-se, aprenda e cresça sua carreira.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-background border hover:bg-accent hover:scale-110 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Produto</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Empresa</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Suporte</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-card rounded-2xl p-8 mb-12 border">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">
              Acode Lab em Números
            </h3>
            <p className="text-muted-foreground">
              Nossa comunidade cresce a cada dia
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-8 mb-12 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">
            Fique por dentro das novidades
          </h3>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            Receba atualizações sobre novos recursos, projetos em destaque e oportunidades de carreira.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu email"
              className="flex-1 px-4 py-3 rounded-lg text-foreground border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button variant="secondary" size="lg">
              Inscrever-se
            </Button>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>© {currentYear} Acode Lab. Todos os direitos reservados.</span>
              <Badge variant="outline" className="text-xs">
                v1.0.0
              </Badge>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Feito com ❤️ no Brasil</span>
              <Link href="/status" className="hover:text-foreground transition-colors">
                Status do Sistema
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}




