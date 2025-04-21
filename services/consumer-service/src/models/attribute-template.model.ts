import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Utility from './utility.model';

interface AttributeTemplateAttributes {
  templateId: string;
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

class AttributeTemplate extends Model<AttributeTemplateAttributes> implements AttributeTemplateAttributes {
  public templateId!: string;
  public attributeName!: string;
  public datatype!: string;
  public applicableTo!: string;
  public isRequired!: boolean;
  public defaultValue?: string;
  public validationRules?: any;
  public description?: string;
  public utilityId!: string;
}

AttributeTemplate.init(
  {
    templateId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    attributeName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    datatype: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['string', 'number', 'boolean', 'date', 'email', 'phone', 'select', 'multiselect']]
      }
    },
    applicableTo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['consumer', 'connection']]
      }
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    defaultValue: {
      type: DataTypes.TEXT,
    },
    validationRules: {
      type: DataTypes.JSONB,
      validate: {
        isValidRule(value: any) {
          if (!value) return;
          
          const allowedKeys = ['min', 'max', 'pattern', 'options', 'customValidation'];
          const keys = Object.keys(value);
          
          if (!keys.every(key => allowedKeys.includes(key))) {
            throw new Error('Invalid validation rule keys');
          }

          if (value.min !== undefined && typeof value.min !== 'number') {
            throw new Error('min must be a number');
          }

          if (value.max !== undefined && typeof value.max !== 'number') {
            throw new Error('max must be a number');
          }

          if (value.pattern !== undefined && typeof value.pattern !== 'string') {
            throw new Error('pattern must be a string');
          }

          if (value.options !== undefined && !Array.isArray(value.options)) {
            throw new Error('options must be an array');
          }

          if (value.customValidation !== undefined && typeof value.customValidation !== 'string') {
            throw new Error('customValidation must be a string');
          }
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
    },
    utilityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Utility,
        key: 'utilityId',
      },
    },
  },
  {
    sequelize,
    tableName: 'attribute_templates',
    timestamps: true,
  }
);

export default AttributeTemplate;
