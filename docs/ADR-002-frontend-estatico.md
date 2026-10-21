# ADR-002: Front-end estático servido pelo Express

## Contexto

Os requisitos pedem uma tela simples para consultar CEPs. A squad tem skill de front-end disponível, mas o escopo do front-end é mínimo: um campo de entrada, um botão e uma área de resultado.

## Decisão

Usar HTML/CSS/JS estáticos (sem framework SPA), servidos pelo próprio Express via `express.static` apontando para o diretório `front-end/`.

## Alternativas consideradas

1. **React/Vue SPA**: framework de SPA completo. Desproporcional para uma única tela sem navegação, estado complexo ou componentes reutilizáveis.
2. **Servidor separado para o front-end**: adicionar um segundo processo/porta. Desnecessário para arquivos estáticos simples.

## Consequências

- Sem build step para o front-end (não precisa de `npm run build` no front-end).
- Sem dependências adicionais no front-end (não há `package.json` no `front-end/`).
- O Express serve tudo: API (`/api/*`), Swagger (`/api-docs`) e front-end (`/`).
- O front-end faz `fetch` relativo para `/api/cep/:cep`, funcionando em qualquer host/porta.
