"use client"

import React, { useState } from 'react'
import { useTheme, useThemeBuilder, DEFAULT_THEMES, CustomTheme } from '@/lib/theme-engine'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { 
  Palette, 
  Layout, 
  Type, 
  Sparkles, 
  Download, 
  Upload, 
  Save, 
  Eye,
  Trash2,
  Copy,
  Share,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'

export const ThemeCustomizer: React.FC = () => {
  const { 
    currentTheme, 
    preferences, 
    updateTheme, 
    updatePreferences,
    exportTheme,
    importTheme,
    deleteCustomTheme
  } = useTheme()
  
  const { 
    builderTheme, 
    updateBuilderTheme, 
    saveTheme, 
    loadTemplate 
  } = useThemeBuilder()

  const [activeTab, setActiveTab] = useState('colors')
  const [previewMode, setPreviewMode] = useState(false)
  const [importData, setImportData] = useState('')

  const allThemes = {
    ...DEFAULT_THEMES,
    ...Object.fromEntries(preferences.customThemes.map(t => [t.id, t]))
  }

  const handleColorChange = (colorKey: string, value: string) => {
    updateBuilderTheme('colors', { [colorKey]: value })
  }

  const handleExport = async (themeId: string) => {
    try {
      const exported = exportTheme(themeId)
      await navigator.clipboard.writeText(exported)
      // Show success toast
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const handleImport = () => {
    if (importTheme(importData)) {
      setImportData('')
      // Show success toast
    } else {
      // Show error toast
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Personalização de Tema</h1>
          <p className="text-muted-foreground">
            Customize a aparência da plataforma do seu jeito
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={previewMode ? "default" : "outline"}
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Sair da Visualização' : 'Visualizar'}
          </Button>
          
          <Button onClick={saveTheme}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Tema
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Theme Selector & Settings */}
        <div className="lg:col-span-1 space-y-6">
          {/* Current Theme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Tema Atual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {Object.values(allThemes).map(theme => (
                  <div
                    key={theme.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      currentTheme.id === theme.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => updateTheme(theme.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{theme.name}</span>
                      {theme.type === 'dark' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                    </div>
                    
                    <div className="flex space-x-1">
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Auto Switch */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="w-5 h-5 mr-2" />
                Automação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-switch">Alternar Automaticamente</Label>
                <Switch
                  id="auto-switch"
                  checked={preferences.autoSwitch}
                  onCheckedChange={(checked) => 
                    updatePreferences({ autoSwitch: checked })
                  }
                />
              </div>
              
              {preferences.autoSwitch && (
                <div className="space-y-2">
                  <div>
                    <Label>Tema Claro (início)</Label>
                    <Input
                      type="time"
                      value={preferences.autoSwitchTimes.lightStart}
                      onChange={(e) => updatePreferences({
                        autoSwitchTimes: {
                          ...preferences.autoSwitchTimes,
                          lightStart: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Tema Escuro (início)</Label>
                    <Input
                      type="time"
                      value={preferences.autoSwitchTimes.darkStart}
                      onChange={(e) => updatePreferences({
                        autoSwitchTimes: {
                          ...preferences.autoSwitchTimes,
                          darkStart: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Import/Export */}
          <Card>
            <CardHeader>
              <CardTitle>Compartilhar Temas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Importar Tema</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Cole o código do tema aqui..."
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                  />
                  <Button onClick={handleImport} disabled={!importData}>
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={() => handleExport(currentTheme.id)}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Tema Atual
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Theme Builder */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Construtor de Tema
              </CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  value={builderTheme.name}
                  onChange={(e) => updateBuilderTheme('name', e.target.value)}
                  placeholder="Nome do tema..."
                  className="max-w-xs"
                />
                                <Select
                  value={builderTheme.type}
                  onValueChange={(value: 'light' | 'dark' | 'auto') => updateBuilderTheme('type', value)}
                >
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="auto">Automático</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="colors">Cores</TabsTrigger>
                  <TabsTrigger value="typography">Tipografia</TabsTrigger>
                  <TabsTrigger value="effects">Efeitos</TabsTrigger>
                  <TabsTrigger value="layout">Layout</TabsTrigger>
                </TabsList>

                <TabsContent value="colors" className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(builderTheme.colors).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label className="capitalize">{key}</Label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={value}
                            onChange={(e) => handleColorChange(key, e.target.value)}
                            className="w-12 h-10 border rounded"
                          />
                          <Input
                            value={value}
                            onChange={(e) => handleColorChange(key, e.target.value)}
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Templates Rápidos</h4>
                    <div className="flex gap-2 flex-wrap">
                      {Object.entries(DEFAULT_THEMES).map(([id, theme]) => (
                        <Button
                          key={id}
                          variant="outline"
                          size="sm"
                          onClick={() => loadTemplate(id)}
                        >
                          {theme.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="typography" className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label>Família da Fonte</Label>
                      <Select
                        value={builderTheme.typography.fontFamily}
                        onValueChange={(value) => 
                          updateBuilderTheme('typography', { fontFamily: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Poppins">Poppins</SelectItem>
                          <SelectItem value="JetBrains Mono">JetBrains Mono</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Tamanho da Fonte</Label>
                      <Select
                        value={builderTheme.typography.fontSize}
                        onValueChange={(value: 'small' | 'medium' | 'large') => 
                          updateBuilderTheme('typography', { fontSize: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Pequeno</SelectItem>
                          <SelectItem value="medium">Médio</SelectItem>
                          <SelectItem value="large">Grande</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Peso da Fonte</Label>
                      <Select
                        value={builderTheme.typography.fontWeight}
                        onValueChange={(value: 'light' | 'normal' | 'medium' | 'bold') => 
                          updateBuilderTheme('typography', { fontWeight: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Leve</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="medium">Médio</SelectItem>
                          <SelectItem value="bold">Negrito</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="effects" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Desfoque (Blur)</Label>
                      <Switch
                        checked={builderTheme.effects.blur}
                        onCheckedChange={(checked) => 
                          updateBuilderTheme('effects', { blur: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Animações</Label>
                      <Switch
                        checked={builderTheme.effects.animations}
                        onCheckedChange={(checked) => 
                          updateBuilderTheme('effects', { animations: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Sombras</Label>
                      <Switch
                        checked={builderTheme.effects.shadows}
                        onCheckedChange={(checked) => 
                          updateBuilderTheme('effects', { shadows: checked })
                        }
                      />
                    </div>

                    <div>
                      <Label>Raio da Borda</Label>
                      <Select
                        value={builderTheme.effects.borderRadius}
                        onValueChange={(value: 'none' | 'small' | 'medium' | 'large') => 
                          updateBuilderTheme('effects', { borderRadius: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Nenhum</SelectItem>
                          <SelectItem value="small">Pequeno</SelectItem>
                          <SelectItem value="medium">Médio</SelectItem>
                          <SelectItem value="large">Grande</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="layout" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Densidade</Label>
                      <Select
                        value={builderTheme.layout.density}
                        onValueChange={(value: 'compact' | 'comfortable' | 'spacious') => 
                          updateBuilderTheme('layout', { density: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compact">Compacto</SelectItem>
                          <SelectItem value="comfortable">Confortável</SelectItem>
                          <SelectItem value="spacious">Espaçoso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Sidebar</Label>
                      <Select
                        value={builderTheme.layout.sidebar}
                        onValueChange={(value: 'collapsed' | 'expanded' | 'auto') => 
                          updateBuilderTheme('layout', { sidebar: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="collapsed">Recolhida</SelectItem>
                          <SelectItem value="expanded">Expandida</SelectItem>
                          <SelectItem value="auto">Automática</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Estilo do Header</Label>
                      <Select
                        value={builderTheme.layout.headerStyle}
                        onValueChange={(value: 'floating' | 'sticky' | 'static') => 
                          updateBuilderTheme('layout', { headerStyle: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="floating">Flutuante</SelectItem>
                          <SelectItem value="sticky">Fixo</SelectItem>
                          <SelectItem value="static">Estático</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Theme Preview */}
      {previewMode && (
        <Card>
          <CardHeader>
            <CardTitle>Visualização do Tema</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="p-6 rounded-lg border"
              style={{
                backgroundColor: builderTheme.colors.background,
                color: builderTheme.colors.text,
                fontFamily: builderTheme.typography.fontFamily
              }}
            >
              <div className="space-y-4">
                <h3 
                  className="text-lg font-semibold"
                  style={{ color: builderTheme.colors.primary }}
                >
                  Exemplo de Título
                </h3>
                
                <p style={{ color: builderTheme.colors.textSecondary }}>
                  Este é um exemplo de como o tema ficará. Você pode ver as cores,
                  tipografia e estilos aplicados em tempo real.
                </p>
                
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 rounded"
                    style={{ 
                      backgroundColor: builderTheme.colors.primary,
                      color: 'white'
                    }}
                  >
                    Botão Primário
                  </button>
                  
                  <button
                    className="px-4 py-2 rounded border"
                    style={{ 
                      borderColor: builderTheme.colors.border,
                      color: builderTheme.colors.text
                    }}
                  >
                    Botão Secundário
                  </button>
                </div>
                
                <div 
                  className="p-4 rounded"
                  style={{ backgroundColor: builderTheme.colors.surface }}
                >
                  <p style={{ color: builderTheme.colors.text }}>
                    Exemplo de card ou container
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom Themes Management */}
      {preferences.customThemes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Meus Temas Personalizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {preferences.customThemes.map(theme => (
                <div
                  key={theme.id}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{theme.name}</h4>
                    <Badge variant={theme.type === 'dark' ? 'secondary' : 'default'}>
                      {theme.type}
                    </Badge>
                  </div>
                  
                  <div className="flex space-x-1">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateTheme(theme.id)}
                    >
                      Usar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExport(theme.id)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteCustomTheme(theme.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}