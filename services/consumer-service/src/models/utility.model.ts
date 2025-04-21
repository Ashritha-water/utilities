import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { BaseModel, BaseAttributes } from './base.model';

interface UtilityAttributes extends BaseAttributes {
  utilityId: string;
  utilityName: string;
  utilityCode: string;
  address: any;
  contactDetails: any;
  config: any;
}

class Utility extends BaseModel<UtilityAttributes> implements UtilityAttributes {
  public utilityId!: string;
  public utilityName!: string;
  public utilityCode!: string;
  public address!: any;
  public contactDetails!: any;
  public config!: any;
}

Utility.init(
  {
    utilityId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    utilityName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    utilityCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.JSONB,
    },
    contactDetails: {
      type: DataTypes.JSONB,
    },
    config: {
      type: DataTypes.JSONB,
    },
  },
  {
    sequelize,
    tableName: 'utilities',
    timestamps: true,
  }
);

export default Utility;
