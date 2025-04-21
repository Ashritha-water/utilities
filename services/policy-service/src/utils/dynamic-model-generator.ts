import { Model, DataTypes, Sequelize, ModelStatic } from 'sequelize';
import PolicyDefinition from '../models/policy-definition.model';

export class DynamicModelGenerator {
  private static instance: DynamicModelGenerator;
  private models: Map<string, ModelStatic<Model>> = new Map();

  private constructor() {}

  public static getInstance(): DynamicModelGenerator {
    if (!DynamicModelGenerator.instance) {
      DynamicModelGenerator.instance = new DynamicModelGenerator();
    }
    return DynamicModelGenerator.instance;
  }

  public async generateModel(
    policyDefinition: PolicyDefinition,
    sequelize: Sequelize
  ): Promise<ModelStatic<Model>> {
    const modelName = `DynamicPolicy_${policyDefinition.id}`;
    
    if (this.models.has(modelName)) {
      return this.models.get(modelName)!;
    }

    const attributes: Record<string, any> = {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      policyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'policies',
          key: 'id',
        },
      },
    };

    // Add dynamic attributes based on policy definition
    for (const attr of policyDefinition.structure.attributes) {
      attributes[attr.name] = this.getAttributeDefinition(attr);
    }

    // Create the model class
    const DynamicModel = class extends Model {
      public id!: number;
      public policyId!: number;
      [key: string]: any;
    };

    // Initialize the model
    DynamicModel.init(attributes, {
      sequelize,
      tableName: `dynamic_policy_${policyDefinition.id}`,
      modelName,
    });

    if (policyDefinition.structure.relationships) {
      for (const relation of policyDefinition.structure.relationships) {
        const targetModel = this.models.get(relation.model);
        if (targetModel) {
          switch (relation.type) {
            case 'hasMany':
              DynamicModel.hasMany(targetModel, { foreignKey: relation.foreignKey });
              break;
            case 'belongsTo':
              DynamicModel.belongsTo(targetModel, { foreignKey: relation.foreignKey });
              break;
            case 'hasOne':
              DynamicModel.hasOne(targetModel, { foreignKey: relation.foreignKey });
              break;
          }
        }
      }
    }

    this.models.set(modelName, DynamicModel);
    return DynamicModel;
  }

  private getAttributeDefinition(attr: any): any {
    const baseDefinition: any = {
      allowNull: !attr.required,
      defaultValue: attr.defaultValue,
    };

    switch (attr.type) {
      case 'string':
        return {
          ...baseDefinition,
          type: DataTypes.STRING,
        };
      case 'number':
        return {
          ...baseDefinition,
          type: DataTypes.DECIMAL(10, 2),
        };
      case 'boolean':
        return {
          ...baseDefinition,
          type: DataTypes.BOOLEAN,
        };
      case 'date':
        return {
          ...baseDefinition,
          type: DataTypes.DATE,
        };
      case 'enum':
        return {
          ...baseDefinition,
          type: DataTypes.ENUM(...(attr.enumValues || [])),
        };
      case 'reference':
        return {
          ...baseDefinition,
          type: DataTypes.INTEGER,
          references: {
            model: attr.referenceModel,
            key: 'id',
          },
        };
      default:
        throw new Error(`Unsupported attribute type: ${attr.type}`);
    }
  }
} 