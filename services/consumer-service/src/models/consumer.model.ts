import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { BaseModel, BaseAttributes } from './base.model';
import Utility from './utility.model';
import ConsumerCategory from './consumer-category.model';
import ConsumerStatus from './consumer-status.model';
import OrganizationUnit from './organization-unit.model';
interface ConsumerAttributes extends BaseAttributes {
  consumerId: string;
  utilityId: string;
  consumerNumber: string;
  name: string;
  categoryId: string;
  status: string;
  address?: any;
  mobileNumber?: string;
  email?: string;
  attributes?: any;
  organizationUnitId: string;
}

class Consumer extends BaseModel<ConsumerAttributes> implements ConsumerAttributes {
  public consumerId!: string;
  public utilityId!: string;
  public consumerNumber!: string;
  public name!: string;
  public categoryId!: string;
  public status!: string;
  public address?: any;
  public mobileNumber?: string;
  public email?: string;
  public attributes?: any;
  public organizationUnitId!: string;
}

Consumer.init(
  {
    consumerId: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
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
    consumerNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: ConsumerCategory,
        key: 'categoryId',
      },
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: ConsumerStatus,
        key: 'statusCode',
      },
    },
    address: {
      type: DataTypes.TEXT,  // Changed from JSONB to TEXT to handle existing data
      get() {
        const rawValue = this.getDataValue('address');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value: any) {
        this.setDataValue('address', value ? JSON.stringify(value) : null);
      }
    },
    mobileNumber: {
      type: DataTypes.STRING(15),
    },
    email: {
      type: DataTypes.STRING(255),
    },
    attributes: {
      type: DataTypes.TEXT,  // Changed from JSONB to TEXT to handle existing data
      get() {
        const rawValue = this.getDataValue('attributes');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value: any) {
        this.setDataValue('attributes', value ? JSON.stringify(value) : null);
      }
    },
    organizationUnitId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: OrganizationUnit,
        key: 'unitId',
      },
    },
  },
  {
    sequelize,
    tableName: 'consumers',
    timestamps: true,
    paranoid: true, // This enables soft deletes (deleted_at)
    indexes: [
      {
        unique: true,
        fields: ['consumerId']
      }
    ]
  }
);

Consumer.belongsTo(OrganizationUnit, {
  foreignKey: 'organizationUnitId',
  as: 'organizationUnit',
});
Consumer.belongsTo(ConsumerCategory, {
  foreignKey: 'categoryId',
  as: 'category'
});

export default Consumer;

// Import this after export to avoid circular dependency
import Connection from './connection.model';

// Add association after import
Consumer.hasMany(Connection, {
  foreignKey: 'consumerId',
  as: 'connections',
});


