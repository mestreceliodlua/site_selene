# Diretrizes do Projeto NeuroEval

## Arquitetura & Código
- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript (estrito)
- **CSS**: Tailwind CSS v3
- **Estado**: Zustand (useStore pattern)
- **Componentes**: Componentes funcionais com "use client" onde necessário
- **Padrão**: Componentes puros, hooks separados, nenhum `any` desnecessário

## Padrões de Arquivo
- **Imports**: Caminhos absolutos `@/...` ou relativos `../...`, nunca camulos profundos
- **Componentes**: `"use client"` no topo quando usarem hooks/state
- **Tailwind**: Classes `bg-selene`, `text-gold`, `border-gold`, cores `#0a0e27`, `#D4AF37`, `#6B4C9A`
- **Estrutura de Página**: `metadata` no topo, layout consistente com Header/Footer em `app/layout.tsx`

## Regras de API Routes
- **POST /api/avaliacao**: Recebe dados do formulário, valida e retorna `{ success: true }`
- **POST /api/mentiva**: Recebe `sessionStorage.getItem('mentiva_data')`, chama provedora de IA, retorna `{ texto: "..." }`
- **Segurança**: Todas as API routes validam entrada, nenhum segredo no código cliente

## Regras de Commit
- Padrão Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`
- Commits devem ser significativos: `feat: add mentiva flow`, `fix: resolve build error`
- Não commitar arquivos `.env.local` ou chaves de API

## Convenções de Código
- Funções devem ter JSDoc quando não são autoexplicativas
- Todos os componentes de formulário devem ter validação de campos obrigatórios
- `sessionStorage` deve ser limpo em `handleReset`
- Componentes de formulário devem ser reutilizáveis e acessíveis

## Tecnologias Proibidas
- `react-icons` (carece de configuração adicional, usar SVG inline ou classes Tailwind)
- `redux` (usar Zustand ao invés)
- `any` type em TypeScript (usar tipos específicos)

---

### Regras de IA (OpenCode)
- Sempre respeitar a arquitetura existente do projeto
- Não reescrever componentes funcionais para classes
- Manter compatibilidade com Tailwind v3 configurado
- Seguir o padrão de `sessionStorage` para fluxo Mentiva
- API Routes devem validar dados antes de processar