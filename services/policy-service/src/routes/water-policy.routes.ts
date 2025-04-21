import { Router } from 'express';
import { WaterPolicyController } from '../controllers/water-policy.controller';
import { validateRequest } from '../middleware/validate-request';
import { z } from 'zod';

const router = Router();
const controller = new WaterPolicyController();

// Base policy schema
const basePolicySchema = z.object({
  name: z.string(),
  period: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isActive: z.boolean(),
});

// Dynamic reference schemas
const slabRateSchema = z.object({
  categoryId: z.number(),
  startUnit: z.number(),
  endUnit: z.number().nullable(),
  rate: z.number(),
});

const bulkAgreementSchema = z.object({
  categoryId: z.number(),
  upToAgreedQuantity: z.number(),
  aboveAgreedQuantity: z.number(),
  minimumBill: z.number(),
});

const pipeSizeSchema = z.object({
  size: z.string(),
  rate: z.number(),
});

// Dynamic policy schema
const createPolicySchema = z.object({
  utilityId: z.number(),
  policyDefinitionId: z.number(),
  data: z.object({
    ...basePolicySchema.shape,
    slabRates: z.array(slabRateSchema).optional(),
    bulkAgreements: z.array(bulkAgreementSchema).optional(),
    pipeSizes: z.array(pipeSizeSchema).optional(),
  }),
});

const updatePolicySchema = createPolicySchema;



// Routes
router.get('/policy', controller.fetchPolicyDetails);
router.get('/', controller.getPolicies);
router.get('/current', controller.getCurrentPolicy);
router.get('/date', controller.getPolicyByDate);
router.get('/:id', controller.getPolicyById);
router.post('/', validateRequest(createPolicySchema), controller.createPolicy);
router.put('/:id', validateRequest(updatePolicySchema), controller.updatePolicy);
router.delete('/:id', controller.deletePolicy);

export default router; 