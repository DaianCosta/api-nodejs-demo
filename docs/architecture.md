# Arquitetura — API de Consulta de CEP

## Visão geral

Aplicação composta por uma API REST (Node.js + Express + TypeScript) que consulta o serviço público ViaCEP para obter dados de endereço a partir de um CEP, e um front-end simples (HTML/CSS/JS servido pelo próprio Express) para consulta pelo navegador.

Não há banco de dados: os dados vêm exclusivamente do serviço externo ViaCEP e não são armazenados.

## Componentes

### Back-end (`back-end/`)

| Componente | Arquivo(s) | Responsabilidade |
|---|---|---|
| **App (bootstrap)** | `src/app.ts` | Cria o Express app, registra middlewares (JSON, CORS, Swagger, rotas, static) |
| **Server** | `src/server.ts` | Ponto de entrada: lê `PORT` e inicia o `app.listen` |
| **CEP Router** | `src/routes/cep.routes.ts` | Define `GET /api/cep/:cep` |
| **Health Router** | `src/routes/health.routes.ts` | Define `GET /api/health` |
| **CEP Controller** | `src/controllers/cep.controller.ts` | Valida o formato do CEP, chama o service, formata a resposta |
| **CEP Service** | `src/services/cep.service.ts` | Chama a API ViaCEP via `fetch`, mapeia a resposta para o modelo interno |
| **CEP Model** | `src/models/cep.model.ts` | Interface `Address` com os campos do contrato |
| **Error Handler** | `src/middlewares/error.middleware.ts` | Middleware de erro centralizado |
| **Swagger** | `src/swagger.ts` | Configuração do `swagger-jsdoc` + `swagger-ui-express`, servido em `/api-docs` |

### Front-end (`front-end/`)

| Componente | Arquivo(s) | Responsabilidade |
|---|---|---|
| **Página de consulta** | `index.html`, `css/style.css`, `js/app.js` | Campo de CEP, botão de busca, exibição do resultado ou erro |

O front-end é HTML estático servido pelo Express (via `express.static`). Não há framework de SPA: é uma página simples com `fetch` para a API.

## Fluxo principal: consulta de CEP

```
Usuário → Front-end (fetch /api/cep/01001000)
         → CEP Router → CEP Controller (valida formato)
           → CEP Service (GET https://viacep.com.br/ws/01001000/json/)
           ← mapeia resposta → Controller formata JSON → 200 + Address
         ← Front-end exibe o endereço
```

## Fluxo de erro: CEP inválido

```
Usuário → Front-end (fetch /api/cep/123)
         → CEP Controller → formato inválido → 400 { error: "CEP deve conter exatamente 8 dígitos numéricos" }
         ← Front-end exibe a mensagem de erro
```

## Fluxo de erro: CEP não encontrado

```
Usuário → Front-end (fetch /api/cep/00000000)
         → CEP Controller → CEP Service → ViaCEP retorna { erro: true }
           → Controller → 404 { error: "CEP não encontrado" }
         ← Front-end exibe a mensagem de erro
```

## Mapeamento AC → componentes

| AC | Componente(s) |
|---|---|
| AC-1 | CEP Router, CEP Controller, CEP Service, CEP Model |
| AC-2 | CEP Controller (validação de formato) |
| AC-3 | CEP Service (detecção de `erro: true`), CEP Controller |
| AC-4 | Swagger (`src/swagger.ts`, anotações JSDoc nas rotas) |
| AC-5 | Health Router |
| AC-6 | Front-end (`index.html`, `js/app.js`) |
| AC-7 | Front-end (`js/app.js` — tratamento de respostas de erro) |

## Front-end

**Required.** Uma página HTML estática com campo de entrada, botão e área de resultado. Servida por `express.static` apontando para `front-end/`. Sem framework, sem build step.

## Variáveis de ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `PORT` | Porta do servidor Express | `3000` |

## Como rodar

### Instalar dependências

```bash
cd back-end && npm install
```

### Rodar em desenvolvimento

```bash
cd back-end && npm run dev
```

### Build

```bash
cd back-end && npm run build
```

### Testes

```bash
cd back-end && npm test
```

### Type check

```bash
cd back-end && npx tsc --noEmit
```

### Lint

```bash
cd back-end && npx eslint src/
```

### Iniciar o sistema

```bash
cd back-end && npm start
```

A API fica em `http://localhost:3000`, a documentação Swagger em `http://localhost:3000/api-docs` e o front-end em `http://localhost:3000/`.

## Plano de implementação

### Back-end (`back-end/`)

Ordem sugerida:

1. Inicializar o projeto (`package.json`, `tsconfig.json`, dependências)
2. Criar `src/models/cep.model.ts` — interface `Address`
3. Criar `src/services/cep.service.ts` — integração com ViaCEP
4. Criar `src/controllers/cep.controller.ts` — validação e orquestração
5. Criar `src/routes/cep.routes.ts` e `src/routes/health.routes.ts`
6. Criar `src/middlewares/error.middleware.ts`
7. Criar `src/swagger.ts` — configuração Swagger com anotações JSDoc
8. Criar `src/app.ts` — bootstrap do Express (JSON, CORS, Swagger, rotas, static para `../front-end`)
9. Criar `src/server.ts` — ponto de entrada
10. Criar testes: `src/__tests__/cep.test.ts` (unitários do controller/service com mock do fetch + integração via supertest)

### Front-end (`front-end/`)

1. Criar `index.html` — estrutura da página com campo, botão e área de resultado
2. Criar `css/style.css` — estilo básico responsivo
3. Criar `js/app.js` — lógica de fetch para `/api/cep/:cep`, exibição de resultado e tratamento de erros
