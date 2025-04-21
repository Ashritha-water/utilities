import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Policy from './policy.model';
import Category from './category.model';
import PipeSize from './pipe-size.model';

interface CategoryRuleAttributes {
  id: number;
  policyId: number;
  categoryId: number;
  pipeSizeId: number;
  baseRate: number;
  sewerageRate: number;
  minimumBill: number;
  isActive: boolean;
}

class CategoryRule extends Model<CategoryRuleAttributes> implements CategoryRuleAttributes {
  public id!: number;
  public policyId!: number;
  public categoryId!: number;
  public pipeSizeId!: number;
  public baseRate!: number;
  public sewerageRate!: number;
  public minimumBill!: number;
  public isActive!: boolean;
}

CategoryRule.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    policyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Policy,
        key: 'id',
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: 'id',
      },
    },
    pipeSizeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PipeSize,
        key: 'id',
      },
    },
    baseRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    sewerageRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    minimumBill: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'category_rules',
  }
);

export default CategoryRule; 