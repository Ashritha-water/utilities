import { Router, Request, Response } from 'express';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'audit logging compliance service' });
});

// Example endpoint
router.get('/example', (req: Request, res: Response) => {
  res.json({ message: 'This is an example endpoint for audit logging compliance service.' });
});

export default router;
