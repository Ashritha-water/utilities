import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface PolicyDefinitionAttributes {
  id: number;
  utilityId: number;
  name: string;
  description: string;
  structure: {
    attributes: Array<{
      name: string;
      type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'reference';
      label: string;
      required: boolean;
      defaultValue?: any;
      enumValues?: string[];
      referenceModel?: string;
      validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        custom?: string;
      };
    }>;
    relationships?: Array<{
      name: string;
      type: 'hasMany' | 'belongsTo' | 'hasOne';
      model: string;
      foreignKey: string;
    }>;
  };
  isActive: boolean;
}

class PolicyDefinition extends Model<PolicyDefinitionAttributes> implements PolicyDefinitionAttributes {
  public id!: number;
  public utilityId!: number;
  public name!: string;
  public description!: string;
  public structure!: {
    attributes: Array<{
      name: string;
      type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'reference';
      label: string;
      required: boolean;
      defaultValue?: any;
      enumValues?: string[];
      referenceModel?: string;
      validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        custom?: string;
      };
    }>;
    relationships?: Array<{
      name: string;
      type: 'hasMany' | 'belongsTo' | 'hasOne';
      model: string;
      foreignKey: string;
    }>;
  };
  public isActive!: boolean;
}

PolicyDefinition.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    utilityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    structure: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'policy_definitions',
  }
);

export default PolicyDefinition; 