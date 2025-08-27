# 🎨 Copper Design System - ACode Lab

## Paleta de Cores Premium

O ACode Lab agora apresenta um **sistema de design sofisticado** baseado na paleta de **cobre, preto e branco**, inspirado em interfaces premium e luxuosas de tecnologia.

### 🏆 Características do Design

- **Elegância Premium**: Tons metálicos de cobre combinados com neutros sofisticados
- **Duplo Modo**: Suporte completo para temas claro e escuro
- **Tipografia Refinada**: Combinação de Inter (interface) e Playfair Display (títulos)
- **Animações Fluidas**: Transições suaves e efeitos de hover premium
- **Acessibilidade**: Contraste otimizado e foco visível

## 🎯 Paleta de Cores

### Tons de Cobre (Primários)
```css
--copper-50: #fef7f0   /* Cobre muito claro */
--copper-100: #feeee0  /* Cobre claro */
--copper-200: #fcd4b6  /* Cobre suave */
--copper-300: #f9b885  /* Cobre médio claro */
--copper-400: #f59e4c  /* Cobre ativo */
--copper-500: #dc7633  /* Cobre principal */
--copper-600: #c0622d  /* Cobre escuro */
--copper-700: #a14d24  /* Cobre profundo */
--copper-800: #83401e  /* Cobre muito escuro */
--copper-900: #6d341a  /* Cobre intenso */
--copper-950: #3b1a0c  /* Cobre máximo */
```

### Tons Neutros (Secundários)
```css
--neutral-0: #ffffff    /* Branco puro */
--neutral-50: #fafafa   /* Branco off */
--neutral-100: #f5f5f5  /* Cinza muito claro */
--neutral-200: #e5e5e5  /* Cinza claro */
--neutral-300: #d4d4d4  /* Cinza médio claro */
--neutral-400: #a3a3a3  /* Cinza médio */
--neutral-500: #737373  /* Cinza escuro */
--neutral-600: #525252  /* Cinza muito escuro */
--neutral-700: #404040  /* Quase preto */
--neutral-800: #262626  /* Preto suave */
--neutral-900: #171717  /* Preto profundo */
--neutral-950: #0a0a0a  /* Preto puro */
```

## 🎨 Aplicação da Regra 60-30-10

### Modo Claro
- **60%**: Branco e tons neutros claros (fundo)
- **30%**: Preto e cinzas escuros (texto)
- **10%**: Cobre (acentos e CTAs)

### Modo Escuro
- **60%**: Preto e tons neutros escuros (fundo)
- **30%**: Branco e cinzas claros (texto)
- **10%**: Cobre mais claro (acentos e CTAs)

## 🛠️ Componentes Premium

### CopperButton
```tsx
<CopperButton variant="primary" size="lg">
  Botão Premium
</CopperButton>

<CopperButton variant="outline">
  Contorno Elegante
</CopperButton>

<CopperButton variant="ghost">
  Fantasma Sutil
</CopperButton>
```

### CopperCard
```tsx
<CopperCard variant="premium" className="p-6">
  Card com gradiente sutil
</CopperCard>

<CopperCard variant="elegant">
  Card escuro sofisticado
</CopperCard>
```

### CopperGradientText
```tsx
<CopperGradientText className="text-2xl font-bold">
  Texto com Gradiente de Cobre
</CopperGradientText>
```

## ✨ Gradientes Premium

```css
/* Gradiente principal de cobre */
--gradient-copper: linear-gradient(135deg, #dc7633 0%, #f59e4c 50%, #fcd4b6 100%);

/* Gradiente escuro elegante */
--gradient-elegant: linear-gradient(135deg, #171717 0%, #404040 50%, #dc7633 100%);

/* Gradiente premium completo */
--gradient-premium: linear-gradient(135deg, #0a0a0a 0%, #262626 25%, #dc7633 75%, #f59e4c 100%);
```

## 🎭 Tipografia

### Fontes
- **Interface**: Inter (clean e legível)
- **Display**: Playfair Display (elegante e sofisticado)
- **Monospace**: JetBrains Mono (código)

### Classes Especiais
```css
.heading-display     /* Títulos principais com Playfair */
.heading-elegant     /* Títulos com gradiente de cobre */
.text-copper-gradient /* Texto com gradiente */
```

## 🌊 Animações e Efeitos

### Classes de Animação
```css
.animate-slide-up    /* Desliza de baixo para cima */
.animate-fade-scale  /* Fade com escala */
.shimmer            /* Efeito shimmer de carregamento */
.hover-lift         /* Elevação no hover */
.hover-glow         /* Brilho de cobre no hover */
```

### Sombras Premium
```css
--shadow-copper     /* Sombra com tom de cobre */
--shadow-copper-lg  /* Sombra grande de cobre */
--shadow-elegant    /* Sombra escura elegante */
--shadow-premium    /* Sombra premium sutil */
```

## 🎯 Estados de Modo

### Modo Claro
- Fundo branco/neutro claro
- Texto preto/cinza escuro
- Acentos em cobre médio
- Sombras sutis

### Modo Escuro
- Fundo preto/neutro escuro
- Texto branco/cinza claro
- Acentos em cobre claro
- Sombras intensas

## 🔧 Implementação

### 1. Provider de Tema
```tsx
import { CopperThemeProvider } from '@/lib/copper-theme'

<CopperThemeProvider>
  <App />
</CopperThemeProvider>
```

### 2. Hook de Tema
```tsx
import { useCopperTheme } from '@/lib/copper-theme'

const { mode, toggleMode, theme } = useCopperTheme()
```

### 3. CSS Classes
```tsx
<div className="copper-theme light"> {/* ou dark */}
  <div className="card-premium">
    <button className="btn-copper">
      Click me
    </button>
  </div>
</div>
```

## 📱 Responsividade

O design é **mobile-first** com breakpoints otimizados:
- Navegação adaptável
- Cards responsivos
- Tipografia escalável
- Touch-friendly (44px mínimo)

## ♿ Acessibilidade

- **Contraste**: WCAG AA compliant
- **Foco**: Indicadores visíveis com outline de cobre
- **Navegação**: Suporte completo ao teclado
- **Screen readers**: Semantica HTML adequada

## 🎨 Inspiração

O design foi inspirado em:
- Interfaces premium de tecnologia
- Design systems de luxo
- Tons metálicos sofisticados
- Minimalismo elegante
- Experiências digitais premium

## 🚀 Próximos Passos

1. **Componentes Avançados**: Criação de mais componentes premium
2. **Micro-animações**: Adição de mais efeitos sutis
3. **Temas Customizáveis**: Sistema de criação de temas próprios
4. **Design Tokens**: Exportação para outras plataformas
5. **Documentação Interativa**: Storybook com todos os componentes

---

**O Copper Design System representa uma evolução na experiência visual do ACode Lab, oferecendo sofisticação, elegância e performance em uma interface verdadeiramente premium.** ✨