import { Router } from 'express';
import { getCep } from '../controllers/cep.controller';

const router = Router();

/**
 * @openapi
 * /api/cep/{cep}:
 *   get:
 *     summary: Consulta endereço a partir de um CEP
 *     tags:
 *       - CEP
 *     parameters:
 *       - in: path
 *         name: cep
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\d{8}$'
 *         description: CEP com exatamente 8 dígitos numéricos (ex. 01001000)
 *     responses:
 *       200:
 *         description: CEP encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       400:
 *         description: Formato de CEP inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: CEP não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno ao consultar o serviço externo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:cep', getCep);

export default router;
