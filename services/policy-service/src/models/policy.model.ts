import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import PolicyDefinition from './policy-definition.model';

interface PolicyAttributes {
  id?: number;  // Optional for creation, required for retrieval
  policyDefinitionId: number;
  utilityId: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  period: string;  // e.g., "JUN 2002 - SEP 2004"
  category: string;
  isActive: boolean;
  rules: Record<string, any>;
}

class Policy extends Model<PolicyAttributes> implements PolicyAttributes {
  public id!: number;
  public policyDefinitionId!: number;
  public utilityId!: number;
  public name!: string;
  public description!: string;
  public startDate!: Date;
  public endDate!: Date;
  public period!: string;
  public category!: string;
  public isActive!: boolean;
  public rules!: Record<string, any>;
}

Policy.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    policyDefinitionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PolicyDefinition,
        key: 'id',
      },
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
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    period: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    rules: {
      type: DataTypes.JSONB,  // ✅ Storing JSONB format
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'policies',
  }
);

// Define relationships
PolicyDefinition.hasMany(Policy, { foreignKey: 'policyDefinitionId' });
Policy.belongsTo(PolicyDefinition, { foreignKey: 'policyDefinitionId' });

export default Policy;