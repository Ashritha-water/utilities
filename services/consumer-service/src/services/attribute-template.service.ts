import { v4 as uuidv4 } from 'uuid';
import AttributeTemplate from '../models/attribute-template.model';
import { ValidationError } from 'sequelize';

interface FormField {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  value?: string;
  pattern?: string;
  min?: number;
  max?: number;
  options?: string[];
}

interface FormGroup {
  type: string;
  fields: FormField[];
}

export interface IAttributeTemplate {
  templateId?: string;
  attributeName: string;
  datatype: string;
  applicableTo: string;
  isRequired: boolean;
  defaultValue?: string;
  validationRules?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
    customValidation?: string;
  };
  description?: string;
  utilityId: string;
}

interface FormField {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  value?: string;
  pattern?: string;
  min?: number;
  max?: number;
  options?: string[];
}

interface FormGroup {
  type: string;
  fields: FormField[];
}

class AttributeTemplateService {
  async createTemplate(data: IAttributeTemplate): Promise<AttributeTemplate> {
    try {
      return await AttributeTemplate.create({
        ...data,
        templateId: uuidv4()
      });
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw new Error(`Validation error: ${error.message}`);
      }
      throw new Error(`Failed to create attribute template: ${error.message}`);
    }
  }

  async getTemplatesByType(utilityId: string, applicableTo: string): Promise<AttributeTemplate[]> {
    try {
      return await AttributeTemplate.findAll({
        where: { utilityId, applicableTo },
        order: [['attributeName', 'ASC']]
      });
    } catch (error) {
      throw new Error('Failed to fetch attribute templates');
    }
  }

  async generateDynamicForm(utilityId: string, applicableTo: string): Promise<{ groups: FormGroup[], validationSchema: any }> {
    try {
      const templates = await this.getTemplatesByType(utilityId, applicableTo);
      
      // Group templates by their data type for better organization
      const groupedTemplates = templates.reduce((acc, template) => {
        const type = template.datatype;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(template);
        return acc;
      }, {} as Record<string, IAttributeTemplate[]>);

      // Generate form fields based on template types
      const formFields = Object.entries(groupedTemplates).map(([type, templates]: [string, IAttributeTemplate[]]) => {
        const fields = templates.map((template: IAttributeTemplate) => {
          const field: FormField = {
            name: template.attributeName,
            type: template.datatype,
            required: template.isRequired,
            description: template.description,
            value: template.defaultValue
          };

          // Add validation rules based on data type
          if (template.validationRules) {
            switch (template.datatype) {
              case 'string':
                if (template.validationRules.pattern) {
                  field.pattern = template.validationRules.pattern;
                }
                break;
              case 'number':
                if (template.validationRules.min !== undefined) {
                  field.min = template.validationRules.min;
                }
                if (template.validationRules.max !== undefined) {
                  field.max = template.validationRules.max;
                }
                break;
              case 'select':
                if (template.validationRules.options) {
                  field.options = template.validationRules.options;
                }
                break;
              case 'multiselect':
                if (template.validationRules.options) {
                  field.options = template.validationRules.options;
                }
                break;
              case 'email':
                field.pattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$';
                break;
              case 'phone':
                field.pattern = '^\+?[1-9]\d{1,14}$';
                break;
            }
          }

          return field;
        });

        return {
          type,
          fields
        };
      });

      return {
        groups: formFields,
        validationSchema: {
          required: templates.filter(t => t.isRequired).map(t => t.attributeName),
          patterns: templates.reduce((acc, template) => {
            if (template.validationRules?.pattern) {
              acc[template.attributeName] = template.validationRules.pattern;
            }
            return acc;
          }, {} as { [key: string]: string }),
          minValues: templates.reduce((acc, template) => {
            if (template.validationRules?.min !== undefined) {
              acc[template.attributeName] = template.validationRules.min;
            }
            return acc;
          }, {} as { [key: string]: number }),
          maxValues: templates.reduce((acc, template) => {
            if (template.validationRules?.max !== undefined) {
              acc[template.attributeName] = template.validationRules.max;
            }
            return acc;
          }, {} as { [key: string]: number })
        }
      };
    } catch (error) {
      throw new Error('Failed to generate dynamic form');
    }
  }

  async updateTemplate(templateId: string, data: Partial<IAttributeTemplate>): Promise<AttributeTemplate> {
    try {
      const template = await AttributeTemplate.findByPk(templateId);
      if (!template) {
        throw new Error('Template not found');
      }
      return await template.update(data);
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw new Error(`Validation error: ${error.message}`);
      }
      throw new Error(`Failed to update attribute template: ${error.message}`);
    }
  }

  async deleteTemplate(templateId: string): Promise<void> {
    try {
      const template = await AttributeTemplate.findByPk(templateId);
      if (!template) {
        throw new Error('Template not found');
      }
      await template.destroy();
    } catch (error: any) {
      throw new Error(`Failed to delete attribute template: ${error.message}`);
    }
  }

  async getTemplateById(templateId: string): Promise<AttributeTemplate> {
    try {
      const template = await AttributeTemplate.findByPk(templateId);
      if (!template) {
        throw new Error('Template not found');
      }
      return template;
    } catch (error: any) {
      throw new Error(`Failed to fetch attribute template: ${error.message}`);
    }
  }

  async bulkCreateTemplates(templates: IAttributeTemplate[]): Promise<AttributeTemplate[]> {
    try {
      const templatesWithIds = templates.map(template => ({
        ...template,
        templateId: uuidv4()
      }));
      return await AttributeTemplate.bulkCreate(templatesWithIds);
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw new Error(`Validation error: ${error.message}`);
      }
      throw new Error(`Failed to create attribute templates: ${error.message}`);
    }
  }

  async validateTemplateData(templateId: string, data: any): Promise<{ isValid: boolean; errors: string[] }> {
    try {
      const template = await this.getTemplateById(templateId);
      const errors: string[] = [];

      // Validate required field
      if (template.isRequired && !data) {
        errors.push(`${template.attributeName} is required`);
        return { isValid: false, errors };
      }

      // Validate data type
      switch (template.datatype) {
        case 'string':
          if (typeof data !== 'string') {
            errors.push(`${template.attributeName} must be a string`);
          }
          break;
        case 'number':
          if (typeof data !== 'number') {
            errors.push(`${template.attributeName} must be a number`);
          }
          break;
        case 'boolean':
          if (typeof data !== 'boolean') {
            errors.push(`${template.attributeName} must be a boolean`);
          }
          break;
        case 'email':
          if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data)) {
            errors.push(`${template.attributeName} must be a valid email address`);
          }
          break;
        case 'phone':
          if (!/^\+?[1-9]\d{1,14}$/.test(data)) {
            errors.push(`${template.attributeName} must be a valid phone number`);
          }
          break;
      }

      // Validate against custom rules
      if (template.validationRules) {
        if (template.validationRules.min !== undefined && data < template.validationRules.min) {
          errors.push(`${template.attributeName} must be greater than or equal to ${template.validationRules.min}`);
        }
        if (template.validationRules.max !== undefined && data > template.validationRules.max) {
          errors.push(`${template.attributeName} must be less than or equal to ${template.validationRules.max}`);
        }
        if (template.validationRules.pattern && !new RegExp(template.validationRules.pattern).test(data)) {
          errors.push(`${template.attributeName} does not match the required pattern`);
        }
        if (template.validationRules.options && !template.validationRules.options.includes(data)) {
          errors.push(`${template.attributeName} must be one of: ${template.validationRules.options.join(', ')}`);
        }
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error: any) {
      throw new Error(`Failed to validate template data: ${error.message}`);
    }
  }

  async getTemplatesByUtility(utilityId: string): Promise<AttributeTemplate[]> {
    try {
      return await AttributeTemplate.findAll({
        where: { utilityId },
        order: [['applicableTo', 'ASC'], ['attributeName', 'ASC']]
      });
    } catch (error: any) {
      throw new Error(`Failed to fetch templates for utility: ${error.message}`);
    }
  }
}

export default new AttributeTemplateService();
