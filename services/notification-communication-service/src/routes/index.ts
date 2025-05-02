import { Router, Request, Response } from 'express';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'notification communication service' });
});

// Example endpoint
router.get('/example', (req: Request, res: Response) => {
  res.json({ message: 'This is an example endpoint for notification communication service.' });
});

export default router;
