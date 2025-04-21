import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import PolicyDefinition from './policy-definition.model';
import Policy from './policy.model';
import Category from './category.model';
import SlabRate from './slab-rate.model';
import PipeSize from './pipe-size.model';
import CategoryRule from './category-rule.model';
import BulkAgreement from './bulk-agreement.model';

// Set up relationships
PolicyDefinition.hasMany(Policy, { foreignKey: 'policyDefinitionId' });
Policy.belongsTo(PolicyDefinition, { foreignKey: 'policyDefinitionId' });

Policy.hasMany(CategoryRule, { foreignKey: 'policyId' });
CategoryRule.belongsTo(Policy, { foreignKey: 'policyId' });

Category.hasMany(CategoryRule, { foreignKey: 'categoryId' });
CategoryRule.belongsTo(Category, { foreignKey: 'categoryId' });

PipeSize.hasMany(CategoryRule, { foreignKey: 'pipeSizeId' });
CategoryRule.belongsTo(PipeSize, { foreignKey: 'pipeSizeId' });

Policy.hasMany(BulkAgreement, { foreignKey: 'policyId' });
BulkAgreement.belongsTo(Policy, { foreignKey: 'policyId' });

export {
  Model,
  DataTypes,
  sequelize,
  PolicyDefinition,
  Policy,
  Category,
  SlabRate,
  PipeSize,
  CategoryRule,
  BulkAgreement,
}; 