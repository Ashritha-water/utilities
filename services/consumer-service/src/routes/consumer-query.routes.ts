import { Router } from 'express';
import { ConsumerQueryController } from '../controllers/consumer-query.controller';

const router = Router();
const consumerQueryController = new ConsumerQueryController();

// Pipe size routes
router.get('/by-pipe-size', consumerQueryController.getConsumersByPipeSize.bind(consumerQueryController));
router.get('/by-category/:categoryId', consumerQueryController.getConsumersByCategory.bind(consumerQueryController));
router.get('/by-hierarchy', consumerQueryController.getConsumersByHierarchy.bind(consumerQueryController));
router.get('/hierarchy-stats', consumerQueryController.getHierarchyStats.bind(consumerQueryController));

// Combined queries
router.get('/by-pipe-size-and-category', consumerQueryController.getConsumersByPipeSizeAndCategory.bind(consumerQueryController));

export default router;
