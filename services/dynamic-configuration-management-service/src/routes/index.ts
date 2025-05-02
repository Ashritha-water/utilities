import { Router, Request, Response } from 'express';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'dynamic configuration management service' });
});

// Example endpoint
router.get('/example', (req: Request, res: Response) => {
  res.json({ message: 'This is an example endpoint for dynamic configuration management service.' });
});

export default router;
