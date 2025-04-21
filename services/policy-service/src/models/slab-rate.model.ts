import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Policy from './policy.model';
import Category from './category.model';

interface SlabRateAttributes {
  id: number;
  policyId: number;
  categoryId: number;
  startUnit: number;
  endUnit: number;
  rate: number;
  isActive: boolean;
}

class SlabRate extends Model<SlabRateAttributes> implements SlabRateAttributes {
  public id!: number;
  public policyId!: number;
  public categoryId!: number;
  public startUnit!: number;
  public endUnit!: number;
  public rate!: number;
  public isActive!: boolean;
}

SlabRate.init(
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
    startUnit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    endUnit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    rate: {
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
    tableName: 'slab_rates',
  }
);

// Define relationships
Policy.hasMany(SlabRate, { foreignKey: 'policyId' });
SlabRate.belongsTo(Policy, { foreignKey: 'policyId' });

Category.hasMany(SlabRate, { foreignKey: 'categoryId' });
SlabRate.belongsTo(Category, { foreignKey: 'categoryId' });

export default SlabRate; 