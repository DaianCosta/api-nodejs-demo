import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Consulta de CEP',
      version: '1.0.0',
      description:
        'API REST para consulta de endereço a partir de um CEP brasileiro via ViaCEP.',
    },
    components: {
      schemas: {
        Address: {
          type: 'object',
          properties: {
            cep: { type: 'string', example: '01001-000' },
            logradouro: { type: 'string', example: 'Praça da Sé' },
            complemento: { type: 'string', example: 'lado ímpar' },
            bairro: { type: 'string', example: 'Sé' },
            cidade: { type: 'string', example: 'São Paulo' },
            estado: { type: 'string', example: 'SP' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'CEP não encontrado' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
