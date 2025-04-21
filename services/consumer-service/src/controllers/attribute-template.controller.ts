import { Request, Response } from 'express';
import attributeTemplateService from '../services/attribute-template.service';

class AttributeTemplateController {
  async createTemplate(req: Request, res: Response) {
    try {
      const template = await attributeTemplateService.createTemplate(req.body);
      res.status(201).json(template);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTemplatesByType(req: Request, res: Response) {
    try {
      const { utilityId, applicableTo } = req.params;
      const templates = await attributeTemplateService.getTemplatesByType(utilityId, applicableTo);
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async generateDynamicForm(req: Request, res: Response) {
    try {
      const { utilityId, applicableTo } = req.params;
      const form = await attributeTemplateService.generateDynamicForm(utilityId, applicableTo);
      res.json(form);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createSampleTemplates(req: Request, res: Response) {
    try {
      const { utilityId } = req.body;
      
      const consumerTemplates = [
        {
          attributeName: 'Full Name',
          datatype: 'string',
          applicableTo: 'consumer',
          isRequired: true,
          validationRules: {
            pattern: '^[a-zA-Z ]{2,50}$'
          },
          description: 'Consumer\'s full name',
          utilityId
        },
        {
          attributeName: 'Age',
          datatype: 'number',
          applicableTo: 'consumer',
          isRequired: true,
          validationRules: {
            min: 18,
            max: 120
          },
          description: 'Consumer\'s age',
          utilityId
        },
        {
          attributeName: 'Email',
          datatype: 'email',
          applicableTo: 'consumer',
          isRequired: true,
          description: 'Consumer\'s email address',
          utilityId
        },
        {
          attributeName: 'Phone',
          datatype: 'phone',
          applicableTo: 'consumer',
          isRequired: true,
          validationRules: {
            pattern: '^[0-9]{10}$'
          },
          description: 'Consumer\'s phone number',
          utilityId
        },
        {
          attributeName: 'Consumer Type',
          datatype: 'select',
          applicableTo: 'consumer',
          isRequired: true,
          validationRules: {
            options: ['Residential', 'Commercial', 'Industrial']
          },
          description: 'Type of consumer',
          utilityId
        }
      ];

      const connectionTemplates = [
        {
          attributeName: 'Connection Size',
          datatype: 'select',
          applicableTo: 'connection',
          isRequired: true,
          validationRules: {
            options: ['1/2 inch', '3/4 inch', '1 inch', '1.5 inch', '2 inch']
          },
          description: 'Size of the connection pipe',
          utilityId
        },
        {
          attributeName: 'Installation Date',
          datatype: 'date',
          applicableTo: 'connection',
          isRequired: true,
          description: 'Date of connection installation',
          utilityId
        },
        {
          attributeName: 'Usage Type',
          datatype: 'multiselect',
          applicableTo: 'connection',
          isRequired: true,
          validationRules: {
            options: ['Drinking', 'Irrigation', 'Industrial', 'Commercial']
          },
          description: 'Types of water usage',
          utilityId
        }
      ];

      // Create templates one by one
      const createdTemplates = await Promise.all([
        ...consumerTemplates,
        ...connectionTemplates
      ].map(template => attributeTemplateService.createTemplate(template)));

      res.status(201).json({
        message: 'Sample templates created successfully',
        count: createdTemplates.length
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateTemplate(req: Request, res: Response) {
    try {
      const { templateId } = req.params;
      const template = await attributeTemplateService.updateTemplate(templateId, req.body);
      res.json(template);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteTemplate(req: Request, res: Response) {
    try {
      const { templateId } = req.params;
      await attributeTemplateService.deleteTemplate(templateId);
      res.json({ message: 'Template deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTemplateById(req: Request, res: Response) {
    try {
      const { templateId } = req.params;
      const template = await attributeTemplateService.getTemplateById(templateId);
      res.json(template);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async bulkCreateTemplates(req: Request, res: Response) {
    try {
      const templates = req.body;
      const createdTemplates = await attributeTemplateService.bulkCreateTemplates(templates);
      res.status(201).json({
        message: 'Templates created successfully',
        count: createdTemplates.length,
        templates: createdTemplates
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async validateTemplateData(req: Request, res: Response) {
    try {
      const { templateId } = req.params;
      const { data } = req.body;
      const validationResult = await attributeTemplateService.validateTemplateData(templateId, data);
      res.json(validationResult);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTemplatesByUtility(req: Request, res: Response) {
    try {
      const { utilityId } = req.params;
      const templates = await attributeTemplateService.getTemplatesByUtility(utilityId);
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new AttributeTemplateController();
