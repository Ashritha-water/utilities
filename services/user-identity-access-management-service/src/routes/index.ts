import { Router, Request, Response } from 'express';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'user identity access management service' });
});

// Example endpoint
router.get('/example', (req: Request, res: Response) => {
  res.json({ message: 'This is an example endpoint for user identity access management service.' });
});

export default router;
