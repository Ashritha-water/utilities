import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Policy from './policy.model';

interface BulkAgreementAttributes {
  id: number;
  policyId: number;
  name: string;
  description: string;
  minimumQuantity: number;
  baseRate: number;
  sewerageRate: number;
  discountPercentage: number;
  isActive: boolean;
}

class BulkAgreement extends Model<BulkAgreementAttributes> implements BulkAgreementAttributes {
  public id!: number;
  public policyId!: number;
  public name!: string;
  public description!: string;
  public minimumQuantity!: number;
  public baseRate!: number;
  public sewerageRate!: number;
  public discountPercentage!: number;
  public isActive!: boolean;
}

BulkAgreement.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    minimumQuantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    baseRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    sewerageRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discountPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'bulk_agreements',
  }
);

export default BulkAgreement; 