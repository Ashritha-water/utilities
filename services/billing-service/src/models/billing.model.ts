import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface BillingRecordAttributes {
  id?: number;  // ✅ Make `id` optional
  consumerId: number;
  utilityId: number;
  policyId: number;
  categoryId: number;
  consumption: number;
  totalAmount: number;
  details: object;
}


class BillingRecord extends Model<BillingRecordAttributes> implements BillingRecordAttributes {
  public id!: number;
  public consumerId!: number;
  public utilityId!: number;
  public policyId!: number;
  public categoryId!: number;
  public consumption!: number;
  public totalAmount!: number;
  public details!: object;
  // public createdAt!: Date;
  // public updatedAt!: Date;
}

BillingRecord.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    consumerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: {
      //   model: 'consumers', // Will be fetched via API
      //   key: 'id',
      // },
    },
    utilityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: {
      //   model: 'utilities', // Will be fetched via API
      //   key: 'id',
      // },
    },
    policyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: {
      //   model: 'policies', // Will be fetched via API
      //   key: 'id',
      // },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: {
      //   model: 'categories', // Will be fetched via API
      //   key: 'id',
      // },
    },
    consumption: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    details: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'billing_records',
  }
);


export default BillingRecord; 