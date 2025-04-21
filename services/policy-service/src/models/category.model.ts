import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface CategoryAttributes {
  id: number;
  utilityId: number;
  code: string;
  name: string;
  description?: string;
  categoryType: string;
  isActive: boolean;
}

class Category extends Model<CategoryAttributes> implements CategoryAttributes {
  public id!: number;
  public utilityId!: number;
  public code!: string;
  public name!: string;
  public description?: string;
  public categoryType!: string;
  public isActive!: boolean;
}

Category.init(
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
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoryType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'categories',
  }
);

export default Category; 