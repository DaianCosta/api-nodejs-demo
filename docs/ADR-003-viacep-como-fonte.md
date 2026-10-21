# ADR-003: ViaCEP como serviço externo de consulta

## Contexto

A API precisa buscar dados de endereço a partir de um CEP. Os requisitos mencionam o ViaCEP como exemplo de serviço externo público.

## Decisão

Usar a API pública do ViaCEP (`https://viacep.com.br/ws/{cep}/json/`) como fonte dos dados de endereço. A chamada é feita com `fetch` nativo do Node.js 18+.

## Alternativas consideradas

1. **Base própria de CEPs**: manter os dados localmente. Fora de escopo e exigiria banco de dados + atualizações periódicas.
2. **Outra API pública (BrasilAPI, etc.)**: viável, mas o ViaCEP é o mais citado, estável e sem necessidade de autenticação.
3. **Biblioteca HTTP (axios)**: descartada em favor do `fetch` nativo disponível no Node.js 18+, evitando dependência extra.

## Consequências

- Dependência de disponibilidade do ViaCEP (mitigada com tratamento de erro 500).
- Sem necessidade de API key ou autenticação.
- O campo `erro: true` na resposta do ViaCEP indica CEP não encontrado (tratado como 404).
- Os campos da resposta do ViaCEP (`localidade`, `uf`) são mapeados para nomes mais claros (`cidade`, `estado`) no modelo interno.
