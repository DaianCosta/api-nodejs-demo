# Modelo de dados — API de Consulta de CEP

## Sem banco de dados

Esta aplicação **não utiliza banco de dados**. Os dados de endereço são obtidos em tempo real do serviço público ViaCEP (`https://viacep.com.br/ws/{cep}/json/`) e retornados diretamente ao cliente sem armazenamento.

A decisão está documentada em `decisions/ADR-001-sem-banco-de-dados.md`.
