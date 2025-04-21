import { Router } from 'express';
import attributeTemplateController from '../controllers/attribute-template.controller';

const router = Router();

// Create a new template
router.post('/', attributeTemplateController.createTemplate);

// Get templates by type
router.get('/:utilityId/:applicableTo', attributeTemplateController.getTemplatesByType);

// Generate dynamic form
router.get('/:utilityId/:applicableTo/form', attributeTemplateController.generateDynamicForm);

// Get template by ID
router.get('/:templateId', attributeTemplateController.getTemplateById);

// Update template
router.put('/:templateId', attributeTemplateController.updateTemplate);

// Delete template
router.delete('/:templateId', attributeTemplateController.deleteTemplate);

// Bulk create templates
router.post('/bulk', attributeTemplateController.bulkCreateTemplates);

// Validate template data
router.post('/:templateId/validate', attributeTemplateController.validateTemplateData);

// Get all templates for a utility
router.get('/utility/:utilityId', attributeTemplateController.getTemplatesByUtility);

// Create sample templates
router.post('/samples', attributeTemplateController.createSampleTemplates);

export default router;