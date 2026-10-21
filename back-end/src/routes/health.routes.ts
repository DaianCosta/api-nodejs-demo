import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Health check da aplicação
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Aplicação saudável
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

export default router;
