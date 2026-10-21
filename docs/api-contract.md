# Contrato da API — API de Consulta de CEP

Base URL: `http://localhost:3000`

## Formato de erro padrão

```json
{
  "error": "Mensagem descritiva do erro"
}
```

---

## Endpoints

### GET /api/cep/:cep

Consulta um endereço a partir de um CEP brasileiro.

**Parâmetros de rota:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `cep` | `string` | Sim | CEP com exatamente 8 dígitos numéricos (ex.: `01001000`) |

**Respostas:**

#### 200 OK

CEP encontrado com sucesso.

```json
{
  "cep": "01001-000",
  "logradouro": "Praça da Sé",
  "complemento": "lado ímpar",
  "bairro": "Sé",
  "cidade": "São Paulo",
  "estado": "SP"
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `cep` | `string` | CEP formatado (XXXXX-XXX) |
| `logradouro` | `string` | Nome da rua/avenida/praça |
| `complemento` | `string` | Complemento (pode ser string vazia) |
| `bairro` | `string` | Nome do bairro |
| `cidade` | `string` | Nome da cidade |
| `estado` | `string` | Sigla do estado (UF, 2 caracteres) |

#### 400 Bad Request

CEP com formato inválido.

```json
{
  "error": "CEP deve conter exatamente 8 dígitos numéricos"
}
```

#### 404 Not Found

CEP com formato válido mas não encontrado na base dos Correios.

```json
{
  "error": "CEP não encontrado"
}
```

#### 500 Internal Server Error

Erro ao comunicar com o serviço externo ViaCEP.

```json
{
  "error": "Erro interno ao consultar o CEP"
}
```

---

### GET /api/health

Health check da aplicação.

**Respostas:**

#### 200 OK

```json
{
  "status": "ok"
}
```

---

### GET /api-docs

Interface Swagger UI com a documentação OpenAPI da API.

**Respostas:**

#### 200 OK

Retorna a página HTML do Swagger UI (gerada por `swagger-ui-express`).

---

### GET /

Serve o front-end estático (página de consulta de CEP).

**Respostas:**

#### 200 OK

Retorna o `index.html` do diretório `front-end/`.
