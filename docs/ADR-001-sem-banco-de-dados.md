# ADR-001: Sem banco de dados

## Contexto

Os requisitos definem que a API consulta um serviço externo (ViaCEP) para obter dados de endereço. O documento de requisitos lista explicitamente "Persistência em banco de dados" como fora de escopo.

## Decisão

Não utilizar banco de dados. Todas as consultas são feitas em tempo real ao serviço ViaCEP e os dados são retornados diretamente ao cliente sem armazenamento.

## Alternativas consideradas

1. **PostgreSQL para cache**: armazenar CEPs consultados para reduzir chamadas ao ViaCEP. Descartado porque cache está explicitamente fora de escopo.
2. **Cache em memória**: manter um `Map` em memória com TTL. Descartado pelo mesmo motivo.

## Consequências

- Simplicidade: sem migrations, sem `DATABASE_URL`, sem dependência de infraestrutura além do Node.js.
- Cada consulta faz uma requisição HTTP ao ViaCEP (latência depende do serviço externo).
- Se o ViaCEP estiver indisponível, a API retorna 500.
