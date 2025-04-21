import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { BaseModel, BaseAttributes } from './base.model';
import Utility from './utility.model';

interface ConsumerCategoryAttributes extends BaseAttributes {
  categoryId: string;
  utilityId: string;
  categoryName: string;
  shortCode: string;  
  longCode: string;   
  description?: string;
  attributes?: any;
}

class ConsumerCategory extends BaseModel<ConsumerCategoryAttributes> implements ConsumerCategoryAttributes {
  public categoryId!: string;
  public utilityId!: string;
  public categoryName!: string;
  public shortCode!: string;
  public longCode!: string;
  public description?: string;
  public attributes?: any;
}

ConsumerCategory.init(
  {
    categoryId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    utilityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Utility,
        key: 'utilityId',
      },
    },
    categoryName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    shortCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      }
    },
    longCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      }
    },
    description: {
      type: DataTypes.TEXT,
    },
    attributes: {
      type: DataTypes.JSONB,
    },
  },
  {
    sequelize,
    tableName: 'consumer_categories',
    timestamps: true,
  }
);



export default ConsumerCategory;
// import Consumer from './consumer.model';

// ConsumerCategory.hasMany(Consumer, {
//   foreignKey: 'categoryId',
//   as: 'consumers'
// });
